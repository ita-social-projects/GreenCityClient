import { OrderService } from 'src/app/ubs/ubs-admin/services/order.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { IOrderDetails, IGeneralOrderInfo } from '../../models/ubs-admin.interface';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { SetOrderStatus } from 'src/app/store/actions/orderStatus.actions';
import { setIsOrderDoneAfterBroughtHimself } from './../../../../store/actions/orderStatus.actions';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';

@Component({
  selector: 'app-ubs-admin-order-details-form',
  templateUrl: './ubs-admin-order-details-form.component.html',
  styleUrls: ['./ubs-admin-order-details-form.component.scss']
})
export class UbsAdminOrderDetailsFormComponent implements OnInit, OnChanges {
  private CAPACITY_OF_BIG_BAG = 120;
  public LIMIT_OF_ECO_SHOP_NUMBERS = 5;
  public SHOP_NUMBER_MASK = Masks.ecoStoreMask;
  public SHOP_NUMBER_PATTERN = Patterns.ordersPattern;
  public amountOfBigBags: number;
  public payMore = true;
  public isInputDisabled = false;
  public isVisible: boolean;
  isOrderBroughtByHimself = false;
  public bagsInfo;
  public orderDetails: IOrderDetails;
  public overpayment: number;
  public overpaymentMessage: string;
  public buyMore = false;
  public showUbsCourier = false;
  public limitMsg;
  public limitAmount;
  isOrderCancelledAfterFormed = false;
  public courierPrice: number;
  public writeoffAtStationSum: number;
  public isOrderCancelled = false;
  isOrderPaid = false;
  isCourierPriceInvalid = false;

  @Output() changeOverpayment = new EventEmitter<number>();
  @Output() checkMinOrder = new EventEmitter<boolean>();
  @Output() changeCurrentPrice = new EventEmitter<number>();
  @Output() changeUbsCourierPrice = new EventEmitter<number>();
  @Output() changeWriteoffAtStationSum = new EventEmitter<number>();
  @Output() orderStatusChanged = new EventEmitter<boolean>();

  pageOpen: boolean;
  @Input() orderDetailsOriginal: IOrderDetails;
  @Input() orderDetailsForm: FormGroup;
  @Input() orderStatusInfo;
  @Input() totalPaid: number;
  @Input() generalInfo: IGeneralOrderInfo;

  constructor(private fb: FormBuilder, private orderService: OrderService, private store: Store<IAppState>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.totalPaid) {
      this.isOrderPaid = !(changes.totalPaid.currentValue === 0);
      this.updateOverpayment(changes.totalPaid.currentValue - changes.totalPaid.previousValue);
    }

    if (changes.orderDetailsForm) {
      this.resetOrderDetails();
    }

    if (changes.orderStatusInfo?.previousValue?.ableActualChange !== changes.orderStatusInfo?.currentValue.ableActualChange) {
      const prevStatus = changes.orderStatusInfo.previousValue?.key;
      const curStatus = changes.orderStatusInfo.currentValue.key;
      this.isVisible = !this.isVisible;
    }

    if (changes.orderStatusInfo?.currentValue.key === OrderStatus.CANCELED) {
      this.isOrderCancelled = true;
    }

    if (changes.orderStatusInfo?.currentValue.key === OrderStatus.BROUGHT_IT_HIMSELF) {
      this.isOrderBroughtByHimself = true;
    }

    if (this.isOrderCancelled && changes.orderStatusInfo?.previousValue.key === OrderStatus.FORMED) {
      this.isOrderCancelledAfterFormed = true;
      this.emitChangedStatus();
      this.courierPrice = 0;
      this.emitUbsPrice(this.courierPrice);
    }

