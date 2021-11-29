import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { Bag, FinalOrder, Locations, OrderDetails } from '../../models/ubs.interface';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup/ubs-order-location-popup.component';

@Component({
  selector: 'app-ubs-order-details',
  templateUrl: './ubs-order-details.component.html',
  styleUrls: ['./ubs-order-details.component.scss']
})
export class UBSOrderDetailsComponent extends FormBaseComponent implements OnInit, OnDestroy {
  orders: OrderDetails;
  bags: Bag[];
  orderDetailsForm: FormGroup;
  certStatuses = [];
  minOrderValue = 500;
  showTotal = 0;
  pointsUsed = 0;
  certificates = [];
  certificateSum = 0;
  total = 0;
  finalSum = 0;
  minAmountOfBigBags: number;
  totalOfBigBags: number;
  cancelCertBtn = false;
  points: number;
  defaultPoints: number;
  displayMinOrderMes = false;
  displayMinBigBagsMes = false;
  displayMes = false;
  displayCert = false;
  displayShop = false;
  addCert = false;
  onSubmit = true;
  order: {};
  certificateMask = '0000-0000';
  ecoStoreMask = '0000000000';
  servicesMask = '000';
  certificatePattern = /(?!0000)\d{4}-(?!0000)\d{4}/;
  commentPattern = /^[i\s]{0,255}(.){0,255}[i\s]{0,255}$/;
  additionalOrdersPattern = /^\d{10}$/;
  displayOrderBtn = false;
  certSize = false;
  showCertificateUsed = 0;
  certificateLeft = 0;
  certDate: string;
  certStatus: string;
  failedCert = false;
  userOrder: FinalOrder;
  ecoShopOrdersNumbersCounter = 1;
  limitOfEcoShopOrdersNumbers = 5;
  object: {};
  private destroy: Subject<boolean> = new Subject<boolean>();
  public currentLanguage: string;
  public certificateError = false;
  bonusesRemaining: boolean;
  isDialogOpen = false;
  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'custom-ubs-style',
    data: {
      popupTitle: 'confirmation.title',
      popupSubtitle: 'confirmation.subTitle',
      popupConfirm: 'confirmation.cancel',
      popupCancel: 'confirmation.dismiss',
      isUBS: true
    }
  };
  public locations: Locations[];
  public selectedLocationId: number;
  public currentLocation: string;
  public isFetching = false;
  public changeLocation = false;
  isBonus: string;
  public previousPath = 'ubs';

  constructor(
    private fb: FormBuilder,
    private shareFormService: UBSOrderFormService,
    private localStorageService: LocalStorageService,
    public orderService: OrderService,
    public renderer: Renderer2,
    router: Router,
    dialog: MatDialog
  ) {
    super(router, dialog, orderService);
    this.initForm();
  }

  ngOnInit(): void {
    const locationId = this.shareFormService.locationId;
    if (locationId) {
      this.currentLanguage = this.localStorageService.getCurrentLanguage();
      this.locations = this.shareFormService.locations;
      this.selectedLocationId = locationId;
      this.saveLocation(false);
    } else {
      this.openLocationDialog();
    }
    localStorage.removeItem('UBSorderData');
    this.orderService.locationSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.takeOrderData();
      this.subscribeToLangChange();
      if (this.localStorageService.getUbsOrderData()) {
        this.calculateTotal();
      }
    });
  }

  saveLocation(isCheck: boolean) {
    this.isFetching = true;
    const selectedLocation = { locationId: this.selectedLocationId };
    this.orderService
      .addLocation(selectedLocation)
      .pipe(take(1))
      .subscribe(() => {
        this.setCurrentLocation(this.currentLanguage);
        this.isFetching = false;
        this.changeLocation = false;
        this.orderService.setLocationData(this.currentLocation);
        this.orderService.completedLocation(true);
        this.localStorageService.setLocationId(this.selectedLocationId);
        if (isCheck) {
          this.orderService.setCurrentAddress(JSON.parse(localStorage.getItem('addresses'))[0]);
        }
      });
  }

  private setCurrentLocation(currentLanguage: string): void {
    this.currentLocation = this.locations.find((loc) => loc.id === this.selectedLocationId && loc.languageCode === currentLanguage).name;
  }

  getFormValues(): boolean {
    return this.showTotal > 0;
  }

  initForm() {
    this.orderDetailsForm = this.fb.group({
      orderComment: new FormControl(''),
      bonus: new FormControl('no'),
      shop: new FormControl('no'),
      formArrayCertificates: this.fb.array([new FormControl('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)])]),
      additionalOrders: this.fb.array(['']),
      orderSum: new FormControl(0, [Validators.required, Validators.min(500)])
    });
  }

  openLocationDialog() {
    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(UbsOrderLocationPopupComponent, {
      hasBackdrop: true,
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        if (res.data) {
          this.locations = res.data;
          this.selectedLocationId = res.locationId;
          this.setCurrentLocation(res.currentLanguage);
        }
        this.isDialogOpen = false;
      });
  }

  checkTotalBigBags() {
    this.bags.forEach((bag) => {
      if (bag.capacity === 120) {
        const q1 = this.orderDetailsForm.controls.quantity1;
        const q2 = this.orderDetailsForm.controls.quantity2;
        this.totalOfBigBags = +q1.value + +q2.value;
      }
    });
    setTimeout(() => this.checkForBigBagsMessage());
  }

  checkForBigBagsMessage() {
    this.displayMinBigBagsMes = this.minAmountOfBigBags > this.totalOfBigBags;
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.currentLanguage = this.localStorageService.getCurrentLanguage();
      this.setCurrentLocation(this.currentLanguage);
      const inputsQuantity = [];
      this.bags.forEach((a) => {
        inputsQuantity.push(a.quantity === undefined || a.quantity === null ? null : a.quantity);
        a.quantity = null;
      });
      this.bags = this.orders.bags;
      this.filterBags();
      this.bags.forEach((b) => {
        b.quantity = inputsQuantity.shift();
      });
      this.calculateTotal();
    });
  }

  public takeOrderData() {
    this.isFetching = true;
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.orderService
      .getOrders()
      .pipe(takeUntil(this.destroy))
      .subscribe((orderData: OrderDetails) => {
        this.orders = this.shareFormService.orderDetails;
        this.minAmountOfBigBags = orderData.minAmountOfBigBags;
        this.bags = this.orders.bags;
        this.points = this.orders.points;
        this.defaultPoints = this.points;
        this.certificateLeft = orderData.points;
        this.bags.forEach((bag) => {
          bag.quantity = bag.quantity === undefined ? null : bag.quantity;
          this.orderDetailsForm.addControl('quantity' + String(bag.id), new FormControl('', [Validators.min(0), Validators.max(999)]));
          const quantity = bag.quantity === null ? '' : +bag.quantity;
          const valueName = 'quantity' + String(bag.id);
          this.orderDetailsForm.controls[valueName].setValue(quantity);
        });
        this.filterBags();
        this.isFetching = false;
      });
  }

  private filterBags(): void {
    this.bags = this.orders.bags.filter((value) => value.code === this.currentLanguage).sort((a, b) => b.price - a.price);
  }

  changeForm() {
    this.orderDetailsForm.patchValue({
      orderSum: this.showTotal
    });
  }

  changeOrderDetails() {
    this.shareFormService.orderDetails.pointsToUse = this.pointsUsed;
    this.shareFormService.orderDetails.certificates = this.certificates;
    this.shareFormService.orderDetails.additionalOrders = this.additionalOrders.value;
    this.shareFormService.orderDetails.orderComment = this.orderDetailsForm.value.orderComment;
    this.shareFormService.orderDetails.certificatesSum = this.showCertificateUsed;
    this.shareFormService.orderDetails.pointsSum = this.pointsUsed;
    this.shareFormService.orderDetails.total = this.showTotal;
    this.shareFormService.orderDetails.finalSum = this.finalSum;
    this.shareFormService.changeOrderDetails();
  }

  get formArrayCertificates() {
    return this.orderDetailsForm.get('formArrayCertificates') as FormArray;
  }

  get additionalOrders() {
    return this.orderDetailsForm.get('additionalOrders') as FormArray;
  }

  get orderComment() {
    return this.orderDetailsForm.get('orderComment') as FormArray;
  }

  get shop() {
    return this.orderDetailsForm.get('shop') as FormArray;
  }

  private calculateTotal(): void {
    this.total = 0;
    this.bags.forEach((bag) => {
      this.total += bag.price * bag.quantity;
    });
    this.showTotal = this.total;
    this.changeForm();
    this.displayMinOrderMes = this.total < this.minOrderValue && this.orderDetailsForm.dirty;
    this.onSubmit = this.displayMinOrderMes;
    this.finalSum = this.total - this.pointsUsed;
    if (this.certificateSum > 0) {
      if (this.total > this.certificateSum) {
        this.certificateLeft = 0;
        this.finalSum = this.total - this.certificateSum - this.pointsUsed;
        this.showCertificateUsed = this.certificateSum;
      } else {
        this.finalSum = 0;
        this.certificateLeft = this.certificateSum - this.total;
        this.showCertificateUsed = this.total;
        this.points = this.orders.points;
      }
      this.bonusesRemaining = this.certificateSum > 0;
    } else {
      this.certificateLeft = 0;
      this.finalSum = this.total - this.certificateSum - this.pointsUsed;
      this.showCertificateUsed = this.certificateSum;
    }
    this.changeOrderDetails();
  }

  public ecoStoreValidation() {
    const orderValues = [...new Set(this.additionalOrders.value)];
    const checkDuplicate = orderValues.length === this.additionalOrders.length;
    let counter = 0;
    this.additionalOrders.controls.forEach((controller) => {
      if (controller.valid && controller.dirty && controller.value !== '' && checkDuplicate) {
        counter++;
      }
    });
    this.displayOrderBtn = counter === this.additionalOrders.controls.length;
  }

  public changeShopRadioBtn() {
    this.orderDetailsForm.controls.shop.setValue('yes');
  }

  public selectPointsRadioBtn(event: KeyboardEvent, radioButtonValue: string) {
    if (['Enter', 'Space', 'NumpadEnter'].includes(event.code)) {
      this.orderDetailsForm.controls.bonus.setValue(radioButtonValue);
    }
  }

  public selectShopRadioBtn(event: KeyboardEvent, radioButtonValue: string) {
    if (['Enter', 'Space', 'NumpadEnter'].includes(event.code)) {
      this.orderDetailsForm.controls.shop.setValue(radioButtonValue);
      radioButtonValue === 'yes'
        ? this.renderer.selectRootElement(`#index${this.additionalOrders.controls.length - 1}`).focus()
        : this.clearOrderValues();
    }
  }

  isDisabled(): number {
    return this.orderDetailsForm.controls.shop.value === 'yes' ? 0 : -1;
  }

  clearOrderValues(): void {
    this.additionalOrders.controls[0].setValue('');
    if (this.additionalOrders.controls.length > 1) {
      this.additionalOrders.controls.splice(1);
    }
    this.ecoStoreValidation();
  }

  onQuantityChange(id?: number): void {
    this.bags.forEach((bag) => {
      const valueName = 'quantity' + String(bag.id);
      const orderFormBagController = this.orderDetailsForm.controls[valueName];
      const inputValue = `${Number(orderFormBagController.value)}`;
      orderFormBagController.setValue(inputValue);
      if (Number(orderFormBagController.value) > 0) {
        bag.quantity = orderFormBagController.value;
      } else {
        orderFormBagController.setValue('');
        bag.quantity = null;
      }
    });
    document.getElementById(`quantity${id}`).focus();
    this.checkTotalBigBags();
    this.calculateTotal();
    if (this.isBonus === 'yes') {
      this.calculatePoints();
    }
  }

  calculatePoints(): void {
    const fullDiscount = this.points + this.pointsUsed;
    const totalSumIsBiggerThanPoints = this.points + this.pointsUsed <= this.showTotal;
    if (this.certificateSum < 0) {
      if (totalSumIsBiggerThanPoints) {
        this.pointsUsed = fullDiscount;
        this.points = 0;
        this.finalSum = this.showTotal - fullDiscount - this.certificateSum;
        if (this.finalSum < 0) {
          this.finalSum = 0;
        }
      } else if (this.pointsUsed >= this.showTotal || fullDiscount > this.showTotal) {
        this.points += this.pointsUsed;
        this.pointsUsed = this.showTotal;
        this.points = this.points - this.pointsUsed;
        this.finalSum = 0;
      }
    } else {
      this.calculatePointsWithCertificate();
    }
  }

  private calculatePointsWithCertificate() {
    this.total = this.showTotal;
    const certificateUsed = this.certificateSum - this.certificateLeft;
    const totalSumIsBiggerThanPoints = this.total - certificateUsed === 0;
    this.points = this.points + this.pointsUsed;
    if (totalSumIsBiggerThanPoints) {
      this.showCertificateUsed = certificateUsed;
      this.points = this.points - this.pointsUsed;
      this.pointsUsed = 0;
      this.finalSum = 0;
    } else {
      if (this.points >= this.showTotal - certificateUsed) {
        this.pointsUsed = this.showTotal - certificateUsed;
        this.points = this.points - this.pointsUsed;
        this.finalSum = 0;
      } else {
        this.pointsUsed = this.points;
        this.points = 0;
        this.finalSum = this.showTotal - this.certificateSum - this.pointsUsed;
      }
    }
  }

  addOrder(): void {
    this.ecoShopOrdersNumbersCounter++;
    const additionalOrdersArray = this.orderDetailsForm.get('additionalOrders') as FormArray;
    additionalOrdersArray.markAsUntouched();
    const additionalOrder = new FormControl('', [Validators.minLength(10)]);
    this.additionalOrders.push(additionalOrder);
    this.ecoStoreValidation();
    setTimeout(() => {
      this.renderer.selectRootElement(`#index${this.additionalOrders.controls.length - 1}`).focus();
    }, 0);
  }

  canAddEcoShopOrderNumber(): boolean {
    return this.ecoShopOrdersNumbersCounter < this.limitOfEcoShopOrdersNumbers;
  }

  deleteOrder(index: number): void {
    this.ecoShopOrdersNumbersCounter--;
    const orders = this.additionalOrders;
    orders.length > 1 ? orders.removeAt(index) : orders.reset(['']);
    this.changeOrderDetails();
  }

  removeOrder(event: KeyboardEvent, index: number) {
    if (['Enter', 'Space', 'NumpadEnter'].includes(event.code)) {
      this.deleteOrder(index);
    }
  }

  disableAddCertificate() {
    return this.certificates.length === this.formArrayCertificates.length;
  }

  addNewCertificate(): void {
    this.formArrayCertificates.push(this.fb.control('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)]));
  }

  setNewValue(newItem: any) {
    this.points = newItem.points;
    this.pointsUsed = newItem.pointsUsed;
    this.displayCert = newItem.displayCert;
    this.showCertificateUsed = newItem.certificateSum;
    this.finalSum = newItem.finalSum;
    this.isBonus = newItem.isBonus;
    this.certificateSum = newItem.certificateSum;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
