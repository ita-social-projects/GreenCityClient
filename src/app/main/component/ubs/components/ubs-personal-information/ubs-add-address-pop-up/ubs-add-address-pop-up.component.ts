import { OrderService } from './../../../services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Address } from '../../../models/ubs.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-add-address-pop-up',
  templateUrl: './ubs-add-address-pop-up.component.html',
  styleUrls: ['./ubs-add-address-pop-up.component.scss']
})
export class UBSAddAddressPopUpComponent implements OnInit, OnDestroy {
  country = 'ua';
  address: Address;
  updatedAddresses: Address[];
  addAddressForm: FormGroup;
  region = '';
  districtDisabled = true;
  nextDisabled = true;
  streetPattern = /^[A-Za-zА-Яа-яїієё0-9\'\,\-\ \\]+$/;
  houseCorpusPattern = /^[A-Za-zА-Яа-яїієё0-9]+$/;
  entranceNumberPattern = /^-?(0|[1-9]\d*)?$/;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<UBSAddAddressPopUpComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      edit: boolean;
      address: Address;
    }
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

  ngOnInit() {
    this.addAddressForm = this.fb.group({
      city: [this.data.edit ? this.data.address.city : 'Київ', Validators.required],
      district: [this.data.edit ? this.data.address.district : '', Validators.required],
      street: [
        this.data.edit ? this.data.address.street : '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.streetPattern)]
      ],
      houseNumber: [this.data.edit ? this.data.address.houseNumber : '', [Validators.required]],
      houseCorpus: [
        this.data.edit ? this.data.address.houseCorpus : '',
        [Validators.maxLength(2), Validators.pattern(this.houseCorpusPattern)]
      ],
      entranceNumber: [
        this.data.edit ? this.data.address.entranceNumber : '',
        [Validators.maxLength(2), Validators.pattern(this.entranceNumberPattern)]
      ],
      longitude: [this.data.edit ? this.data.address.longitude : '', Validators.required],
      latitude: [this.data.edit ? this.data.address.latitude : '', Validators.required],
      id: [this.data.edit ? this.data.address.id : 0],
      actual: true
    });
  }

  onLocationSelected(event): void {
    this.addAddressForm.get('longitude').setValue(event.longitude);
    this.addAddressForm.get('latitude').setValue(event.latitude);
  }

  onAutocompleteSelected(event): void {
    const streetName = event.name;
    this.addAddressForm.get('street').setValue(streetName);
    this.region = event.address_components[1].long_name.split(' ')[0];
    this.addAddressForm.get('district').setValue(this.region);
    this.nextDisabled = false;
    this.districtDisabled = event.address_components[2].long_name.split(' ')[1] === 'район' ? true : false;
  }

  onDistrictSelected(event): void {
    this.region = event.address_components[0].long_name.split(' ')[0];
    this.addAddressForm.get('district').setValue(this.region);
    this.districtDisabled = true;
    this.nextDisabled = false;
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
    this.orderService
      .addAdress(this.addAddressForm.value)
      .pipe(takeUntil(this.destroy))
      .subscribe((list: Address[]) => {
        this.updatedAddresses = list;
        this.dialogRef.close();
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
