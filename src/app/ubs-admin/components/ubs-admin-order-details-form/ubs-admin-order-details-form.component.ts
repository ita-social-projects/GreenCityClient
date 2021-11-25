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
  public ubsCourier = 0;
  public bagsInfo;
  public currentLanguage: string;
  public minOrderSum = 500;
  public orderDetails;
  pageOpen: boolean;
  @Input() orderDetailsOriginal;
  @Input() orderDetailsForm: FormGroup;
  @Input() orderStatusInfo;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // const prevStatus = changes.orderStatusInfo?.previousValue;
    this.isVisible = this.orderStatusInfo.ableActualChange;
    this.doneAfterBroughtHimself = this.checkStatusDoneAfterBroughtHimself();
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
    this.bagsInfo.finalSum = {
      planned: this.bagsInfo.sum.planned - bonusesAndCert,
      confirmed: this.bagsInfo.sum.confirmed - bonusesAndCert,
      actual: this.bagsInfo.sum.actual - bonusesAndCert
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

  private checkStatusDoneAfterBroughtHimself() {
    return this.orderDetails?.previousOrderStatus === 'BROUGHT_IT_HIMSELF' && this.orderStatusInfo.name === 'DONE';
  }
}
