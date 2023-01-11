import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { takeUntil, switchMap } from 'rxjs/operators';
import { iif, of, Subject, throwError } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { Address, Location, Region } from 'src/app/ubs/ubs/models/ubs.interface';
import { Patterns } from 'src/assets/patterns/patterns';
import { Locations } from 'src/assets/locations/locations';

@Component({
  selector: 'app-ubs-add-address-pop-up',
  templateUrl: './ubs-add-address-pop-up.component.html',
  styleUrls: ['./ubs-add-address-pop-up.component.scss']
})
export class UBSAddAddressPopUpComponent implements OnInit, OnDestroy, AfterViewInit {
  autocompleteService: google.maps.places.AutocompleteService;
  streetPredictionList: google.maps.places.AutocompletePrediction[];
  cityPredictionList: google.maps.places.AutocompletePrediction[];
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
  bigRegions: Region[];
  regionsKyiv: Location[];
  regions: Location[];
  mainUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&libraries=places&language=';

  languages = {
    en: 'en',
    uk: 'uk'
  };

  bigRegionsList = [
    { regionName: 'Київська область', lang: 'ua' },
    { regionName: 'Kyiv Oblast', lang: 'en' }
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
      region: [this.data.edit ? this.data.address.region : this.bigRegionsList[0].regionName, Validators.required],
      regionEn: [this.data.edit ? this.data.address.regionEn : this.bigRegionsList[1].regionName, Validators.required],
      city: [this.data.edit ? this.data.address.city : null, Validators.required],
      cityEn: [this.data.edit ? this.data.address.cityEn : null, Validators.required],
      district: [this.data.edit ? this.data.address.district.split(' ')[0] : '', Validators.required],
      districtEn: [this.data.edit ? this.data.address.districtEn.split(' ')[0] : '', Validators.required],
      street: [this.data.edit ? this.data.address.street : '', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      streetEn: [
        this.data.edit ? this.data.address.streetEn : '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(120)]
      ],
      houseNumber: [
        this.data.edit ? this.data.address.houseNumber : '',
        [Validators.required, Validators.maxLength(4), Validators.pattern(this.housePattern)]
      ],
      houseCorpus: [this.data.edit ? this.data.address.houseCorpus : '', [Validators.maxLength(4), Validators.pattern(this.corpusPattern)]],
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
        this.streetPredictionList = null;
        this.cityPredictionList = null;
      });

