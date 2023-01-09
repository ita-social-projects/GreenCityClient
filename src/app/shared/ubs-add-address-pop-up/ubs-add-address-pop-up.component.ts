import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { takeUntil, switchMap } from 'rxjs/operators';
import { iif, Observable, of, Subject, throwError } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ajax } from 'rxjs/internal-compatibility';
import { LatLngBoundsLiteral } from '@agm/core';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { Address, CourierLocations } from 'src/app/ubs/ubs/models/ubs.interface';
import { Patterns } from 'src/assets/patterns/patterns';
import { Locations } from 'src/assets/locations/locations';

interface Options {
  bounds: LatLngBoundsLiteral;
  strictBounds: boolean;
  types: string[];
  componentRestrictions: { country: string | string[] };
}

@Component({
  selector: 'app-ubs-add-address-pop-up',
  templateUrl: './ubs-add-address-pop-up.component.html',
  styleUrls: ['./ubs-add-address-pop-up.component.scss']
})
export class UBSAddAddressPopUpComponent implements OnInit, OnDestroy, AfterViewInit {
  inputStreetElement: HTMLElement;
  autocompleteService: google.maps.places.AutocompleteService;
  placeService: google.maps.places.PlacesService;
  streetPredictionList: any;
  options: Options;
  cityOptions: Options;
  cityBounds: LatLngBoundsLiteral;
  address: Address;
  formattedAddress: string;
  updatedAddresses: Address[];
  addAddressForm: FormGroup;
  currentDistrict = '';
  isDisabled = false;
  streetTranslations: string[];
  corpusPattern = Patterns.ubsCorpusPattern;
  housePattern = Patterns.ubsHousePattern;
  entranceNumberPattern = Patterns.ubsEntrNumPattern;
  private destroy: Subject<boolean> = new Subject<boolean>();
  isDistrict = false;
  isKyiv = false;
  currentLanguage: string;
  public isDeleting: boolean;
  locations: CourierLocations;
  currentRegion = {};
  currentCity = {};

  KyivRegion = [
    // Kyiv
    {
      northLat: 50.59079800991073,
      southLat: 50.36107811970851,
      eastLng: 30.82594104187906,
      westLng: 30.23944009690609
    },
    // Hatne
    {
      northLat: 50.37442678529015,
      southLat: 50.33875011559573,
      eastLng: 30.43766503261107,
      westLng: 30.36528835440419
    },
    // Horenka
    {
      northLat: 50.57230832685655,
      southLat: 50.54623397558239,
      eastLng: 30.34209295119151,
      westLng: 30.29022923521974
    },
    // Zazymie
    {
      northLat: 50.61041616146291,
      southLat: 50.55368602265396,
      eastLng: 30.71374415368001,
      westLng: 30.62748562237025
    },
    // Irpin
    {
      northLat: 50.55358870439215,
      southLat: 50.47426305824818,
      eastLng: 30.29792156390341,
      westLng: 30.18841487336181
    },
    // Kniadzychi
    {
      northLat: 50.48184174016671,
      southLat: 50.44120359312664,
      eastLng: 30.81911787071394,
      westLng: 30.7427286619337
    },
    // Kotsiubynske
    {
      northLat: 50.49827703479146,
      southLat: 50.4827099945956,
      eastLng: 30.34905105788864,
      westLng: 30.31743489454659
    },
    // Novosilky
    {
      northLat: 50.36113097482927,
      southLat: 50.34734892884189,
      eastLng: 30.4702960715714,
      westLng: 30.44694299382216
    },
    // Petropavlivska Borshchahivka
    {
      northLat: 50.44963303657267,
      southLat: 50.41125259054702,
      eastLng: 30.36406525639132,
      westLng: 30.30642999550708
    },
    // Pohreby
    {
      northLat: 50.56892842696831,
      southLat: 50.53440775625535,
      eastLng: 30.670464521996,
      westLng: 30.60179475906344
    },
    // Prolisky
    {
      northLat: 50.39777496652665,
      southLat: 50.38887000633115,
      eastLng: 30.80212600252601,
      westLng: 30.77519090221131
    },
    // Sofiivska Borshchahivka
    {
      northLat: 50.42782468468117,
      southLat: 50.3860964715175,
      eastLng: 30.41841193637191,
      westLng: 30.3046957000854
    },
    // Chayky
    {
      northLat: 50.44717523623419,
      southLat: 50.42651061933346,
      eastLng: 30.3137255456495,
      westLng: 30.27492994583497
    },
    // Shchaslyve
    {
      northLat: 50.38754203448847,
      southLat: 50.35395648311329,
      eastLng: 30.8247612642593,
      westLng: 30.76784754829883
    }
  ];

  translation = '';

  cities = [];

  bigRegions = [
    { regionName: 'Київська область', lang: 'ua' },
    { regionName: 'Kyiv region', lang: 'en' }
  ];

  regionsKyiv = [];

