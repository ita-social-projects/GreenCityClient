import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { OrderService } from '../../services/order.service';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { Address, Bag, OrderBag, OrderDetails, PersonalData } from '../../models/ubs.interface';
import { Order } from '../../models/ubs.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-personal-information',
  templateUrl: './ubs-personal-information.component.html',
  styleUrls: ['./ubs-personal-information.component.scss']
})
export class UBSPersonalInformationComponent extends FormBaseComponent implements OnInit, OnDestroy, OnChanges {
  addressId: number;
  orderDetails: OrderDetails;
  personalData: PersonalData;
  personalDataForm: FormGroup;
  shouldBePaid = true;
  order: Order;
  addresses: Address[] = [];
  maxAddressLength = 4;
  namePattern = /^[A-Za-zА-Яа-яїЇіІєЄёЁ\'\- ]+$/;
  phoneMask = '+{38\\0} (00) 000 00 00';
  firstOrder = true;
  anotherClient = false;
  currentLocation = {};
  currentLocationId: number;
  locations = [];
  currentLanguage: string;
  private destroy: Subject<boolean> = new Subject<boolean>();
  private personalDataFormValidators: ValidatorFn[] = [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(20),
    Validators.pattern(this.namePattern)
  ];
  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'confirmation.title',
      popupSubtitle: 'confirmation.subTitle',
      popupConfirm: 'confirmation.cancel',
      popupCancel: 'confirmation.dismiss'
    }
  };

  @Input() completed;

  constructor(
    public router: Router,
    public orderService: OrderService,
    private shareFormService: UBSOrderFormService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    super(router, dialog, orderService);
    this.initForm();
  }

  ngOnInit() {
    this.takeUserData();
    this.orderService.locationSub.subscribe((data) => {
      this.currentLocation = data;
    });
    this.orderService.currentAddress.subscribe((data: Address) => {
      if (data && data.city === this.currentLocation) {
        this.personalDataForm.controls.address.setValue(data);
        this.personalDataForm.controls.addressComment.setValue(data.addressComment);
      } else {
        this.personalDataForm.controls.address.setValue({});
        this.personalDataForm.controls.addressComment.setValue('');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.shareFormService.changePersonalData();
    if (changes.completed?.currentValue) {
      this.submit();
    }
  }

  findAllAddresses(isCheck: boolean) {
    this.orderService
      .findAllAddresses()
      .pipe(takeUntil(this.destroy))
      .subscribe((list) => {
        this.addresses = this.getLastAddresses(list.addressList);
        localStorage.setItem('addresses', JSON.stringify(this.addresses));
        this.personalDataForm.patchValue({
          address: this.addresses
        });

        if (this.addresses[0] && isCheck) {
          this.checkAddress(this.addresses[0].id);
        }
      });
  }

  private getLastAddresses(addressList: Address[]) {
    const lastAddresses = -4;
    return addressList.slice(lastAddresses);
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  initForm() {
    this.personalDataForm = this.fb.group({
      firstName: ['', this.personalDataFormValidators],
      lastName: ['', this.personalDataFormValidators],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['+38 0', [Validators.required, Validators.minLength(12)]],
      anotherClientFirstName: [''],
      anotherClientLastName: [''],
      anotherClientEmail: ['', Validators.email],
      anotherClientPhoneNumber: [''],
      address: ['', Validators.required],
      addressComment: ['', Validators.maxLength(255)]
    });
  }

  public takeUserData() {
    this.orderService
      .getPersonalData()
      .pipe(takeUntil(this.destroy))
      .subscribe((personalData: PersonalData) => {
        this.personalData = this.shareFormService.personalData;
        this.setFormData();
        this.findAllAddresses(true);
      });
  }

  checkAddress(addressId) {
    this.addresses.forEach((address) => {
      if ((address.id !== addressId && address.actual) || (address.id === addressId && !address.actual)) {
        address.actual = !address.actual;
      }
      if (address.actual) {
        this.orderService.setCurrentAddress(address);
      }
    });

    this.changeAddressInPersonalData();
  }

  changeAddressInPersonalData() {
    const activeAddress = this.addresses.find((address) => address.actual);
    this.personalData.city = activeAddress.city;
    this.personalData.district = activeAddress.district;
    this.personalData.street = activeAddress.street;
    this.personalData.houseNumber = activeAddress.houseNumber;
    this.personalData.houseCorpus = activeAddress.houseCorpus;
    this.personalData.entranceNumber = activeAddress.entranceNumber;
    this.personalData.latitude = activeAddress.latitude;
    this.personalData.longitude = activeAddress.longitude;
  }

  setFormData(): void {
    this.personalDataForm.patchValue({
      firstName: this.personalData.firstName,
      lastName: this.personalData.lastName,
      email: this.personalData.email,
      phoneNumber: '380' + this.personalData.phoneNumber,
      addressComment: this.addresses.length > 0 ? this.personalData.addressComment : ''
    });
  }

  togglClient(): void {
    const anotherClientFirstName = this.getControl('anotherClientFirstName');
    const anotherClientLastName = this.getControl('anotherClientLastName');
    const anotherClientPhoneNumber = this.getControl('anotherClientPhoneNumber');
    const anotherClientEmail = this.getControl('anotherClientEmail');
    this.anotherClient = !this.anotherClient;
    if (this.anotherClient) {
      anotherClientFirstName.setValidators(this.personalDataFormValidators);
      anotherClientLastName.setValidators(this.personalDataFormValidators);
      anotherClientPhoneNumber.setValidators([Validators.required, Validators.minLength(12)]);
      anotherClientPhoneNumber.setValue('+380');
    } else {
      anotherClientFirstName.setValue('');
      anotherClientFirstName.clearValidators();
      anotherClientLastName.setValue('');
      anotherClientLastName.clearValidators();
      anotherClientPhoneNumber.setValue('');
      anotherClientPhoneNumber.clearValidators();
      anotherClientEmail.setValue('');
    }
    anotherClientFirstName.updateValueAndValidity();
    anotherClientLastName.updateValueAndValidity();
    anotherClientPhoneNumber.updateValueAndValidity();
  }

  editAddress(addressId: number) {
    this.openDialog(true, addressId);
  }

  activeAddressId() {
    const activeAddress = this.addresses.find((address) => address.actual);
    this.addressId = activeAddress.id;
  }

  deleteAddress(address: Address) {
    this.orderService
      .deleteAddress(address)
      .pipe(takeUntil(this.destroy))
      .subscribe((list) => {
        this.addresses = list.addressList;
        if (this.addresses[0]) {
          this.checkAddress(this.addresses[0].id);
        } else {
          this.personalDataForm.patchValue({
            address: ''
          });
        }
      });
  }

  addNewAddress() {
    this.openDialog(false);
    this.personalDataForm.patchValue({
      address: this.addresses
    });
  }

  getControl(control: string) {
    return this.personalDataForm.get(control);
  }

  openDialog(isEdit: boolean, addressId?: number): void {
    const currentAddress = this.addresses.find((address) => address.id === addressId);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    dialogConfig.data = {
      edit: isEdit
    };
    if (isEdit) {
      dialogConfig.data.address = currentAddress;
    } else {
      dialogConfig.data.address = {};
    }
    const dialogRef = this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.findAllAddresses(false));
  }

  getFormValues(): boolean {
    return true;
  }

  submit(): void {
    this.firstOrder = false;
    this.activeAddressId();
    this.changeAddressInPersonalData();
    this.orderDetails = this.shareFormService.orderDetails;
    let orderBags: OrderBag[] = [];
    this.orderDetails.bags.forEach((bagItem: Bag, index: number) => {
      if (bagItem.quantity !== null) {
        const bag: OrderBag = { amount: bagItem.quantity, id: bagItem.id };
        orderBags.push(bag);
      }
    });
    orderBags = orderBags.filter((bag) => bag.amount !== 0);
    this.personalData.firstName = this.personalDataForm.get('firstName').value;
    this.personalData.lastName = this.personalDataForm.get('lastName').value;
    this.personalData.email = this.personalDataForm.get('email').value;
    this.personalData.phoneNumber = this.personalDataForm.get('phoneNumber').value.slice(3);
    this.personalData.anotherClientFirstName = this.personalDataForm.get('anotherClientFirstName').value;
    this.personalData.anotherClientLastName = this.personalDataForm.get('anotherClientLastName').value;
    this.personalData.anotherClientEmail = this.personalDataForm.get('anotherClientEmail').value;
    this.personalData.anotherClientPhoneNumber = this.personalDataForm.get('anotherClientPhoneNumber').value.slice(3);
    this.personalData.addressComment = this.personalDataForm.get('addressComment').value;
    this.order = new Order(
      this.shareFormService.orderDetails.additionalOrders,
      this.addressId,
      orderBags,
      this.shareFormService.orderDetails.certificates,
      this.shareFormService.orderDetails.orderComment,
      this.personalData,
      this.shareFormService.orderDetails.pointsToUse,
      this.shouldBePaid
    );
    this.orderService.setOrder(this.order);
  }

  changeAddressComment() {
    this.addresses.forEach((address) => {
      if (address.actual) {
        address.addressComment = this.personalDataForm.controls.addressComment.value;
        this.orderService.addAdress(address).subscribe(() => {
          this.orderService.setCurrentAddress(address);
          this.findAllAddresses(false);
        });
      }
    });
  }
}
