import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { OrderService } from '../../../services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Address } from '../../../models/ubs.interface';
import { takeUntil, catchError } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ajax } from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-ubs-add-address-pop-up',
  templateUrl: './ubs-add-address-pop-up.component.html',
  styleUrls: ['./ubs-add-address-pop-up.component.scss']
})
export class UBSAddAddressPopUpComponent implements OnInit, OnDestroy {
  options: any;
  cityOptions: any;
  cityBounds: any;
  address: Address;
  updatedAddresses: Address[];
  addAddressForm: FormGroup;
  newAddress: Address;
  currentDistrict = '';
  isDisabled = false;
  streetPattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ.\'\-\ \\]+[A-Za-zА-Яа-яїЇіІєЄёЁ0-9.\'\-\ \\]*$/;
  corpusPattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ0-9]{1,4}$/;
  housePattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ0-9\.\-\/\,\\]+$/;
  entranceNumberPattern = /^([1-9]\d*)?$/;
  private destroy: Subject<boolean> = new Subject<boolean>();
  currentLocation = {};
  isDistrict = false;
  isKyiv = false;
  currentLanguage: string;
  mainUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB3xs7Kczo46LFcQRFKPMdrE0lU4qsR_S4&libraries=places&language=';
  KyivCoordinates = {
    northLat: 50.59079800991073,
    southLat: 50.21327301525928,
    eastLng: 30.82594104187906,
    westLng: 30.23944009690609
  };
  translation = '';

  cities = [
    { cityName: 'Київ', key: 1 },
    { cityName: 'Гатне', key: 2 },
    { cityName: 'Горенка', key: 3 },
    { cityName: `Зазим'є`, key: 4 },
    { cityName: 'Ірпінь', key: 5 },
    { cityName: 'Княжичі', key: 6 },
    { cityName: 'Коцюбинське', key: 7 },
    { cityName: 'Новосілки', key: 8 },
    { cityName: 'Петропавлівська Борщагівка', key: 9 },
    { cityName: 'Погреби', key: 10 },
    { cityName: 'Проліски', key: 11 },
    { cityName: 'Софіївська Борщагівка', key: 12 },
    { cityName: 'Чайки', key: 13 },
    { cityName: 'Щасливе', key: 14 }
  ];

  citiesEn = [
    { cityName: 'Kyiv', key: 1 },
    { cityName: 'Hatne', key: 2 },
    { cityName: 'Horenka', key: 3 },
    { cityName: `Zazymie`, key: 4 },
    { cityName: `Irpin'`, key: 5 },
    { cityName: 'Kniazhychi', key: 6 },
    { cityName: `Kotsyubyns'ke`, key: 7 },
    { cityName: 'Novosilky', key: 8 },
    { cityName: 'Petropavlivska Borshchahivka', key: 9 },
    { cityName: 'Pohreby', key: 10 },
    { cityName: 'Prolisky', key: 11 },
    { cityName: 'Sofiivska Borschahivka', key: 12 },
    { cityName: 'Chaiky', key: 13 },
    { cityName: 'Shchaslyve', key: 14 }
  ];

  bigRegions = [
    { regionName: 'Київська область', lang: 'ua' },
    { regionName: 'Kyiv region', lang: 'en' }
  ];

  regionsKyiv = [
    { name: 'Голосіївський', key: 1 },
    { name: 'Дарницький', key: 2 },
    { name: 'Деснянський', key: 3 },
    { name: 'Дніпровський', key: 4 },
    { name: 'Оболонський', key: 5 },
    { name: 'Печерський', key: 6 },
    { name: 'Подільський', key: 7 },
    { name: 'Святошинський', key: 8 },
    { name: `Солом'янський`, key: 9 },
    { name: 'Шевченківський', key: 10 }
  ];

  regionsKyivEn = [
    { name: `Holosiivs'kyi`, key: 1 },
    { name: `Darnyts'kyi`, key: 2 },
    { name: `Desnyans'kyi`, key: 3 },
    { name: `Dniprovs'kyi`, key: 4 },
    { name: 'Obolonskyi', key: 5 },
    { name: `Pechers'kyi`, key: 6 },
    { name: `Podil's'kyi`, key: 7 },
    { name: `Svyatoshyns'kyi`, key: 8 },
    { name: `Solom'yans'kyi`, key: 9 },
    { name: `Shevchenkivs'kyi`, key: 10 }
  ];

  regions = [
    { name: 'Бориспільський', key: 1 },
    { name: 'Броварський', key: 2 },
    { name: 'Бучанський', key: 3 },
    { name: 'Вишгородський', key: 4 },
    { name: 'Обухівський', key: 5 },
    { name: 'Фастівський', key: 6 }
  ];

  regionsEn = [
    { name: `Boryspil's'kyi`, key: 1 },
    { name: `Brovars'kyi`, key: 2 },
    { name: `Buchans'kyi`, key: 3 },
    { name: `Vyshhorods'kyi`, key: 4 },
    { name: `Obukhivs'kyi`, key: 5 },
    { name: `Fastivs'kyi`, key: 6 }
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<UBSAddAddressPopUpComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      edit: boolean;
      address: Address;
      currentLocation: string;
    },
    private snackBar: MatSnackBarComponent,
    private localStorageService: LocalStorageService
  ) {}

  get region() {
    return this.addAddressForm.get('region');
  }

  get district() {
    return this.addAddressForm.get('district');
  }

  get city() {
    return this.addAddressForm.get('city');
  }

  get street() {
    return this.addAddressForm.get('street');
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
    this.currentLocation = this.data?.currentLocation;
    this.addAddressForm = this.fb.group({
      region: [this.data.edit ? this.data.address.region : null, Validators.required],
      regionEn: [this.data.edit ? this.data.address.regionEn : null, Validators.required],
      city: [this.data.edit ? this.data.address.city : null, Validators.required],
      cityEn: [this.data.edit ? this.data.address.cityEn : null, Validators.required],
      district: [this.data.edit ? this.data.address.district : '', Validators.required],
      districtEn: [this.data.edit ? this.data.address.districtEn : '', Validators.required],
      street: [
        this.data.edit ? this.data.address.street : '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.streetPattern)]
      ],
      streetEn: [
        this.data.edit ? this.data.address.streetEn : '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.streetPattern)]
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
      addressComment: [this.data.edit ? this.data.address.addressComment : '', Validators.maxLength(255)],
      coordinates: {
        latitude: this.data.edit ? this.data.address.coordinates.latitude : '',
        longitude: this.data.edit ? this.data.address.coordinates.longitude : ''
      },
      id: [this.data.edit ? this.data.address.id : 0],
      actual: true
    });

    // TODO: Must be removed if multi-region feature need to be implemented
    this.addAddressForm.get('region').setValue('Київська область');
    this.addAddressForm.get('region').disable();
    this.addAddressForm.get('regionEn').setValue('Kyiv region');
    this.addAddressForm.get('regionEn').disable();

    if (this.currentLocation === 'Kyiv' || this.currentLocation === 'Київ') {
      this.isKyiv = true;
      this.isDistrict = true;
      if (!this.data.edit) {
        this.addAddressForm.get('city').setValue('Київ');
        this.addAddressForm.get('cityEn').setValue('Kyiv');
      }
    }
    this.isDistrict = this.addAddressForm.get('cityEn').value === 'Kyiv' || this.addAddressForm.get('city').value === 'Київ';

    // TODO: Must be removed if multi-region feature need to be implemented
    this.onCitySelected(this.KyivCoordinates);
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

  onLocationSelected(event): void {
    let g = 0;
    let h = 0;
    let long = 0;
    let lat = 0;
    for (const [key1, value] of Object.entries(event.geometry.viewport)) {
      for (const [key2, val] of Object.entries(value)) {
        g = key2 === 'g' ? val : g;
        h = key2 === 'h' ? val : h;
      }
      if (key1.includes('b')) {
        lat = (g + h) / 2;
      } else {
        long = (g + h) / 2;
      }
    }

    this.addAddressForm.get('coordinates').setValue({
      latitude: lat,
      longitude: long
    });
  }

  translate(sourceText: string): void {
    this.getJSON(sourceText, this.currentLanguage).subscribe((data) => {
      this.translation = data[0][0][0];
    });
  }

  public getJSON(sourceText: string, lang: string): Observable<any> {
    if (lang === 'ua') {
      return ajax.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=uk&tl=en&dt=t&q=' + encodeURI(sourceText));
    }
    return ajax.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uk&dt=t&q=' + encodeURI(sourceText));
  }

  setDistrict(event: Event): void {
    const element = (event.target as HTMLSelectElement).value.slice(3);
    this.setDistrictTranslation(element);
  }

  setDistrictTranslation(name: string): void {
    if (this.isDistrict) {
      if (this.currentLanguage === 'ua') {
        const elem = this.regionsKyiv.find((el) => el.name === name);
        const dist = this.regionsKyivEn.find((el) => el?.key === elem?.key) || null;
        this.addAddressForm.get('districtEn').setValue(dist?.name);
      } else {
        const elem = this.regionsKyivEn.find((el) => el.name === name);
        const dist = this.regionsKyiv.find((el) => el?.key === elem?.key) || null;
        this.addAddressForm.get('district').setValue(dist?.name);
      }
    } else {
      if (this.currentLanguage === 'ua') {
        const elem = this.regions.find((el) => el.name === name);
        const dist = this.regionsEn.find((el) => el?.key === elem?.key) || null;
        this.addAddressForm.get('districtEn').setValue(dist?.name);
      } else {
        const elem = this.regionsEn.find((el) => el.name === name);
        const dist = this.regions.find((el) => el?.key === elem?.key) || null;
        this.addAddressForm.get('district').setValue(dist?.name);
      }
    }
  }

  setDistrictAuto(event): void {
    const getDistrict =
      this.currentLanguage === 'ua'
        ? event.address_components.filter((item) => item.long_name.includes('район'))[0]
        : event.address_components.filter((item) => item.long_name.toLowerCase().includes('district'))[0];
    if (getDistrict) {
      this.currentDistrict = getDistrict.long_name.split(' ')[0];
      if (this.currentLanguage === 'ua') {
        this.addAddressForm.get('district').setValue(this.currentDistrict);
        this.setDistrictTranslation(this.currentDistrict);
      } else {
        this.addAddressForm.get('districtEn').setValue(this.currentDistrict);
        this.setDistrictTranslation(this.currentDistrict);
      }
    }
  }

  onAutocompleteSelected(event): void {
    let streetName = event.name;
    const regExp = /,* \d+/;
    const num = streetName.match(regExp);

    if (num) {
      streetName = streetName.replace(regExp, '');
      num[0] = num[0].length > 2 ? num[0].replace(', ', '') : num[0];
      this.addAddressForm.get('houseNumber').setValue(num[0]);
    }
    if (this.currentLanguage === 'ua') {
      this.addAddressForm.get('street').setValue(streetName);
      this.translate(streetName);
      setTimeout(() => {
        this.addAddressForm.get('streetEn').setValue(this.translation);
      }, 200);
    } else {
      this.addAddressForm.get('streetEn').setValue(streetName);
      this.translate(streetName);
      setTimeout(() => {
        this.addAddressForm.get('street').setValue(this.translation);
      }, 200);
    }
  }

  onDistrictSelected(event): void {
    this.onLocationSelected(event);
    this.setDistrictAuto(event);
    this.onAutocompleteSelected(event);
  }

  selectCity(event: Event): void {
    if (this.currentLanguage === 'ua') {
      const elem = this.cities.find((el) => {
        if (el.key <= 10) {
          return el.cityName === (event.target as HTMLSelectElement).value.slice(3) ? el : undefined;
        } else {
          return el.cityName === (event.target as HTMLSelectElement).value.slice(4) ? el : undefined;
        }
      });
      const city = this.citiesEn.find((el) => el.key === elem.key);
      this.addAddressForm.get('cityEn').setValue(city.cityName);
    } else {
      const elem = this.citiesEn.find((el) => {
        if (el.key <= 10) {
          return el.cityName === (event.target as HTMLSelectElement).value.slice(3) ? el : undefined;
        } else {
          return el.cityName === (event.target as HTMLSelectElement).value.slice(4) ? el : undefined;
        }
      });
      const city = this.cities.find((el) => el.key === elem.key);
      this.addAddressForm.get('city').setValue(city.cityName);
    }
    const element = (event.target as HTMLSelectElement).value.slice(3);
    this.isDistrict = element === 'Київ' || element === 'Kyiv';
  }

  selectCityApi(event): void {
    if (this.currentLanguage === 'ua') {
      this.addAddressForm.get('city').setValue(event?.name);
      this.translate(event?.name);
      setTimeout(() => {
        this.addAddressForm.get('cityEn').setValue(this.translation);
      }, 200);
    } else {
      this.addAddressForm.get('cityEn').setValue(event?.name);
      this.translate(event?.name);
      setTimeout(() => {
        this.addAddressForm.get('city').setValue(this.translation);
      }, 200);
    }
    this.isDistrict = this.addAddressForm.get('city').value === 'Київ' || this.addAddressForm.get('cityEn').value === 'Kyiv';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addAdress(): void {
    this.isDisabled = true;
    this.addAddressForm.value.region = this.addAddressForm.get('region').value;
    this.addAddressForm.value.regionEn = this.addAddressForm.get('regionEn').value;
    this.orderService
      .addAdress(this.addAddressForm.value)
      .pipe(
        takeUntil(this.destroy),
        catchError((error) => {
          this.snackBar.openSnackBar('existAddress');
          this.dialogRef.close();
          this.isDisabled = false;
          return throwError(error);
        })
      )
      .subscribe((list: { addressList: Address[] }) => {
        this.orderService.setCurrentAddress(this.addAddressForm.value);

        this.updatedAddresses = list.addressList;
        this.dialogRef.close('Added');
        this.isDisabled = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
    while (document.body.querySelector('.pac-container')) {
      document.body.removeChild(document.querySelector('.pac-container'));
    }
  }
}
