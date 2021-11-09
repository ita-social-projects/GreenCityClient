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
  cityBounds: any;
  address: Address;
  updatedAddresses: Address[];
  addAddressForm: FormGroup;
  newAddress: Address;
  region = '';
  districtDisabled = true;
  nextDisabled = true;
  isDisabled = false;
  streetPattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ.\'\-\ \\]+[A-Za-zА-Яа-яїЇіІєЄёЁ0-9.\'\-\ \\]*$/;
  corpusPattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ0-9]{1,4}$/;
  housePattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ0-9\.\-\/]+$/;
  entranceNumberPattern = /^([1-9]\d*)?$/;
  private destroy: Subject<boolean> = new Subject<boolean>();

  cities = [
    { cityName: 'Kyiv', northLat: 50.59079800991073, southLat: 50.21327301525928, eastLng: 30.82594104187906, westLng: 30.23944009690609 }
  ];

  regions = [
    'Голосіївський',
    'Дарницький',
    'Деснянський',
    'Дніпровський',
    'Оболонський',
    'Печерський',
    'Подільський',
    'Святошинський',
    'Солом`янський',
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
    },
    private snackBar: MatSnackBarComponent
  ) {}

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
    this.addAddressForm = this.fb.group({
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
      longitude: [this.data.edit ? this.data.address.longitude : ''],
      latitude: [this.data.edit ? this.data.address.latitude : ''],
      id: [this.data.edit ? this.data.address.id : 0],
      actual: true
    });

    // TODO: Must be removed if multi-city feature need to be implemented
    this.onCitySelected('Kiev');
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
      componentRestrictions: { country: 'UA' }
    };
  }

  onLocationSelected(event): void {
    this.addAddressForm.get('longitude').setValue(event.longitude);
    this.addAddressForm.get('latitude').setValue(event.latitude);
  }

  setDistrict(event: any) {
    const getDistrict = event.address_components.filter((item) => item.long_name.includes('район'))[0];
    if (getDistrict) {
      this.region = getDistrict.long_name.split(' ')[0];
    } else {
      this.region = event.vicinity.split(' ')[0];
    }
  }

  onAutocompleteSelected(event): void {
    const streetName = event.name;
    this.addAddressForm.get('street').setValue(streetName);
    this.setDistrict(event);
    this.addAddressForm.get('district').setValue(this.region);
    this.nextDisabled = false;
    this.districtDisabled = event.address_components[2].long_name.split(' ')[1] === 'район' ? true : false;
  }

  onDistrictSelected(event): void {
    this.onLocationSelected(event);
    this.setDistrict(event);
    this.addAddressForm.get('district').setValue(this.region);
    this.districtDisabled = true;
    this.nextDisabled = false;
    this.onAutocompleteSelected(event);
  }

  onChange(): void {
    this.region = null;
    this.addAddressForm.get('district').setValue(this.region);
    this.districtDisabled = false;
    this.nextDisabled = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addAdress() {
    this.isDisabled = true;
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
