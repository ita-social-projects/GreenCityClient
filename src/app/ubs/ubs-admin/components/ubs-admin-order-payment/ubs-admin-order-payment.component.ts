import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { IPaymentInfo, IPaymentInfoDto, IOrderInfo, PaymentDetails } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { AddPaymentComponent } from '../add-payment/add-payment.component';

@Component({
  selector: 'app-ubs-admin-order-payment',
  templateUrl: './ubs-admin-order-payment.component.html',
  styleUrls: ['./ubs-admin-order-payment.component.scss']
})
export class UbsAdminOrderPaymentComponent implements OnInit, OnChanges {
  @Input() orderInfo: IOrderInfo;
  @Input() actualPrice: number;
  @Input() totalPaid: number;

  public message: string;
  public pageOpen: boolean;
  public orderId: number;
  public overpayment: number;
  public paidAmount: number;
  public unPaidAmount: number;
  public paymentInfo: IPaymentInfo;
  public paymentsArray: IPaymentInfoDto[];

  constructor(private orderService: OrderService, private dialog: MatDialog) {}

  ngOnInit() {
    this.orderId = this.orderInfo.generalOrderInfo.id;
    this.paymentInfo = this.orderInfo.paymentTableInfoDto;
    this.overpayment = this.paymentInfo.overpayment;
    this.paymentsArray = this.paymentInfo.paymentInfoDtos;
    this.paidAmount = this.paymentInfo.paidAmount;
    this.unPaidAmount = this.paymentInfo.unPaidAmount;
    this.setDateInPaymentArray(this.paymentsArray);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.overpayment) {
      this.message = this.orderService.getOverpaymentMsg(this.overpayment);
      this.overpayment = Math.abs(this.overpayment);
    }
  }

  public formatDate(date: string): string {
    return date.split('-').reverse().join('.');
  }

  public setDateInPaymentArray(paymentsArray: IPaymentInfoDto[]) {
    for (const payment of paymentsArray) {
      payment.settlementdate = this.formatDate(payment.settlementdate);
    }
  }

  public openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  public setOverpayment(overpayment: number): void {
    this.message = this.orderService.getOverpaymentMsg(overpayment);
    this.overpayment = Math.abs(overpayment);
  }

  public addZeroBeforeSingleDateValue(date: Date): string {
    let resultDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (date.getMonth() + 1 < 10 && date.getDate() < 10) {
      resultDate = `${date.getFullYear()}-0${date.getMonth() + 1}-0${date.getDate()}`;
    } else {
      if (date.getMonth() + 1 < 10) {
        resultDate = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
      }
      if (date.getDate() < 10) {
        resultDate = `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`;
      }
    }
    return resultDate;
  }

  public enrollToBonusAccount(): void {
    const currentDate: string = this.addZeroBeforeSingleDateValue(new Date());

    const paymentDetails: PaymentDetails = {
      amount: this.overpayment * 100,
      receiptLink: 'Зарахування на бонусний рахунок',
      settlementdate: currentDate
    };

    this.orderService.addPaymentManually(this.orderId, paymentDetails).subscribe((responce: IPaymentInfoDto) => {
      responce.amount /= 100;
      responce.settlementdate = this.formatDate(responce.settlementdate);
      this.paymentsArray.push(responce);
      this.totalPaid -= this.overpayment;
      this.overpayment = 0;
    });
  }

  public openPopup(viewMode: boolean, paymentIndex?: number): void {
    this.dialog
      .open(AddPaymentComponent, {
        hasBackdrop: true,
        panelClass: 'custom-dialog-container',
        data: {
          orderId: this.orderInfo.generalOrderInfo.id,
          viewMode,
          payment: viewMode ? this.paymentsArray[paymentIndex] : null
        }
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res: IPaymentInfoDto | number | null) => {
        if (typeof res === 'number') {
          this.paymentsArray = this.paymentsArray.filter((payment) => {
            if (payment.id === res) {
              this.totalPaid -= payment.amount;
              this.setOverpayment(this.totalPaid - this.actualPrice);
            }
            return payment.id !== res;
          });
        } else if (res !== null && typeof res === 'object') {
          const checkPaymentId = (): number => {
            return this.paymentsArray.filter((payment: IPaymentInfoDto) => payment.id === res.id).length;
          };

          res.settlementdate = this.formatDate(res.settlementdate);

          if (checkPaymentId()) {
            this.paymentsArray = this.paymentsArray.map((payment) => {
              if (payment.id === res.id) {
                this.totalPaid = this.totalPaid - payment.amount + res.amount;
                return res;
              }
              return payment;
            });
          } else {
            this.totalPaid += res.amount;
            this.paymentsArray = [...this.paymentsArray, res];
          }
          this.setOverpayment(this.totalPaid - this.actualPrice);
        }
      });
  }
}
