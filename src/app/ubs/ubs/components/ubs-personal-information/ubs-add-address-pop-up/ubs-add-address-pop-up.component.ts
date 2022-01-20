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

  cities = [
    { cityName: 'Київ', lang: 'ua' },
    { cityName: 'Kyiv', lang: 'en' },
    { cityName: 'Гатне', lang: 'ua' },
    { cityName: 'Hatne', lang: 'en' },
    { cityName: 'Горенка', lang: 'ua' },
    { cityName: 'Horenka', lang: 'en' },
    { cityName: `Зазим'є`, lang: 'ua' },
    { cityName: `Zazymie`, lang: 'en' },
    { cityName: 'Ірпінь', lang: 'ua' },
    { cityName: `Irpin'`, lang: 'en' },
    { cityName: 'Княжичі', lang: 'ua' },
    { cityName: 'Kniazhychi', lang: 'en' },
    { cityName: 'Коцюбинське', lang: 'ua' },
    { cityName: `Kotsyubyns'ke`, lang: 'en' },
    { cityName: 'Новосілки', lang: 'ua' },
    { cityName: 'Novosilky', lang: 'en' },
    { cityName: 'Петропавлівська Борщагівка', lang: 'ua' },
    { cityName: 'Petropavlivska Borshchahivka', lang: 'en' },
    { cityName: 'Погреби', lang: 'ua' },
    { cityName: 'Pohreby', lang: 'en' },
    { cityName: 'Проліски', lang: 'ua' },
    { cityName: 'Prolisky', lang: 'en' },
    { cityName: 'Софіївська Борщагівка', lang: 'ua' },
    { cityName: 'Sofiivska Borschahivka', lang: 'en' },
    { cityName: 'Чайки', lang: 'ua' },
    { cityName: 'Chaiky', lang: 'en' },
    { cityName: 'Щасливе', lang: 'ua' },
    { cityName: 'Shchaslyve', lang: 'en' }
  ];

  bigRegions = [
    { regionName: 'Київська область', lang: 'ua' },
    { regionName: 'Kyiv region', lang: 'en' }
  ];

  regionsKyiv = [
    { name: 'Голосіївський', lang: 'ua' },
    { name: `Holosiivs'kyi`, lang: 'en' },
    { name: 'Дарницький', lang: 'ua' },
    { name: `Darnyts'kyi`, lang: 'en' },
    { name: 'Деснянський', lang: 'ua' },
    { name: `Desnyans'kyi`, lang: 'en' },
    { name: 'Дніпровський', lang: 'ua' },
    { name: `Dniprovs'kyi`, lang: 'en' },
    { name: 'Оболонський', lang: 'ua' },
    { name: 'Obolonskyi', lang: 'en' },
    { name: 'Печерський', lang: 'ua' },
    { name: `Pechers'kyi`, lang: 'en' },
    { name: 'Подільський', lang: 'ua' },
    { name: `Podil's'kyi`, lang: 'en' },
    { name: 'Святошинський', lang: 'ua' },
    { name: `Svyatoshyns'kyi`, lang: 'en' },
    { name: `Солом'янський`, lang: 'ua' },
    { name: `Solom'yans'kyi`, lang: 'en' },
    { name: 'Шевченківський', lang: 'ua' },
    { name: `Shevchenkivs'kyi`, lang: 'en' }
  ];

  regions = [
    { name: 'Бориспільський', lang: 'ua' },
    { name: `Boryspil's'kyi`, lang: 'en' },
    { name: 'Броварський', lang: 'ua' },
    { name: `Brovars'kyi`, lang: 'en' },
    { name: 'Бучанський', lang: 'ua' },
    { name: `Buchans'kyi`, lang: 'en' },
    { name: 'Вишгородський', lang: 'ua' },
    { name: `Vyshhorods'kyi`, lang: 'en' },
    { name: 'Обухівський', lang: 'ua' },
    { name: `Obukhivs'kyi`, lang: 'en' },
    { name: 'Фастівський', lang: 'ua' },
    { name: `Fastivs'kyi`, lang: 'en' }
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
    this.cities = this.cities.filter((el) => el.lang === this.currentLanguage);
    this.regionsKyiv = this.regionsKyiv.filter((el) => el.lang === this.currentLanguage);
    this.regions = this.regions.filter((el) => el.lang === this.currentLanguage);
    this.currentDistrict = this.data.address?.district;
    this.currentLocation = this.data?.currentLocation;
    this.addAddressForm = this.fb.group({
      region: [this.data.edit ? this.data.address.region : null, Validators.required],
      city: [this.data.edit ? this.data.address.city : null, Validators.required],
      district: [this.data.edit ? this.data.address.district : '', Validators.required],
      street: [
        this.data.edit ? this.data.address.street : '',
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

    if (this.currentLocation === 'Kyiv' || this.currentLocation === 'Київ') {
      this.isKyiv = true;
      this.isDistrict = true;
      if (!this.data.edit) {
        this.addAddressForm.get('city').setValue(this.currentLocation);
      }
    }
    this.isDistrict = this.addAddressForm.get('city').value === 'Kyiv' || this.addAddressForm.get('city').value === 'Київ';

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
      console.log(data[0][0][0]);
    });
  }

  public getJSON(sourceText: string, lang: string): Observable<any> {
    if (lang === 'ua') {
      return ajax.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=uk&tl=en&dt=t&q=' + encodeURI(sourceText));
    }
    return ajax.getJSON('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=uk&dt=t&q=' + encodeURI(sourceText));
  }

  setDistrict(event: any): void {
    const getDistrict =
      this.currentLanguage === 'ua'
        ? event.address_components.filter((item) => item.long_name.includes('район'))[0]
        : event.address_components.filter((item) => item.long_name.toLowerCase().includes('district'))[0];
    if (getDistrict) {
      this.currentDistrict = getDistrict.long_name.split(' ')[0];
      this.addAddressForm.get('district').setValue(this.currentDistrict);
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
    this.addAddressForm.get('street').setValue(streetName);
  }

  onDistrictSelected(event): void {
    this.onLocationSelected(event);
    this.setDistrict(event);
    this.translate(event.name);
    this.onAutocompleteSelected(event);
  }

  selectCity(event: Event): void {
    this.isDistrict = (event.target as HTMLSelectElement).value === 'Київ';
  }

  selectCityApi(event): void {
    this.addAddressForm.get('city').setValue(event?.name);
    this.isDistrict = this.addAddressForm.get('city').value === 'Київ';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addAdress() {
    this.isDisabled = true;
    this.addAddressForm.value.region = this.addAddressForm.get('region').value;
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
      .subscribe((list: Address[]) => {
        this.orderService.setCurrentAddress(this.addAddressForm.value);

        this.updatedAddresses = list;
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