    this.recalculateSum();
  }

  ngOnInit(): void {
    this.isVisible = this.orderStatusInfo.ableActualChange;
    this.isOrderPaid = this.totalPaid !== 0;
  }

  public showWriteOffStationField(): boolean {
    const isPaidWithBonuses = this.orderDetails.bonuses !== 0;
    const isPaidWithCert = this.orderDetails.certificateDiscount !== 0;
    return this.isOrderBroughtByHimself && (this.isOrderPaid || isPaidWithBonuses || isPaidWithCert);
  }

  public resetOrderDetails() {
    this.orderDetails = JSON.parse(JSON.stringify(this.orderDetailsOriginal));
  }

  public recalculateSum() {
    this.writeoffAtStationSum = 0;
    this.courierPrice = this.orderDetails.courierPricePerPackage;
    this.resetBagsInfo();
    this.setBagsInfo();
    this.calculateFinalSum();
  }

  private resetBagsInfo(): void {
    this.bagsInfo = {
      amount: {
        planned: 0,
        confirmed: 0,
        actual: 0
      },
      sum: {
        planned: 0,
        confirmed: 0,
        actual: 0
      },
      finalSum: {
        planned: 0,
        confirmed: 0,
        actual: 0
      },
      bonuses: 0,
      certificateDiscount: 0
    };
  }

  private setBagsInfo(): void {
    this.orderDetails.bags.forEach((bag) => {
      this.bagsInfo = {
        amount: {
          planned: this.bagsInfo.amount.planned + bag.planned,
          confirmed: this.bagsInfo.amount.confirmed + bag.confirmed,
          actual: this.bagsInfo.amount.actual + bag.actual
        },
        sum: {
          planned: this.bagsInfo.sum.planned + bag.planned * bag.price,
          confirmed: this.bagsInfo.sum.confirmed + bag.confirmed * bag.price,
          actual: this.bagsInfo.sum.actual + bag.actual * bag.price
        },
        finalSum: {
          planned: 0,
          confirmed: 0,
          actual: 0
        },
        bonuses: this.orderDetails.bonuses,
        certificateDiscount: this.orderDetails.certificateDiscount
      };
    });
  }

  private calculateFinalSum(): void {
    const bonusesAndCert = this.bagsInfo.bonuses + this.bagsInfo.certificateDiscount;
    this.checkMinOrderLimit();
    this.bagsInfo.finalSum = {
      planned: this.bagsInfo.sum.planned - bonusesAndCert,
      confirmed: this.bagsInfo.sum.confirmed - bonusesAndCert,
      actual: this.bagsInfo.sum.actual - bonusesAndCert
    };

    if (this.isOrderBroughtByHimself) {
      this.bagsInfo.finalSum.confirmed = this.writeoffAtStationSum;
      this.bagsInfo.finalSum.actual = this.writeoffAtStationSum;
    }

    if (this.isVisible && this.showUbsCourier) {
      this.bagsInfo.finalSum.actual = this.bagsInfo.sum.actual + bonusesAndCert + this.courierPrice;
    }

    for (const type in this.bagsInfo.finalSum) {
      if (this.bagsInfo.finalSum[type] < 0) {
        this.bagsInfo.finalSum[type] = 0;
      }
    }

    this.calculateOverpayment();
    this.setFinalFullPrice();
  }

  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  public onQuantityChange(bagType, bagId): void {
    this.orderDetails.bags.forEach((bag) => {
      if (bag.id === Number(bagId)) {
        bag[bagType] = this.orderDetailsForm.get(bagType + 'Quantity' + bagId).value;
        this.bagsInfo.sum[bagType] = this.bagsInfo.amount[bagType] = 0;
        this.orderDetails.bags.forEach((bagObj) => {
          this.bagsInfo.sum[bagType] += bagObj[bagType] * bagObj.price;
          this.bagsInfo.amount[bagType] += +bagObj[bagType];
        });
        this.emitCurrentOrderPrice(this.bagsInfo.sum[bagType]);
        this.calculateFinalSum();
      }
    });
  }

  private emitUbsPrice(sum: number): void {
    this.changeUbsCourierPrice.emit(sum);
  }

  private emitChangedStatus(): void {
    this.orderStatusChanged.emit();
  }

  private emitSumForStation(sum: number): void {
    this.changeWriteoffAtStationSum.emit(sum);
  }

  private emitCurrentOrderPrice(sum: number): void {
    this.changeCurrentPrice.emit(sum);
  }

  private calculateOverpayment() {
    const bagType = this.orderStatusInfo.ableActualChange ? 'actual' : 'confirmed';
    let priceWithoutCertificate = this.bagsInfo?.sum[bagType] - this.orderDetails.certificateDiscount;
    priceWithoutCertificate = Math.max(priceWithoutCertificate, 0);

    let finalPrice;
    const baseSumOfOrder = this.orderDetails.bonuses + this.orderDetails.paidAmount + this.orderDetails.certificateDiscount;

    if (this.isOrderBroughtByHimself) {
      finalPrice = baseSumOfOrder - this.writeoffAtStationSum;
    } else if (this.showUbsCourier) {
      finalPrice = baseSumOfOrder - this.courierPrice;
    } else {
      finalPrice = this.orderDetails.bonuses + this.orderDetails.paidAmount - priceWithoutCertificate;
    }

    this.overpayment = Math.abs(finalPrice);
    this.changeOverpayment.emit(this.overpayment);

    if (this.overpayment) {
      this.overpaymentMessage = this.orderService.getOverpaymentMsg(this.overpayment);
    }
  }

  private updateOverpayment(sum: number): void {
    this.overpayment += sum;
    this.overpaymentMessage = this.orderService.getOverpaymentMsg(this.overpayment);
  }

  private setFinalFullPrice() {
    const bagType = this.orderStatusInfo.ableActualChange ? 'actual' : 'confirmed';
    this.orderDetailsForm.controls.orderFullPrice.setValue(this.bagsInfo.finalSum[bagType]);
  }

  private setAmountOfBigBags(type) {
    this.amountOfBigBags = 0;
    this.orderDetails.bags.forEach((bag) => {
      if (bag.capacity === this.CAPACITY_OF_BIG_BAG) {
        this.amountOfBigBags += bag[type];
      }
    });
  }

  private checkMinOrderLimit() {
    const type = this.orderStatusInfo.ableActualChange ? 'actual' : 'confirmed';
    let expression: boolean;
    this.showUbsCourier = this.buyMore = false;
    this.checkMinOrder.emit(true);
    this.setAmountOfBigBags(type);
    if (this.orderDetails.courierInfo.courierLimit === 'LIMIT_BY_AMOUNT_OF_BAG') {
      expression = this.orderDetails.courierInfo.max
        ? this.amountOfBigBags < this.orderDetails.courierInfo.min || this.amountOfBigBags > this.orderDetails.courierInfo.max
        : this.amountOfBigBags < this.orderDetails.courierInfo.min;
      this.limitMsg = {
        min: 'order-details.min-bags',
        max: 'order-details.max-bags'
      };
      this.limitAmount = {
        min: this.orderDetails.courierInfo.min,
        max: this.orderDetails.courierInfo.max || '-'
      };
    } else if (this.orderDetails.courierInfo.courierLimit === 'LIMIT_BY_SUM_OF_ORDER') {
      expression = this.orderDetails.courierInfo.max
        ? this.bagsInfo.sum[type] < this.orderDetails.courierInfo.min || this.bagsInfo.sum[type] > this.orderDetails.courierInfo.max
        : this.bagsInfo.sum[type] < this.orderDetails.courierInfo.min;
      this.limitMsg = {
        min: 'order-details.min-sum',
        max: 'order-details.max-sum'
      };
      this.limitAmount = {
        min: this.orderDetails.courierInfo.min,
        max: this.orderDetails.courierInfo.max || '-'
      };
    }
    if (expression) {
      if (type === 'actual') {
        this.showUbsCourier = true;
        this.checkEmptyOrder();
      } else {
        this.buyMore = true;
        this.checkMinOrder.emit(false);
      }
    }

    if (this.isOrderCancelledAfterFormed) {
      this.showUbsCourier = false;
    }
  }

  private checkEmptyOrder() {
    if (
      this.orderStatusInfo.ableActualChange === 'actual' &&
      this.orderStatusInfo.key !== OrderStatus.CANCELED &&
      this.bagsInfo.amount.actual === 0
    ) {
      this.checkMinOrder.emit(false);
    }
  }

  public getStoreOrderNumbers() {
    const arr = this.orderDetailsForm.controls.storeOrderNumbers as FormArray;
    return arr.controls;
  }

  public checkMaxOrdersFromShop() {
    const arr = this.orderDetailsForm.controls.storeOrderNumbers as FormArray;
    const currentAmountOfNumbersFromShop = arr.controls.length;
    return currentAmountOfNumbersFromShop < this.LIMIT_OF_ECO_SHOP_NUMBERS;
  }

  addOrderNumberFromShop() {
    const arr = this.orderDetailsForm.controls.storeOrderNumbers as FormArray;
    arr.push(new FormControl('', [Validators.required, Validators.pattern(Patterns.ordersPattern)]));
  }

  deleteOrder(index: number): void {
    const arr = this.orderDetailsForm.controls.storeOrderNumbers as FormArray;
    arr.removeAt(index);
  }

  public changeWriteOffSum(e) {
    this.writeoffAtStationSum = +e.target.value;
    this.emitSumForStation(this.writeoffAtStationSum);
    this.calculateFinalSum();
  }

  public changeUbsCourierSum(e) {
    this.courierPrice = +e.target.value;
    this.isCourierPriceInvalid = this.courierPrice > this.orderDetailsForm.value.orderFullPrice;
    this.emitUbsPrice(this.courierPrice);
    this.calculateFinalSum();
  }
}
