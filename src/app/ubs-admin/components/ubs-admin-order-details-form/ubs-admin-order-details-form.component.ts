import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
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
  public isVisible = true;
  public ubsCourier = 0;
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
  public minOrderSum = 500;
  pageOpen: boolean;
  @Input() orderDetails;
  @Input() orderDetailsForm: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService) {}

  ngOnInit(): void {
    // TODO: change this mock after receiving bags names from backend
    this.orderDetails.bags[0].name = 'Безнадійний одяг';
    this.orderDetails.bags[1].name = 'Безнадійний одяг';
    this.orderDetails.bags[2].name = 'Вторсировина';
    //
    this.orderService
      .getSelectedOrderStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((order) => {
        this.order = order;
        this.isVisible = order.ableActualChange;
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
    this.calculateFinalSum();
  }

  private calculateFinalSum() {
    const bonusesAndCert = this.orderInfo.bonuses + this.orderInfo.certificateDiscount;
    this.orderInfo.finalSum = {
      planned: this.orderInfo.sum.planned - bonusesAndCert,
      confirmed: this.orderInfo.sum.confirmed - bonusesAndCert,
      actual: this.orderInfo.sum.actual - bonusesAndCert
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

  public onQuantityChange(e) {
    let field = e.target.getAttribute('ng-reflect-name');
    const bagId = field.replace(/\D/g, '');
    field = field.replace(/quantity[0-9]/i, '');
    this.orderDetails.bags.forEach((bag) => {
      if (bag.id === Number(bagId)) {
        bag[field] = e.target.value;
        this.orderInfo.sum[field] = this.orderInfo.amount[field] = 0;
        this.orderDetails.bags.forEach((bagObj) => {
          this.orderInfo.sum[field] += bagObj[field] * bagObj.price;
          this.orderInfo.amount[field] += +bagObj[field];
        });
        this.calculateFinalSum();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
