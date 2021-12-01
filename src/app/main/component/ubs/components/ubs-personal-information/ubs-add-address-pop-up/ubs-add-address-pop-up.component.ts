import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { OrderService } from './../../../services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Address } from '../../../models/ubs.interface';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-add-address-pop-up',
  templateUrl: './ubs-add-address-pop-up.component.html',
  styleUrls: ['./ubs-add-address-pop-up.component.scss']
})
export class UBSAddAddressPopUpComponent implements OnInit, OnDestroy {
  country = 'ua';
  options: any;
  cityOptions: any;
  cityBounds: any;
  address: Address;
  updatedAddresses: Address[];
  addAddressForm: FormGroup;
  newAddress: Address;
  region = '';
  isDisabled = false;
  streetPattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ.\'\-\ \\]+[A-Za-zА-Яа-яїЇіІєЄёЁ0-9.\'\-\ \\]*$/;
  corpusPattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ0-9]{1,4}$/;
  housePattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ0-9\.\-\/\,\\]+$/;
  entranceNumberPattern = /^([1-9]\d*)?$/;
  private destroy: Subject<boolean> = new Subject<boolean>();
  currentLocation = {};
  isDistrict = true;
  cities = [
    { cityName: 'Kyiv', northLat: 50.59079800991073, southLat: 50.21327301525928, eastLng: 30.82594104187906, westLng: 30.23944009690609 }
  ];

  bigRegions = ['Київська'];

  regions = [
    'Голосіївський',
    'Дарницький',
    'Деснянський',
    'Дніпровський',
    'Оболонський',
    'Печерський',
    'Подільський',
    'Святошинський',
    `Солом'янський`,
    'Шевченківський'
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
      district: string;
    },
    private snackBar: MatSnackBarComponent
  ) {}

  get getRegion() {
    return this.addAddressForm.get('region');
  }

  get district() {
    return this.addAddressForm.get('district');
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
    this.region = this.data.district;
    this.currentLocation = this.data.currentLocation;
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

    if (this.currentLocation === 'Kyiv' || this.currentLocation === 'Київ') {
      this.addAddressForm.get('city').setValue('Київ');
      this.addAddressForm.get('city').disable();
    }
    this.addAddressForm.get('region').setValue('Київська область');
    this.addAddressForm.get('region').disable();

    // TODO: Must be removed if multi-city feature need to be implemented
    this.onCitySelected('Kyiv');
  }

  onCitySelected(citySelected: string) {
    this.cities.forEach((city) => {
      if (city.cityName === citySelected) {
        this.cityBounds = {
          north: city.northLat,
          south: city.southLat,
          east: city.eastLng,
          west: city.westLng
        };
      }
    });

    this.options = {
      bounds: this.cityBounds,
      strictBounds: true,
      types: ['address'],
      radius: 500000,
      componentRestrictions: { country: 'UA' }
    };
    this.cityOptions = {
      bounds: this.cityBounds,
      strictBounds: true,
      types: ['(cities)'],
      radius: 500000,
      componentRestrictions: { country: 'UA' }
    };
  }

  onLocationSelected(event): void {
    this.addAddressForm.get('coordinates').setValue({
      latitude: (event.geometry.viewport.Bb.g + event.geometry.viewport.Bb.h) / 2,
      longitude: (event.geometry.viewport.Ra.g + event.geometry.viewport.Ra.h) / 2
    });
  }

  setDistrict(event: any) {
    const getDistrict = event.address_components.filter((item) => item.long_name.includes('район'))[0];
    if (getDistrict) {
      this.region = getDistrict.long_name.split(' ')[0];
    } else {
      this.isDistrict = false;
    }
  }

  onAutocompleteSelected(event): void {
    const streetName = event.name;
    this.addAddressForm.get('street').setValue(streetName);
    this.addAddressForm.get('district').setValue(this.region);
  }

  onDistrictSelected(event): void {
    this.onLocationSelected(event);
    this.setDistrict(event);
    this.onAutocompleteSelected(event);
  }

  selectCity(event): void {
    this.addAddressForm.get('city').setValue(event.name);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addAdress() {
    this.isDisabled = true;
    if (this.currentLocation === 'Kyiv' || this.currentLocation === 'Київ') {
      this.addAddressForm.value.city = this.addAddressForm.get('city').value;
    }
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
        this.dialogRef.close();
        this.isDisabled = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
