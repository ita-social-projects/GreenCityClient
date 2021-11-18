import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-ubs-admin-order-details-form',
  templateUrl: './ubs-admin-order-details-form.component.html',
  styleUrls: ['./ubs-admin-order-details-form.component.scss']
})
export class UbsAdminOrderDetailsFormComponent implements OnInit, OnDestroy {
  public payMore = true;
  public isInputDisabled = false;
  public buyMore = false;
  public showUbsCourier = false;
  // TODO: change to data from backend
  public courierPricePerPackage = 50;
  public minAmountBigBags = 2;
  //
  private order;
  public orderInfo = {
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
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public currentLanguage: string;
  pageOpen: boolean;
  @Input() orderDetails;
  @Input() orderDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService
      .getSelectedOrderStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((order) => {
        this.order = order;
        this.calculateFinalSum();
      });
    this.orderDetails.bags.forEach((bag) => {
      this.orderInfo = {
        amount: {
          planned: this.orderInfo.amount.planned + bag.planned,
          confirmed: this.orderInfo.amount.confirmed + bag.confirmed,
          actual: this.orderInfo.amount.actual + bag.actual
        },
        sum: {
          planned: this.orderInfo.sum.planned + bag.planned * bag.price,
          confirmed: this.orderInfo.sum.confirmed + bag.confirmed * bag.price,
          actual: this.orderInfo.sum.actual + bag.actual * bag.price
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
    const bonusesAndCert = this.orderInfo.bonuses + this.orderInfo.certificateDiscount;
    this.checkAmountOfBigBags();
    this.orderInfo.finalSum = {
      planned: this.orderInfo.sum.planned - bonusesAndCert,
      confirmed: this.orderInfo.sum.confirmed - bonusesAndCert,
      actual: this.orderInfo.sum.actual - bonusesAndCert + (this.showUbsCourier ? this.courierPricePerPackage : 0)
    };
    for (const type in this.orderInfo.finalSum) {
      if (this.orderInfo.finalSum[type] < 0) {
        this.orderInfo.finalSum[type] = 0;
      }
    }
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  public onQuantityChange(bagType, bagId) {
    this.orderDetails.bags.forEach((bag) => {
      if (bag.id === Number(bagId)) {
        bag[bagType] = this.orderDetailsForm.get(bagType + 'Quantity' + bagId).value;
        this.orderInfo.sum[bagType] = this.orderInfo.amount[bagType] = 0;
        this.orderDetails.bags.forEach((bagObj) => {
          this.orderInfo.sum[bagType] += bagObj[bagType] * bagObj.price;
          this.orderInfo.amount[bagType] += +bagObj[bagType];
        });
        this.calculateFinalSum();
      }
    });
  }

  private checkAmountOfBigBags() {
    let amountOfBigBags = 0;
    const type = this.order.ableActualChange ? 'actual' : 'confirmed';
    this.showUbsCourier = this.buyMore = false;
    this.orderDetailsForm.controls.isMinOrder.setValue(true);
    this.orderDetails.bags.forEach((bag) => {
      if (bag.capacity === 120) {
        amountOfBigBags += bag[type];
      }
    });
    if (amountOfBigBags < this.minAmountBigBags) {
      if (type === 'actual') {
        this.showUbsCourier = true;
      } else {
        this.buyMore = true;
        this.orderDetailsForm.controls.isMinOrder.setValue('');
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