    this.regionsKyiv = this.listOflocations.getRegionsKyiv(this.currentLanguage);
    this.regions = this.listOflocations.getRegions(this.currentLanguage);
  }

  ngAfterViewInit(): void {
    this.initGoogleAutocompleteServices();
    this.loadScript();
  }

  private initGoogleAutocompleteServices(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  loadScript(): void {
    const googleScript: HTMLScriptElement = document.querySelector('#googleMaps');

    if (googleScript) {
      googleScript.src = this.mainUrl + this.currentLanguage;
    }
    if (!googleScript) {
      const google = document.createElement('script');
      google.type = 'text/javascript';
      google.id = 'googleMaps';
      google.setAttribute('src', this.mainUrl + this.currentLanguage);
      document.getElementsByTagName('head')[0].appendChild(google);
    }
  }

  setPredictCities(): void {
    this.cityPredictionList = null;
    if (this.currentLanguage === 'ua' && this.city.value) {
      this.inputCity(`Київська область, місто, ${this.city.value}`);
    }

    if (this.currentLanguage === 'en' && this.cityEn.value) {
      this.inputCity(`Kyiv Oblast, City,${this.cityEn.value}`);
    }
  }

  inputCity(searchAddress: string): void {
    const request = {
      input: searchAddress,
      language: this.currentLanguage,
      types: ['(cities)'],
      region: 'ua',
      componentRestrictions: { country: 'ua' }
    };
    this.autocompleteService.getPlacePredictions(request, (cityPredictionList) => {
      this.cityPredictionList = cityPredictionList;
    });
  }

  onCitySelected(city: google.maps.places.AutocompletePrediction): void {
    this.setValueOfCity(city, this.city, this.languages.uk);
    this.setValueOfCity(city, this.cityEn, this.languages.en);
  }

  setValueOfCity(selectedCity: google.maps.places.AutocompletePrediction, abstractControl: AbstractControl, lang: string): void {
    const request = {
      placeId: selectedCity.place_id,
      language: lang
    };
    this.placeService.getDetails(request, (placeDetails) => {
      abstractControl.setValue(placeDetails.name);

      if (abstractControl === this.city) {
        this.isDistrict = this.city.value === 'Київ' ? true : false;
      }
    });
  }

  setPredictStreets(): void {
    this.streetPredictionList = null;
    if (this.currentLanguage === 'ua' && this.street.value) {
      this.inputAddress(`${this.city.value}, ${this.street.value}`);
    }

    if (this.currentLanguage === 'en' && this.streetEn.value) {
      this.inputAddress(`${this.cityEn.value}, ${this.streetEn.value}`);
    }
  }

  inputAddress(searchAddress: string): void {
    const request = {
      input: searchAddress,
      language: this.currentLanguage,
      strictBounds: true,
      types: ['address'],
      componentRestrictions: { country: 'ua' }
    };
    this.autocompleteService.getPlacePredictions(request, (streetPredictions) => {
      if (!this.isDistrict && streetPredictions) {
        this.streetPredictionList = streetPredictions.filter(
          (el) => el.description.includes(this.region.value) || el.description.includes(this.regionEn.value)
        );
      } else {
        this.streetPredictionList = streetPredictions;
      }
    });
  }

  onStreetSelected(street: google.maps.places.AutocompletePrediction): void {
    this.setValueOfStreet(street, this.street, this.languages.uk);
    this.setValueOfStreet(street, this.streetEn, this.languages.en);
  }

  setValueOfStreet(selectedStreet: google.maps.places.AutocompletePrediction, abstractControl: AbstractControl, lang: string): void {
    const request = {
      placeId: selectedStreet.place_id,
      language: lang
    };
    this.placeService.getDetails(request, (placeDetails) => {
      abstractControl.setValue(placeDetails.name);

      if (lang === this.languages.en) {
        this.formattedAddress = placeDetails.formatted_address;
      }
      if (lang === this.languages.en && this.isDistrict) {
        this.setDistrictAuto(placeDetails, this.districtEn, lang);
      }
      if (lang === this.languages.uk && this.isDistrict) {
        this.setDistrictAuto(placeDetails, this.district, lang);
      }
    });
  }

  onDistrictSelected(event: Event): void {
    const districtKey = (event.target as HTMLSelectElement).value.slice(0, 1);
    this.isDistrict ? this.setKyivDistrict(districtKey) : this.setDistrict(districtKey);
  }

  setKyivDistrict(districtKey: string): void {
    const key = Number(districtKey) + 1;
    const selectedDistrict = this.listOflocations.getRegionsKyiv('ua').find((el) => el.key === key);
    const selectedDistricEn = this.listOflocations.getRegionsKyiv('en').find((el) => el.key === key);

    this.district.setValue(selectedDistrict.name);
    this.districtEn.setValue(selectedDistricEn.name);
  }

  setDistrict(districtKey: string): void {
    const key = Number(districtKey) + 1;
    const selectedDistrict = this.listOflocations.getRegions('ua').find((el) => el.key === key);
    const selectedDistricEn = this.listOflocations.getRegions('en').find((el) => el.key === key);

    this.district.setValue(selectedDistrict.name);
    this.districtEn.setValue(selectedDistricEn.name);
  }

  setDistrictAuto(placeDetails: google.maps.places.PlaceResult, abstractControl: AbstractControl, language: string): void {
    const searchItem = language === this.languages.en ? 'district' : 'район';
    const getDistrict = placeDetails.address_components.filter((item) => item.long_name.toLowerCase().includes(searchItem))[0];
    if (getDistrict) {
      const currentDistrict = getDistrict.long_name;
      abstractControl.setValue(currentDistrict);
    }
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
