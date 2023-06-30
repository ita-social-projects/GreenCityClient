import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit, Renderer2, Output, EventEmitter } from '@angular/core';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { Bag, CourierLocations, OrderDetails } from '../../models/ubs.interface';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup/ubs-order-location-popup.component';
import { ExtraPackagesPopUpComponent } from './extra-packages-pop-up/extra-packages-pop-up.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { limitStatus } from 'src/app/ubs/ubs-admin/components/ubs-admin-tariffs/ubs-tariffs.enum';

@Component({
  selector: 'app-ubs-order-details',
  templateUrl: './ubs-order-details.component.html',
  styleUrls: ['./ubs-order-details.component.scss']
})
export class UBSOrderDetailsComponent extends FormBaseComponent implements OnInit, OnDestroy {
  orders: OrderDetails;
  bags: Bag[];
  orderDetailsForm: FormGroup;
  minOrderValue: number;
  maxOrderValue: number;
  minAmountOfBigBags: number;
  maxAmountOfBigBags: number;
  totalOfBigBags: number;
  displayMinOrderMes: boolean;
  displayMaxOrderMes: boolean;
  displayMinBigBagsMes: boolean;
  displayMaxBigBagsMes: boolean;
  showTotal = 0;
  pointsUsed = 0;
  certificates = [];
  certificateSum = 0;
  total = 0;
  finalSum = 0;
  points: number;
  defaultPoints: number;
  displayCert = false;
  onSubmit = true;
  order: {};

