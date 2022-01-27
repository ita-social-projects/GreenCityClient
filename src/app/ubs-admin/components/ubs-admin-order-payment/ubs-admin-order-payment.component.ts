import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { IPaymentInfo, IPaymentInfoDtos, IOrderInfo } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { AddPaymentComponent } from '../add-payment/add-payment.component';

@Component({
  selector: 'app-ubs-admin-order-payment',
  templateUrl: './ubs-admin-order-payment.component.html',
  styleUrls: ['./ubs-admin-order-payment.component.scss']
})
export class UbsAdminOrderPaymentComponent implements OnInit, OnChanges {
  message: string;
  pageOpen: boolean;
  @Input() overpayment: number;
  @Input() orderInfo: IOrderInfo;
  @Input() actualPrice: number;
  @Input() totalPaid: number;
  totalPaidWithoutBonus: number;
  orderId: number;
  paidAmount: number;
  unPaidAmount: number;
  paymentInfo: IPaymentInfo;
  paymentsArray: IPaymentInfoDtos[];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit() {
    this.orderId = this.orderInfo.generalOrderInfo.id;
    this.paymentInfo = this.orderInfo.paymentTableInfoDto;
    this.paymentsArray = this.orderInfo.paymentTableInfoDto.paymentInfoDtos;
    this.paidAmount = this.paymentInfo.paidAmount;
    this.unPaidAmount = this.paymentInfo.unPaidAmount;
    this.totalPaidWithoutBonus = this.orderInfo.orderCertificateTotalDiscount;
    this.totalPaidWithoutBonus += this.orderInfo.paymentTableInfoDto.paidAmount;
  }

  constructor(private orderService: OrderService, private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.overpayment) {
      this.message = this.orderService.getOverpaymentMsg(this.overpayment);
      this.overpayment = Math.abs(this.overpayment);
    }
  }

  openDetails() {
    this.pageOpen = !this.pageOpen;
  }

  public addPayment(orderId, postData): void {
    this.orderService
      .addPaymentManually(orderId, postData.form, postData.file)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  openPopup() {
    this.dialog
      .open(AddPaymentComponent, {
        hasBackdrop: true,
        panelClass: 'custom-dialog-container',
        data: this.orderInfo.generalOrderInfo.id
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.addPayment(this.orderId, res);
        }
      });
  }
}
