import { OrderService } from 'src/app/ubs/ubs-admin/services/order.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { IOrderDetails } from '../../models/ubs-admin.interface';
import { Masks, Patterns } from 'src/assets/patterns/patterns';

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
  public doneAfterBroughtHimself = false;
  public isVisible: boolean;
  public bagsInfo;
  public orderDetails: IOrderDetails;
  public overpayment: number;
  public overpaymentMessage: string;
  public buyMore = false;
  public showUbsCourier = false;
  public limitMsg;
  public limitAmount;
  public courierPrice: number;
  public writeoffAtStationSum: number;
  finalPrice: number;
  @Output() changeOverpayment = new EventEmitter<number>();
  @Output() checkMinOrder = new EventEmitter<boolean>();
  @Output() changeCurrentPrice = new EventEmitter<number>();

  pageOpen: boolean;
  @Input() orderDetailsOriginal: IOrderDetails;
  @Input() orderDetailsForm: FormGroup;
  @Input() orderStatusInfo;
  @Input() totalPaid: number;

  constructor(private fb: FormBuilder, private orderService: OrderService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.totalPaid) {
      this.updateOverpayment(changes.totalPaid.currentValue - changes.totalPaid.previousValue);
    }
    if (changes.orderDetailsForm) {
      this.resetOrderDetails();
      this.recalculateSum();
    }

    if (changes.orderStatusInfo?.previousValue?.ableActualChange !== changes.orderStatusInfo?.currentValue.ableActualChange) {
      const prevStatus = changes.orderStatusInfo.previousValue?.key;
      const curStatus = changes.orderStatusInfo.currentValue.key;
      this.isVisible = !this.isVisible;
      this.doneAfterBroughtHimself = this.checkStatusDoneAfterBroughtHimself(prevStatus, curStatus);
      this.recalculateSum();
    } else {
      this.doneAfterBroughtHimself = false;
    }
  }

  ngOnInit(): void {
    this.isVisible = this.orderStatusInfo.ableActualChange;
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

  private resetBagsInfo() {
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

  private setBagsInfo() {
    this.orderDetails.bags = this.orderDetails.bags.filter((bag) => bag.planned);
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

  private calculateFinalSum() {
    const bonusesAndCert = this.bagsInfo.bonuses + this.bagsInfo.certificateDiscount;
    this.checkMinOrderLimit();
    this.bagsInfo.finalSum = {
      planned: this.bagsInfo.sum.planned - bonusesAndCert,
      confirmed: this.bagsInfo.sum.confirmed - bonusesAndCert,
      actual: this.bagsInfo.sum.actual - bonusesAndCert + (this.showUbsCourier ? this.orderDetails.courierPricePerPackage : 0)
    };
    if (this.doneAfterBroughtHimself) {
      this.bagsInfo.finalSum.actual = this.bagsInfo.sum.actual - bonusesAndCert - this.courierPrice + this.writeoffAtStationSum;
    }
    for (const type in this.bagsInfo.finalSum) {
      if (this.bagsInfo.finalSum[type] < 0) {
        this.bagsInfo.finalSum[type] = 0;
      }
    }
    this.calculateOverpayment();
    this.setFinalFullPrice();
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  public onQuantityChange(bagType, bagId) {
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

  private emitCurrentOrderPrice(sum: number): void {
    this.changeCurrentPrice.emit(sum);
  }

  private calculateOverpayment() {
    const bagType = this.orderStatusInfo.ableActualChange ? 'actual' : 'confirmed';
    let priceWithoutCertificate = this.bagsInfo.sum[bagType] - this.orderDetails.certificateDiscount;

    if (priceWithoutCertificate < 0) {
      priceWithoutCertificate = 0;
    }

    this.overpayment = this.orderDetails.bonuses + this.orderDetails.paidAmount - priceWithoutCertificate;
    this.changeOverpayment.emit(this.overpayment);
    if (this.overpayment) {
      this.overpaymentMessage = this.orderService.getOverpaymentMsg(this.overpayment);
      this.overpayment = Math.abs(this.overpayment);
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

  private checkStatusDoneAfterBroughtHimself(prevStatus, currentStatus) {
    return prevStatus === 'BROUGHT_IT_HIMSELF' && currentStatus === 'DONE';
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
    this.courierPrice = this.orderDetails.courierPricePerPackage;
    this.checkMinOrder.emit(true);
    this.setAmountOfBigBags(type);
    if (this.orderDetails.courierInfo.courierLimit === 'LIMIT_BY_AMOUNT_OF_BAG') {
      expression = this.orderDetails.courierInfo.maxAmountOfBigBags
        ? this.amountOfBigBags < this.orderDetails.courierInfo.minAmountOfBigBags ||
          this.amountOfBigBags > this.orderDetails.courierInfo.maxAmountOfBigBags
        : this.amountOfBigBags < this.orderDetails.courierInfo.minAmountOfBigBags;
      this.limitMsg = {
        min: 'order-details.min-bags',
        max: 'order-details.max-bags'
      };
      this.limitAmount = {
        min: this.orderDetails.courierInfo.minAmountOfBigBags,
        max: this.orderDetails.courierInfo.maxAmountOfBigBags || '-'
      };
    } else if (this.orderDetails.courierInfo.courierLimit === 'LIMIT_BY_SUM_OF_ORDER') {
      expression = this.orderDetails.courierInfo.maxPriceOfOrder
        ? this.bagsInfo.sum[type] < this.orderDetails.courierInfo.minPriceOfOrder ||
          this.bagsInfo.sum[type] > this.orderDetails.courierInfo.maxPriceOfOrder
        : this.bagsInfo.sum[type] < this.orderDetails.courierInfo.minPriceOfOrder;
      this.limitMsg = {
        min: 'order-details.min-sum',
        max: 'order-details.max-sum'
      };
      this.limitAmount = {
        min: this.orderDetails.courierInfo.minPriceOfOrder,
        max: this.orderDetails.courierInfo.maxPriceOfOrder || '-'
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

    if (this.doneAfterBroughtHimself) {
      this.showUbsCourier = true;
      this.courierPrice = this.orderDetails.courierPricePerPackage * this.amountOfBigBags;
    }
  }

  private checkEmptyOrder() {
    if (
      this.orderStatusInfo.ableActualChange === 'actual' &&
      this.orderStatusInfo.key !== 'CANCELED' &&
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
    this.calculateFinalSum();
  }
}