  certificateMask = Masks.certificateMask;
  ecoStoreMask = Masks.ecoStoreMask;
  servicesMask = Masks.servicesMask;
  certificatePattern = Patterns.serteficatePattern;
  commentPattern = Patterns.ubsCommentPattern;
  additionalOrdersPattern = Patterns.orderEcoStorePattern;
  displayOrderBtn = false;
  showCertificateUsed = 0;
  certificateLeft = 0;
  certDate: string;
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
  public locations: CourierLocations;
  public selectedLocationId: number;
  public currentLocation: string;
  public isFetching = false;
  public changeLocation = false;
  isBonus: string;
  public previousPath = 'ubs';
  public isThisExistingOrder: boolean;
  public existingOrderId: number;
  public locationId: number;
  public courierLimitByAmount: boolean;
  public courierLimitBySum: boolean;
  public courierLimitValidation: boolean;
  @Output() secondStepDisabledChange = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private shareFormService: UBSOrderFormService,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    public orderService: OrderService,
    public renderer: Renderer2,
    private route: ActivatedRoute,
    router: Router,
    dialog: MatDialog
  ) {
    super(router, dialog, orderService);
    this.initForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const key = 'isThisExistingOrder';
      this.isThisExistingOrder = !!params[key];
    });

    if (this.isThisExistingOrder) {
      this.existingOrderId = parseInt(this.localStorageService.getExistingOrderId(), 10);
      this.orderService
        .getTariffForExistingOrder(this.existingOrderId)
        .pipe(takeUntil(this.destroy))
        .subscribe((tariffData: CourierLocations) => {
          this.locationId = tariffData.locationsDtosList[0].locationId;
          this.locations = tariffData;
          this.localStorageService.setLocations(this.locations);
          this.setLocation(this.locationId);
        });
    } else {
      this.locationId = this.shareFormService.locationId;
      this.setLocation(this.locationId);
    }
    this.takeOrderData();
    this.subscribeToLangChange();
    if (this.localStorageService.getUbsOrderData()) {
      this.calculateTotal();
    }
  }

  changeQuantity(id: number, value: number): void {
    const formControl = this.orderDetailsForm.get('quantity' + id);
    const maxValue = 999;
    const minValue = 0;
    const newValue = Number(formControl.value) + value;

    if (newValue <= maxValue && newValue >= minValue) {
      formControl.setValue(String(newValue));
      this.onQuantityChange(id);
    }
  }

  public setLimitsValues(): void {
    this.checkCourierLimit();
    this.locations = this.localStorageService.getLocations();
    this.minOrderValue = this.locations?.min;
    this.maxOrderValue = this.locations?.max;
    this.minAmountOfBigBags = this.locations?.min;
    this.maxAmountOfBigBags = this.locations?.max;
    this.validateBags();
    this.validateSum();
  }

  public checkCourierLimit(): void {
    if (this.locations?.courierLimit === limitStatus.limitByPriceOfOrder) {
      this.courierLimitBySum = true;
    } else {
      this.courierLimitByAmount = true;
    }
  }

  public setLocation(locationId: number | undefined): void {
    if (locationId) {
      this.currentLanguage = this.localStorageService.getCurrentLanguage();
      this.locations = !this.locations ? this.shareFormService.locations : this.locations;
      this.selectedLocationId = this.locationId;
      this.setLimitsValues();
      this.saveLocation(false);
    } else {
      this.openLocationDialog();
    }
  }

  public checkOnNumber(event: KeyboardEvent): boolean {
    return !isNaN(Number(event.key));
  }

  saveLocation(isCheck: boolean) {
    this.isFetching = true;
    this.setCurrentLocation(this.currentLanguage);
    this.isFetching = false;
    this.changeLocation = false;
    this.orderService.setLocationData(this.currentLocation);
    this.orderService.completedLocation(true);
    this.localStorageService.setLocationId(this.selectedLocationId);
    if (isCheck) {
      this.orderService.setCurrentAddress(JSON.parse(localStorage.getItem('addresses'))[0]);
    }
  }

  private setCurrentLocation(currentLanguage: string): void {
    const currentLocationEn = `${this.locations?.locationsDtosList[0].nameEn}, ${this.locations?.regionDto.nameEn}`;
    const currentLocationUk = `${this.locations?.locationsDtosList[0].nameUk}, ${this.locations?.regionDto.nameUk}`;
    this.currentLocation = this.getLangValue(currentLocationUk, currentLocationEn);
  }

  getFormValues(): boolean {
    return this.showTotal > 0;
  }

  initForm() {
    this.orderDetailsForm = this.fb.group({
      orderComment: new FormControl('', Validators.maxLength(255)),
      bonus: new FormControl('no'),
      shop: new FormControl('no'),
      formArrayCertificates: this.fb.array([new FormControl('', [Validators.minLength(8), Validators.pattern(this.certificatePattern)])]),
      additionalOrders: this.fb.array(['']),
      orderSum: new FormControl(0, [Validators.required])
    });
  }

  openLocationDialog() {
    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(UbsOrderLocationPopupComponent, {
      hasBackdrop: true,
      disableClose: false
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        if (res && res.data) {
          this.locations = res.data;
          this.selectedLocationId = res.locationId;
          this.setCurrentLocation(res.currentLanguage);
          this.setLimitsValues();
          this.orderDetailsForm.markAllAsTouched();
          this.takeOrderData();
        } else {
          this.router.navigate(['/ubs']);
        }
        this.isDialogOpen = false;
      });
  }

  changeSecondStepDisabled(value: boolean) {
    this.secondStepDisabledChange.emit(value);
  }

  checkTotalBigBags() {
    this.totalOfBigBags = 0;
    this.bags.forEach((bag) => {
      if (bag.limitedIncluded) {
        const quantity = this.orderDetailsForm.controls[`quantity${bag.id}`];
        this.totalOfBigBags += +quantity.value;
      }
    });
    this.validateBags();
    this.changeSecondStepDisabled(this.courierLimitValidation);
  }

  private validateLimit(
    isCourierLimited: boolean,
    minValue: number,
    totalValue: number,
    maxValue?: number
  ): { min: boolean; max: boolean } {
    let displayMinMessage = false;
    let displayMaxMessage = false;

    if (isCourierLimited) {
      displayMinMessage = minValue > totalValue;
      displayMaxMessage = maxValue ? maxValue < totalValue : false;
    }

    return { min: displayMinMessage, max: displayMaxMessage };
  }

  private validateSum(): void {
    const result = this.validateLimit(this.courierLimitBySum, this.minOrderValue, this.total, this.maxOrderValue);
    this.displayMinOrderMes = result.min;
    this.displayMaxOrderMes = result.max;
    this.courierLimitValidation = this.displayMinOrderMes || this.displayMaxOrderMes;
  }

  private validateBags(): void {
    const result = this.validateLimit(this.courierLimitByAmount, this.minAmountOfBigBags, this.totalOfBigBags, this.maxAmountOfBigBags);
    this.displayMinBigBagsMes = result.min;
    this.displayMaxBigBagsMes = result.max;
    this.courierLimitValidation = this.displayMinBigBagsMes || this.displayMaxBigBagsMes;
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
    if (!this.isThisExistingOrder) {
      this.localStorageService.removeUbsOrderAndPersonalData();
      this.localStorageService.removeanotherClientData();
    }
    this.orderService
      .getOrders(this.localStorageService.getLocationId(), this.localStorageService.getTariffId())
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (orderData: OrderDetails) => {
          this.orders = this.shareFormService.orderDetails;
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
          setTimeout(() => {
            this.shareFormService.changeOrderDetails();
            this.checkTotalBigBags();
          }, 0);
        },
        (error) => {
          this.openLocationDialog();
        }
      );
  }

  private filterBags(): void {
    this.bags = this.orders.bags.sort((a, b) => b.price - a.price);
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
    this.validateSum();
    this.onSubmit = this.displayMinOrderMes || this.displayMaxOrderMes;
    this.onSubmit = this.displayMinBigBagsMes || this.displayMaxBigBagsMes;
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
    this.shareFormService.changeAddCertButtonVisibility(this.finalSum > 0);
    this.changeOrderDetails();
  }

  public ecoStoreValidation() {
    const orderValues = [...new Set(this.additionalOrders.value)];
    const checkDuplicate = orderValues.length === this.additionalOrders.length;
    let counter = 0;
    this.additionalOrders.controls.forEach((controller) => {
      if (controller.dirty && controller.value && checkDuplicate) counter++;
    });
    this.displayOrderBtn = counter === this.additionalOrders.controls.length;
  }

  public changeShopRadioBtn() {
    this.orderDetailsForm.controls.shop.setValue('yes');
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
    this.certificates = newItem.certificates;
  }

  openExtraPackages(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'extra-packages';
    this.dialog.open(ExtraPackagesPopUpComponent, dialogConfig);
  }

  redirectToZeroStep() {
    this.openLocationDialog();
  }

  getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
