import { MatDialog } from '@angular/material';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { OrderService } from '../../services/order.service';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { Address, orderBag, OrderDetails, PersonalData } from '../../models/ubs.interface';
import { Order } from '../../models/ubs.model';

@Component({
  selector: 'app-ubs-personal-information',
  templateUrl: './ubs-personal-information.component.html',
  styleUrls: ['./ubs-personal-information.component.scss']
})
export class UBSPersonalInformationComponent implements OnInit, OnDestroy {

  orderDetails: OrderDetails;
  personalData: PersonalData;
  personalDataForm: FormGroup;
  order: Order;
  addresses: Address[] = [];
  namePattern = /^[A-Za-zА-Яа-яїієё\.\'\-\\]+$/;
  phoneMask = '+{38} (000) 000 00 00';

  // region = '';
  // longitude: number;
  // latitude: number;
  // nextDisabled = true;
  // districtDisabled = true;

  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private orderService: OrderService,
    private shareFormService: UBSOrderFormService,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.takeUserData();
  }

  ngOnDestroy(): void {
    this.shareFormService.objectSource.unsubscribe();
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  public takeUserData() {
    this.personalDataForm = this.fb.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern(this.namePattern)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern(this.namePattern)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('+38 0', [Validators.required, Validators.minLength(12)]),
      addressComment: new FormControl('', Validators.maxLength(170))
    });

    this.orderService.getPersonalData().pipe(takeUntil(this.destroy)).subscribe(() => {
      console.log(this.orderService.personalData)
      this.personalData = this.orderService.personalData;

      this.addAddress();
      this.initForm();
    });
  }

  addAddress() {
    const address: Address = {
      city: this.personalData.city,
      district: this.personalData.district,
      street: this.personalData.street,
      houseCorpus: this.personalData.street,
      houseNumber: this.personalData.houseNumber,
      entranceNumber: this.personalData.entranceNumber,
      longitude: this.personalData.longitude,
      latitude: this.personalData.latitude
    }
    this.addresses.push(address);
  }

  initForm(): void {
    this.personalDataForm.patchValue({
      firstName: this.personalData.firstName,
      lastName: this.personalData.lastName,
      email: this.personalData.email,
      phoneNumber: '380' + this.personalData.phoneNumber,
      addressComment: this.personalData.addressComment,
    });
    // if (this.personalData.street === null) {
    this.personalDataForm.addControl('isAddress', new FormControl(this.addresses.length ? 'true' : '', [Validators.required]))
    // } else {
    //   this.personalDataForm.addControl('isAddress', new FormControl('true', [Validators.required]))
    // }
  }

  getControl(control: string) {
    return this.personalDataForm.get(control);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(UBSAddAddressPopUpComponent, { data: {} });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((address: Address) => {
      if (address !== undefined) {
        console.log(address)
        this.addAddress();
        // this.addresses.push(address);
        this.personalDataForm.patchValue({ isAddress: new FormControl('true') });
        this.changeAddressInPersonalData(address);
      }
    });
  }

  changeAddressInPersonalData(address: Address) {
    this.personalData.city = address.city;
    this.personalData.district = address.district;
    this.personalData.street = address.street;
    this.personalData.houseNumber = address.houseNumber;
    this.personalData.houseCorpus = address.houseCorpus;
    this.personalData.entranceNumber = address.entranceNumber;
    this.personalData.latitude = address.latitude;
    this.personalData.longitude = address.longitude;
  }

  submit(): void {
    this.orderDetails = this.orderService.orderDetails;
    let orderBags: orderBag[] = [];
    this.orderDetails.bags.forEach((bagItem) => {
      const bag: orderBag = { amount: bagItem.quantity, id: bagItem.id }
      orderBags.push(bag)
    });
    orderBags = orderBags.filter(bag => bag.amount !== 0);

    this.personalData.firstName = this.personalDataForm.get('firstName').value;
    this.personalData.firstName = this.personalDataForm.get('firstName').value;
    this.personalData.lastName = this.personalDataForm.get('lastName').value;
    this.personalData.email = this.personalDataForm.get('email').value;
    this.personalData.phoneNumber = this.personalDataForm.get('phoneNumber').value.slice(3);

    console.log(this.personalData)
    this.order = new Order(
      [''],
      orderBags,
      [],
      '',
      this.personalData,
      0);
    this.orderService.processOrder(this.order)
      .pipe(
        takeUntil(this.destroy)
      )
      .subscribe(res => {
        console.log(res)
      });

  }

  // const personalData: PersonalData = {
  //   firstName: this.personalDataForm.get('firstName').value,
  //   lastName: this.personalDataForm.get('lastName').value,
  //   email: this.personalDataForm.get('email').value,
  //   phoneNumber: this.personalDataForm.get('phoneNumber').value.slice(3),
  //   city: this.addresses[0].city,
  //   district: this.addresses[0].district,
  //   street: this.addresses[0].street.split(',').splice(0, 1).join().split(' ').splice(1, 1).join(),
  //   houseNumber: this.addresses[0].street.split(',').slice(1).join().trim(),
  //   houseCorpus: this.addresses[0].houseCorpus,
  //   entranceNumber: this.addresses[0].entranceNumber,
  //   addressComment: this.personalDataForm.get('addressComment').value,
  //   id: 1,
  //   latitude: this.addresses[0].latitude,
  //   longitude: this.addresses[0].longitude
  // };
  // this.order.personalData = personalData;

}
