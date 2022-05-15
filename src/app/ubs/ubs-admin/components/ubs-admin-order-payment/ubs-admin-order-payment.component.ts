import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ChangingOrderPaymentStatus } from 'src/app/store/actions/bigOrderTable.actions';
import { IPaymentInfo, IPaymentInfoDto, IOrderInfo, PaymentDetails } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-ubs-admin-order-payment',
  templateUrl: './ubs-admin-order-payment.component.html',
  styleUrls: ['./ubs-admin-order-payment.component.scss']
})
export class UbsAdminOrderPaymentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() orderInfo: IOrderInfo;
  @Input() actualPrice: number;
  @Input() totalPaid: number;
  @Input() orderStatus: string;

  public message: string;
  public pageOpen: boolean;
  public orderId: number;
  public overpayment: number;
  public paidAmount: number;
  public unPaidAmount: number;
  public paymentInfo: IPaymentInfo;
  public paymentsArray: IPaymentInfoDto[];
  public currentOrderStatus: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private orderService: OrderService, private dialog: MatDialog, private store: Store<IAppState>) {}

  ngOnInit() {
    this.currentOrderStatus = this.orderStatus;
    this.orderId = this.orderInfo.generalOrderInfo.id;
    this.paymentInfo = this.orderInfo.paymentTableInfoDto;
    this.overpayment = this.paymentInfo.overpayment;
    this.paymentsArray = this.paymentInfo.paymentInfoDtos;
    this.paidAmount = this.paymentInfo.paidAmount;
    this.unPaidAmount = this.paymentInfo.unPaidAmount;
    this.setDateInPaymentArray(this.paymentsArray);
    this.positivePaymentsArrayAmount();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.overpayment) {
      this.message = this.orderService.getOverpaymentMsg(this.overpayment);
      this.overpayment = Math.abs(this.overpayment);
    }

    if (changes.orderStatus) {
      this.currentOrderStatus = changes.orderStatus.currentValue;
    }
  }

  public formatDate(date: string): string {
    return date.split('-').reverse().join('.');
  }

  public positivePaymentsArrayAmount(): void {
    this.paymentsArray.forEach((payment: IPaymentInfoDto) => {
      payment.amount = Math.abs(payment.amount);
    });
  }

  public setDateInPaymentArray(paymentsArray: IPaymentInfoDto[]): void {
    paymentsArray.forEach((payment: IPaymentInfoDto) => {
      payment.settlementdate = this.formatDate(payment.settlementdate);
    });
  }

  public openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  public accessOnCanceledStatus(): boolean {
    return this.currentOrderStatus === 'CANCELED';
  }

  public setOverpayment(overpayment: number): void {
    this.message = this.orderService.getOverpaymentMsg(overpayment);
    this.overpayment = Math.abs(overpayment);
  }

  public getStringDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
  }

  public enrollToBonusAccount(): void {
    const currentDate: string = this.getStringDate(new Date());

    const paymentDetails: PaymentDetails = {
      amount: this.overpayment,
      receiptLink: 'Зарахування на бонусний рахунок',
      settlementdate: currentDate
    };

    this.orderService.addPaymentBonuses(this.orderId, paymentDetails).subscribe((responce: IPaymentInfoDto) => {
      responce.settlementdate = this.formatDate(responce.settlementdate);
      this.paymentsArray.push(responce);
      this.totalPaid -= this.overpayment;
      this.overpayment = 0;
    });
  }

  public recountUnpaidAmount(value: number): void {
    this.unPaidAmount -= value;
    if (this.unPaidAmount < 0) {
      this.unPaidAmount = 0;
    }
  }

  public preconditionChangePaymentData(extraPayment: IPaymentInfoDto): void {
    const checkPaymentId = (): number => {
      return this.paymentsArray.filter((payment: IPaymentInfoDto) => payment.id === extraPayment.id).length;
    };

    this.recountUnpaidAmount(extraPayment.amount);
    extraPayment.settlementdate = this.formatDate(extraPayment.settlementdate);

    if (checkPaymentId()) {
      this.paymentsArray = this.paymentsArray.map((payment): IPaymentInfoDto => {
        if (payment.id === extraPayment.id) {
          this.totalPaid = this.totalPaid - payment.amount + extraPayment.amount;
          return extraPayment;
        }
        return payment;
      });
    } else {
      this.totalPaid += extraPayment.amount;
      this.paymentsArray = [...this.paymentsArray, extraPayment];
    }
  }

  private postDataItem(orderId: number, newValue: string): void {
    this.store.dispatch(ChangingOrderPaymentStatus({ orderId, newValue }));
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
      .subscribe((extraPayment: IPaymentInfoDto | number | null) => {
        if (typeof extraPayment === 'number') {
          this.paymentsArray = this.paymentsArray.filter((payment) => {
            if (payment.id === extraPayment) {
              this.totalPaid -= payment.amount;
              this.setOverpayment(this.totalPaid - this.actualPrice);
            }
            return payment.id !== extraPayment;
          });
        }
        if (extraPayment !== null && typeof extraPayment === 'object') {
          this.preconditionChangePaymentData(extraPayment);
          this.setOverpayment(this.totalPaid - this.actualPrice);

          this.orderService
            .getOrderInfo(this.orderId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: IOrderInfo) => {
              const newValue = data.generalOrderInfo.orderPaymentStatus;
              this.postDataItem(this.orderId, newValue);
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