  regions = [];

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
    this.bigRegions = this.bigRegions.filter((el) => el.lang === this.currentLanguage);
    this.locations = this.localStorageService.getLocations();
    this.addAddressForm = this.fb.group({
      region: [this.data.edit ? this.data.address.region : null, Validators.required],
      regionEn: [this.data.edit ? this.data.address.regionEn : null, Validators.required],
      city: [this.data.edit ? this.data.address.city : null, Validators.required],
      cityEn: [this.data.edit ? this.data.address.cityEn : null, Validators.required],
      district: [this.data.edit ? this.data.address.district.split(' ')[0] : '', Validators.required],
      districtEn: [this.data.edit ? this.data.address.districtEn.split(' ')[0] : '', Validators.required],
      street: [this.data.edit ? this.data.address.street : '', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
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

    if (this.locations !== null) {
      this.currentRegion = this.currentLanguage === 'ua' ? this.locations.regionDto.nameUk : this.locations.regionDto.nameEn;
      this.currentCity =
        this.currentLanguage === 'ua' ? this.locations.locationsDtosList[0].nameUk : this.locations.locationsDtosList[0].nameEn;

      this.region.setValue(this.locations.regionDto.nameUk);
      this.regionEn.setValue(this.locations.regionDto.nameEn);

      this.city.setValue(this.currentCity);
      this.cityEn.setValue(this.currentCity);
    }

    this.region.setValue(this.bigRegions[0].regionName);
    this.regionEn.setValue(this.bigRegions[0].regionName);

    if (this.currentCity === 'Kyiv' || this.currentCity === 'Київ') {
      this.isDistrict = true;
    }

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
      });

    // TODO: Must be removed if multi-region feature need to be implemented
    this.onCitySelected(this.KyivRegion[0]);

    this.cities = this.listOflocations.getCity(this.currentLanguage);
    this.regionsKyiv = this.listOflocations.getRegionsKyiv(this.currentLanguage);
    this.regions = this.listOflocations.getRegions(this.currentLanguage);
  }

  ngAfterViewInit(): void {
    this.inputStreetElement = document.querySelector('#auto');
    this.inputStreetElement.addEventListener('input', () => this.setPredictStreets());

    this.initGoogleAutocompleteServices();
  }

  private initGoogleAutocompleteServices(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  setPredictStreets(): void {
    this.streetPredictionList = null;
    if (this.currentLanguage === 'ua' && this.street.value) {
      this.inputAddress(`${this.region.value}, ${this.city.value}, ${this.street.value}`);
    }

    if (this.currentLanguage === 'en' && this.streetEn.value) {
      this.inputAddress(`${this.regionEn.value}, ${this.cityEn.value}, ${this.streetEn.value}`);
    }
  }

  inputAddress(searchAddress: string): void {
    const request = {
      input: searchAddress,
      bounds: this.cityBounds,
      types: ['address'],
      componentRestrictions: { country: 'ua' }
    };
    this.autocompleteService.getPlacePredictions(request, (streetPredictions) => {
      this.streetPredictionList = streetPredictions;
    });
  }

  onCitySelected(coordinates): void {
    this.cityBounds = {
      north: coordinates.northLat,
      south: coordinates.southLat,
      east: coordinates.eastLng,
      west: coordinates.westLng
    };

    this.options = {
      bounds: this.cityBounds,
      strictBounds: true,
      types: ['address'],
      componentRestrictions: { country: 'UA' }
    };

    this.cityOptions = {
      bounds: this.cityBounds,
      strictBounds: true,
      types: ['(cities)'],
      componentRestrictions: { country: 'UA' }
    };
  }

  public getJSON(sourceText: string): Observable<any> {
    return ajax.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uk&dt=t&q=' + encodeURI(sourceText));
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
      this.district.setValue(data[0][0][0]);
      this.districtEn.setValue(data[0][0][1]);
    });
  }

  setDistrictAuto(event): void {
    const getDistrict = event.address_components.filter((item) => item.long_name.toLowerCase().includes('district'))[0];
    if (getDistrict) {
      this.currentDistrict = getDistrict.long_name.split(' ')[0];
      this.translateDistrict(this.currentDistrict);
    }
  }

  translateStreet(sourceText: string): void {
    this.getJSON(sourceText).subscribe((data) => {
      this.streetTranslations = data[0][0];
      this.street.setValue(this.streetTranslations[0]);
      this.streetEn.setValue(this.streetTranslations[1]);
    });
  }

  onAutocompleteSelected(event): void {
    let streetName = event.name;
    const regExp = /,* \d+/;
    const num = streetName.match(regExp);

    if (num) {
      streetName = streetName.replace(regExp, '');
      num[0] = num[0].length > 2 ? num[0].replace(', ', '') : num[0];
      this.houseNumber.setValue(num[0]);
    }
    this.translateStreet(streetName);
  }

  setFormattedAddress(event: any): void {
    this.formattedAddress = event.formatted_address;
  }

  onDistrictSelected(event: any): void {
    this.setFormattedAddress(event);
    this.setDistrictAuto(event);
    this.onAutocompleteSelected(event);
  }

  onStreetSelected(streetData) {
    this.placeService.getDetails({ placeId: streetData.place_id }, (streetDto) => {
      this.onDistrictSelected(streetDto);
    });
  }

  selectCity(event: Event): void {
    const cityIndex = (event.target as HTMLSelectElement)?.selectedIndex;
    this.onCitySelected(this.KyivRegion[cityIndex ?? 0]);
    const elem = this.cities.find((el) => {
      if (el.key <= 10) {
        return el.cityName === (event.target as HTMLSelectElement).value.slice(3) ? el : undefined;
      } else {
        return el.cityName === (event.target as HTMLSelectElement).value.slice(4) ? el : undefined;
      }
    });
    const cityUa = this.listOflocations.getCity('ua').find((el) => el.key === elem.key);
    this.city.setValue(cityUa.cityName);
    const cityEn = this.listOflocations.getCity('en').find((el) => el.key === elem.key);
    this.cityEn.setValue(cityEn.cityName);

    const element = (event.target as HTMLSelectElement).value.slice(3);
    this.isDistrict = element === 'Київ' || element === 'Kyiv';
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
    this.inputStreetElement.removeEventListener('input', () => this.setPredictStreets());
    while (document.body.querySelector('.pac-container')) {
      document.body.removeChild(document.querySelector('.pac-container'));
    }
  }
}
