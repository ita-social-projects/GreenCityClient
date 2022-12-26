import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { takeUntil, switchMap } from 'rxjs/operators';
import { iif, Observable, of, Subject, throwError } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ajax } from 'rxjs/internal-compatibility';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { Address, CourierLocations } from 'src/app/ubs/ubs/models/ubs.interface';
import { Patterns } from 'src/assets/patterns/patterns';
import { Locations } from 'src/assets/locations/locations';

@Component({
  selector: 'app-ubs-add-address-pop-up',
  templateUrl: './ubs-add-address-pop-up.component.html',
  styleUrls: ['./ubs-add-address-pop-up.component.scss']
})
export class UBSAddAddressPopUpComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('locationInput') input: ElementRef;
  @ViewChild('streetInput') streetInput: ElementRef;

  placeService: google.maps.places.PlacesService;
  address: Address;
  formattedAddress: string;
  updatedAddresses: Address[];
  addAddressForm: FormGroup;
  isDisabled = false;
  corpusPattern = Patterns.ubsCorpusPattern;
  housePattern = Patterns.ubsHousePattern;
  entranceNumberPattern = Patterns.ubsEntrNumPattern;
  private destroy: Subject<boolean> = new Subject<boolean>();
  isDistrict = false;
  currentLanguage: string;
  public isDeleting: boolean;
  locations: CourierLocations;
  bigRegions;
  regionBounds;
  autocomplete;
  regionsKyiv = [];
  regions = [];
  cities = [];

  bigRegionsList = [
    { regionName: 'Київська область', lang: 'ua' },
    { regionName: 'Kyiv region', lang: 'en' }
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<UBSAddAddressPopUpComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      edit: boolean;
      address: Address;
    },
    private snackBar: MatSnackBarComponent,
    private localStorageService: LocalStorageService,
    private listOflocations: Locations
  ) {}

  get region() {
    return this.addAddressForm.get('region');
  }

  get regionEn() {
    return this.addAddressForm.get('regionEn');
  }

  get district() {
    return this.addAddressForm.get('district');
  }

  get districtEn() {
    return this.addAddressForm.get('districtEn');
  }

  get city() {
    return this.addAddressForm.get('city');
  }

  get cityEn() {
    return this.addAddressForm.get('cityEn');
  }

  get street() {
    return this.addAddressForm.get('street');
  }

  get streetEn() {
    return this.addAddressForm.get('streetEn');
  }

  get houseNumber() {
    return this.addAddressForm.get('houseNumber');
  }

  get houseCorpus() {
    return this.addAddressForm.get('houseCorpus');
  }

  get entranceNumber() {
    return this.addAddressForm.get('entranceNumber');
  }

  get addressComment() {
    return this.addAddressForm.get('addressComment');
  }

  ngOnInit() {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.bigRegions = this.bigRegionsList.filter((el) => el.lang === this.currentLanguage);
    this.addAddressForm = this.fb.group({
      region: [this.data.edit ? this.data.address.region : null, Validators.required],
      regionEn: [this.data.edit ? this.data.address.regionEn : null, Validators.required],
      city: [this.data.edit ? this.data.address.city : null, Validators.required],
      cityEn: [this.data.edit ? this.data.address.cityEn : null, Validators.required],
      district: [this.data.edit ? this.data.address.district.split(' ')[0] : '', Validators.required],
      districtEn: [this.data.edit ? this.data.address.districtEn.split(' ')[0] : '', Validators.required],
      street: [this.data.edit ? this.data.address.street : '', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
      streetEn: [
        this.data.edit ? this.data.address.streetEn : '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(40)]
      ],
      houseNumber: [
        this.data.edit ? this.data.address.houseNumber : '',
        [Validators.required, Validators.maxLength(8), Validators.pattern(this.housePattern)]
      ],
      houseCorpus: [this.data.edit ? this.data.address.houseCorpus : '', [Validators.maxLength(8), Validators.pattern(this.corpusPattern)]],
      entranceNumber: [
        this.data.edit ? this.data.address.entranceNumber : '',
        [Validators.maxLength(2), Validators.pattern(this.entranceNumberPattern)]
      ],
      searchAddress: [''],
      addressComment: [this.data.edit ? this.data.address.addressComment : '', Validators.maxLength(255)],
      coordinates: {
        latitude: this.data.edit ? this.data.address.coordinates.latitude : '',
        longitude: this.data.edit ? this.data.address.coordinates.longitude : ''
      },
      id: [this.data.edit ? this.data.address.id : 0],
      actual: true
    });

    this.region.setValue(this.bigRegionsList[0].regionName);
    this.regionEn.setValue(this.bigRegionsList[1].regionName);

    this.addAddressForm
      .get(this.currentLanguage === 'ua' ? 'city' : 'cityEn')
      .valueChanges.pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.addressComment.reset('');
        this.districtEn.reset('');
        this.district.reset('');
        this.entranceNumber.reset('');
        this.houseCorpus.reset('');
        this.houseNumber.reset('');
        this.street.reset('');
        this.streetEn.reset('');
      });

    this.cities = this.listOflocations.getCity(this.currentLanguage);
    this.regionsKyiv = this.listOflocations.getRegionsKyiv(this.currentLanguage);
    this.regions = this.listOflocations.getRegions(this.currentLanguage);
  }

  ngAfterViewInit(): void {
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
    this.setCitiesPrediction();
  }

  setCitiesPrediction(): void {
    let localityOptions;
    const cityKyivId = 'ChIJBUVa4U7P1EAR_kYBF9IxSXY';
    const autocomplete = new google.maps.places.Autocomplete(this.input.nativeElement, localityOptions);

    this.placeService.getDetails({ placeId: 'ChIJ94pF_F3O1EARB10ge68K4KY' }, (oblast) => {
      const center = oblast.geometry.viewport.getCenter();
      this.regionBounds = {
        north: center.lat() + 0.5,
        south: center.lat() - 0.5,
        east: center.lng() + 0.5,
        west: center.lng() - 0.5
      };
      autocomplete.setBounds(this.regionBounds);
    });
    localityOptions = {
      bounds: this.regionBounds,
      strictBounds: true,
      language: this.currentLanguage,
      types: ['(cities)'],
      componentRestrictions: { country: 'ua' }
    };
    autocomplete.setOptions(localityOptions);

    autocomplete.addListener('place_changed', () => {
      const locationName = autocomplete.getPlace().name;
      this.isDistrict = autocomplete.getPlace().place_id === cityKyivId ? true : false;

      this.city.setValue(locationName);
      this.translateInput(locationName, this.cityEn);
      this.toPredictStreet(autocomplete.getPlace());
    });
  }

  toPredictStreet(placeResult: any): void {
    let localityOptions;

    const autocomplete = new google.maps.places.Autocomplete(this.streetInput.nativeElement, localityOptions);

    const l = placeResult.geometry.viewport.getSouthWest();
    const x = placeResult.geometry.viewport.getNorthEast();
    const cityBounds = new google.maps.LatLngBounds(l, x);
    autocomplete.setBounds(cityBounds);
    localityOptions = {
      bounds: cityBounds,
      strictBounds: true,
      types: ['address'],
      componentRestrictions: { country: 'ua' }
    };
    autocomplete.setOptions(localityOptions);
    autocomplete.addListener('place_changed', () => {
      const streetName = autocomplete.getPlace().name.split('.').join('');
      console.log(autocomplete.getPlace());
      this.street.setValue(streetName);
      this.translateInput(streetName, this.streetEn);
      // this.setFormattedAddress(autocomplete.getPlace());
      this.formattedAddress = autocomplete.getPlace().formatted_address.split('.').join('');
      console.log(this.formattedAddress);
      console.log(this.addAddressForm);

      // this.getJSON(autocomplete.getPlace().formatted_address.split('.').join("")).subscribe((data) => {
      //   this.formattedAddress = data[0][0][0];
      //   console.log(this.formattedAddress)
      // });

      if (this.isDistrict) {
        this.setDistrictAuto(autocomplete.getPlace());
      }
    });
  }

  public getJSON(sourceText: string): Observable<any> {
    return ajax.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=uk&tl=en&dt=t&q=' + encodeURI(sourceText));
  }

  translateInput(sourceText: string, input: AbstractControl): void {
    this.getJSON(sourceText).subscribe((data) => {
      input.setValue(data[0][0][0]);
    });
  }

  setDistrict(event: Event): void {
    const element = (event.target as HTMLSelectElement).value.slice(3);
    this.setDistrictTranslation(element);
  }

  setDistrictTranslation(name: string): void {
    if (this.isDistrict) {
      if (this.currentLanguage === 'ua') {
        const elem = this.listOflocations.getRegionsKyiv('ua').find((el) => el.name === name);
        const dist = this.listOflocations.getRegionsKyiv('en').find((el) => el?.key === elem?.key) || null;
        this.districtEn.setValue(dist?.name);
      } else {
        const elem = this.listOflocations.getRegionsKyiv('en').find((el) => el.name === name);
        const dist = this.listOflocations.getRegionsKyiv('ua').find((el) => el?.key === elem?.key) || null;
        this.district.setValue(dist?.name);
      }
    } else {
      if (this.currentLanguage === 'ua') {
        const elem = this.listOflocations.getRegions('ua').find((el) => el.name === name);
        const dist = this.listOflocations.getRegions('en').find((el) => el?.key === elem?.key) || null;
        this.districtEn.setValue(dist?.name);
      } else {
        const elem = this.listOflocations.getRegions('en').find((el) => el.name === name);
        const dist = this.listOflocations.getRegions('ua').find((el) => el?.key === elem?.key) || null;
        this.district.setValue(dist?.name);
      }
    }
  }

  translateDistrict(sourceText: string): void {
    this.getJSON(sourceText).subscribe((data) => {
      console.log(data);
      this.district.setValue(data[0][0][1]);
      this.districtEn.setValue(data[0][0][0]);
    });
  }

  setDistrictAuto(event): void {
    const getDistrict = event.address_components.filter((item) => item.long_name.toLowerCase().includes('район'))[0];
    console.log(getDistrict);
    if (getDistrict) {
      const currentDistrict = getDistrict.long_name.split(' ')[0];
      console.log(currentDistrict);
      this.translateDistrict(currentDistrict);
    }
  }

  setFormattedAddress(event: any): void {
    this.formattedAddress = event.formatted_address;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public deleteAddress(): void {
    this.isDeleting = true;
    this.isDisabled = true;
    this.orderService
      .deleteAddress(this.addAddressForm.value)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close('Deleted');
        this.isDisabled = false;
        this.isDeleting = false;
      });
  }

  addAdress(): void {
    const searchAddress = this.formattedAddress ? [...this.formattedAddress.split(',')] : null;
    if (searchAddress) {
      searchAddress.splice(1, 0, ' ' + this.houseNumber.value);
    }
    this.addAddressForm.value.searchAddress = searchAddress?.join(',');
    this.addAddressForm.value.region = this.region.value;
    this.addAddressForm.value.regionEn = this.regionEn.value;
    this.isDisabled = true;

    const addressData = {
      addressComment: this.addressComment.value,
      districtEn: this.districtEn.value,
      district: this.district.value,
      entranceNumber: this.entranceNumber.value,
      houseCorpus: this.houseCorpus.value,
      houseNumber: this.houseNumber.value,
      regionEn: this.addAddressForm.value.regionEn,
      region: this.addAddressForm.value.region,
      searchAddress: this.addAddressForm.value.searchAddress
    };
    console.log(addressData.searchAddress);

    of(true)
      .pipe(
        takeUntil(this.destroy),
        switchMap(() =>
          iif(() => this.data.edit, this.orderService.updateAdress(this.addAddressForm.value), this.orderService.addAdress(addressData))
        )
      )
      .subscribe(
        (list: { addressList: Address[] }) => {
          this.orderService.setCurrentAddress(this.addAddressForm.value);

          this.updatedAddresses = list.addressList;
          this.dialogRef.close('Added');
          this.isDisabled = false;
        },
        (error) => {
          this.snackBar.openSnackBar('existAddress');
          this.dialogRef.close();
          this.isDisabled = false;
          return throwError(error);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
