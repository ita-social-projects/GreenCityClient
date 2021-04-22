import { MatDialog, MatDialogConfig } from '@angular/material';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { OrderService } from '../../services/order.service';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { Address, OrderBag, OrderDetails, PersonalData } from '../../models/ubs.interface';
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
  maxAddressLength = 4;
  namePattern = /^[A-Za-zА-Яа-яїієё\.\'\-\\]+$/;
  phoneMask = '+{38} (000) 000 00 00';
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private orderService: OrderService,
    private shareFormService: UBSOrderFormService,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.takeUserData();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  initForm() {
    this.personalDataForm = this.fb.group({
      firstName: new FormControl('',
        [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern(this.namePattern)]),
      lastName: new FormControl('',
        [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern(this.namePattern)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('+38 0', [Validators.required, Validators.minLength(12)]),
      addressComment: new FormControl('', Validators.maxLength(170))
    });
  }

  public takeUserData() {
    this.orderService.getPersonalData().pipe(takeUntil(this.destroy)).subscribe((personalData: PersonalData) => {
      this.personalData = this.shareFormService.personalData;
      this.addAddress();
      this.setFormData();
    });
  }

  changePersonalData() {
    this.shareFormService.changePersonalData();
  }

  checkAddress(addressId) {
    this.addresses.forEach(address => {
      if (address.id !== addressId && address.checked) {
        address.checked = !address.checked;
      } else if (address.id === addressId && !address.checked) {
        address.checked = !address.checked;
      }
    });
    this.changeAddressInPersonalData();
  }

  changeAddressInPersonalData() {
    const activeAddress = this.addresses.find(address => address.checked);
    this.personalData.city = activeAddress.city;
    this.personalData.district = activeAddress.district;
    this.personalData.street = activeAddress.street;
    this.personalData.houseNumber = activeAddress.houseNumber;
    this.personalData.houseCorpus = activeAddress.houseCorpus;
    this.personalData.entranceNumber = activeAddress.entranceNumber;
    this.personalData.latitude = activeAddress.latitude;
    this.personalData.longitude = activeAddress.longitude;
  }

  addAddress(newAddress?) {
    const isChecked = this.addresses.length > 0 ? false : true;
    let address: Address;
    if (!this.addresses.length) {
      address = {
        id: Date.now(),
        checked: isChecked,
        city: this.personalData.city,
        district: this.personalData.district,
        street: this.personalData.street,
        houseCorpus: this.personalData.houseCorpus,
        houseNumber: this.personalData.houseNumber,
        entranceNumber: this.personalData.entranceNumber,
        longitude: this.personalData.longitude,
        latitude: this.personalData.latitude
      };
    } else {
      address = {
        id: Date.now(),
        checked: isChecked,
        city: newAddress.city,
        district: newAddress.district,
        street: newAddress.street,
        houseCorpus: newAddress.houseCorpus,
        houseNumber: newAddress.houseNumber,
        entranceNumber: newAddress.entranceNumber,
        longitude: newAddress.longitude,
        latitude: newAddress.latitude
      };
    }
    this.addresses.push(address);
  }

  setFormData(): void {
    this.personalDataForm.patchValue({
      firstName: this.personalData.firstName,
      lastName: this.personalData.lastName,
      email: this.personalData.email,
      phoneNumber: '380' + this.personalData.phoneNumber,
      addressComment: this.personalData.addressComment,
    });
    this.personalDataForm.addControl('isAddress', new FormControl(this.addresses.length ? 'true' : '', [Validators.required]));
  }

  editAddress(addressId: number) {
    this.openDialog(true, addressId);
  }

  addNewAddress() {
    this.openDialog(false);
  }

  getControl(control: string) {
    return this.personalDataForm.get(control);
  }

  openDialog(isEdit: boolean, addressId?: number): void {
    const currentAddress = this.addresses.find(address => address.id === addressId);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    dialogConfig.data = {
      edit: isEdit,
      address: isEdit ? currentAddress : {},
    };
    const dialogRef = this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((address) => {
      if (address && !isEdit) {
        this.addAddress(address);
        this.personalDataForm.patchValue({ isAddress: new FormControl('true') });
      } else if (isEdit) {
        const adrIdx = this.addresses.findIndex(adr => adr.id === addressId);
        this.addresses[adrIdx] = address;
      }
    });
  }

  submit(): void {
    this.orderDetails = this.shareFormService.orderDetails;
    let orderBags: OrderBag[] = [];
    this.orderDetails.bags.forEach((bagItem) => {
      const bag: OrderBag = { amount: bagItem.quantity, id: bagItem.id };
      orderBags.push(bag);
    });
    orderBags = orderBags.filter(bag => bag.amount !== 0);
    this.personalData.firstName = this.personalDataForm.get('firstName').value;
    this.personalData.lastName = this.personalDataForm.get('lastName').value;
    this.personalData.email = this.personalDataForm.get('email').value;
    this.personalData.phoneNumber = this.personalDataForm.get('phoneNumber').value.slice(3);
    this.order = new Order(
      this.shareFormService.orderDetails.additionalOrders,
      orderBags,
      this.shareFormService.orderDetails.certificates,
      this.shareFormService.orderDetails.orderComment,
      this.personalData,
      this.shareFormService.orderDetails.pointsToUse);
    this.orderService.processOrder(this.order).pipe(takeUntil(this.destroy)).subscribe(res => {
    });
  }
}
