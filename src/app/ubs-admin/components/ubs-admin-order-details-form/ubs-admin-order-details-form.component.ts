import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ubs-admin-order-details-form',
  templateUrl: './ubs-admin-order-details-form.component.html',
  styleUrls: ['./ubs-admin-order-details-form.component.scss']
})
export class UbsAdminOrderDetailsFormComponent implements OnInit, OnChanges {
  public payMore = true;
  public isInputDisabled = false;
  public doneAfterBroughtHimself = false;
  public isVisible = true;
  public bagsInfo;
  public orderDetails;
  public buyMore = false;
  public showUbsCourier = false;
  // TODO: change to data from backend
  public courierPricePerPackage = 50;
  public minAmountBigBags = 2;
  //

  pageOpen: boolean;
  @Input() orderDetailsOriginal;
  @Input() orderDetailsForm: FormGroup;
  @Input() orderStatusInfo;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    const prevStatus = changes.orderStatusInfo?.previousValue?.name;
    const curStatus = changes.orderStatusInfo?.currentValue.name;
    this.isVisible = this.orderStatusInfo.ableActualChange;
    this.doneAfterBroughtHimself = this.checkStatusDoneAfterBroughtHimself(prevStatus, curStatus);
    console.log(this.doneAfterBroughtHimself);
  }

  ngOnInit(): void {
    this.resetBagsInfo();
    this.orderDetails = JSON.parse(JSON.stringify(this.orderDetailsOriginal));
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
    this.checkAmountOfBigBags();
    this.bagsInfo.finalSum = {
      planned: this.bagsInfo.sum.planned - bonusesAndCert,
      confirmed: this.bagsInfo.sum.confirmed - bonusesAndCert,
      actual: this.bagsInfo.sum.actual - bonusesAndCert + (this.showUbsCourier ? this.courierPricePerPackage : 0)
    };
    for (const type in this.bagsInfo.finalSum) {
      if (this.bagsInfo.finalSum[type] < 0) {
        this.bagsInfo.finalSum[type] = 0;
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
        this.bagsInfo.sum[bagType] = this.bagsInfo.amount[bagType] = 0;
        this.orderDetails.bags.forEach((bagObj) => {
          this.bagsInfo.sum[bagType] += bagObj[bagType] * bagObj.price;
          this.bagsInfo.amount[bagType] += +bagObj[bagType];
        });
        this.calculateFinalSum();
      }
    });
  }

  private checkStatusDoneAfterBroughtHimself(prevStatus, currentStatus) {
    return prevStatus === 'BROUGHT_IT_HIMSELF' && currentStatus === 'DONE';
  }

  private checkAmountOfBigBags() {
    let amountOfBigBags = 0;
    const type = this.orderStatusInfo.ableActualChange ? 'actual' : 'confirmed';
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
}
