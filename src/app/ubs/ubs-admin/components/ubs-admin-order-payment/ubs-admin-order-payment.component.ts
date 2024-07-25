import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ChangingOrderPaymentStatus } from 'src/app/store/actions/bigOrderTable.actions';
import { IPaymentInfo, IPaymentInfoDto, IOrderInfo, PaymentDetails } from '../../models/ubs-admin.interface';
import { OrderService } from '../../services/order.service';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';
import { OrderStatus, PaymentEnrollment } from 'src/app/ubs/ubs/order-status.enum';
import { DialogPopUpComponent } from 'src/app/shared/dialog-pop-up/dialog-pop-up.component';
import { PopUpsStyles } from '../ubs-admin-employee/ubs-admin-employee-table/employee-models.enum';

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
  @Input() isEmployeeCanEditOrder: boolean;

  @Output() newPaymentStatus = new EventEmitter<string>();
  @Output() paymentUpdate = new EventEmitter<number>();
  @Output() paymentToBonusAccount = new EventEmitter<number>();

  message: string;
  pageOpen: boolean;
  orderId: number;
  overpayment: number;
  paidAmount: number;
  displayOverpayment: number;
  unPaidAmount: number;
  paymentInfo: IPaymentInfo;
  paymentsArray: IPaymentInfoDto[];
  paymentsIdArray: string[] = [];
  currentOrderStatus: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  isMoneyReturning = false;
  isRefundApplicationCreate = false;
  private returnMoneyDialogDate = {
    popupTitle: 'return-payment.message',
    popupConfirm: 'employees.btn.yes',
    popupCancel: 'employees.btn.no',
    style: PopUpsStyles.green
  };

  private refundApplicationDialogDate = {
    popupTitle: 'return-payment.accept-refund-application',
    popupConfirm: 'employees.btn.yes',
    popupCancel: 'employees.btn.no',
    style: PopUpsStyles.green,
    isItrefund: true,
    іsPermissionConfirm: true
  };

  private refundApplicationErrorDialogDate = {
    popupTitle: 'return-payment.error-refund-application',
    popupConfirm: 'employees.btn.yes',
    popupCancel: 'employees.btn.no',
    style: PopUpsStyles.green,
    isItrefund: true,
    іsPermissionConfirm: true
  };

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.orderService.overpayment$.subscribe((overpayment) => {
      this.overpayment = this.currentOrderStatus === OrderStatus.CANCELED ? this.paymentInfo.paidAmount : overpayment;
      this.updateUnpaidAmount();
      console.log('overpayment change', overpayment, this.overpayment);
    });
    this.currentOrderStatus = this.orderStatus;
    this.orderId = this.orderInfo.generalOrderInfo.id;
    this.paymentInfo = this.orderInfo.paymentTableInfoDto;
    this.paymentsArray = this.paymentInfo.paymentInfoDtos;
    this.paidAmount = this.paymentInfo.paidAmount;
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
      if (this.currentOrderStatus === OrderStatus.CANCELED) {
        this.overpayment = this.totalPaid;
      }
    }
  }

  updateUnpaidAmount() {
    const sumDiscount = this.orderInfo.orderBonusDiscount + this.orderInfo.orderCertificateTotalDiscount;
    const notPaid = this.orderInfo.orderFullPrice - this.orderInfo.paymentTableInfoDto.paidAmount - sumDiscount;
    if (this.paidAmount) {
      this.unPaidAmount = notPaid !== 0 ? notPaid : 0;
    } else {
      this.unPaidAmount = notPaid;
    }
    this.message = this.orderService.getOverpaymentMsg(this.overpayment);
    this.displayOverpayment = Math.abs(this.overpayment);
    console.log(this.displayOverpayment);
  }

  formatDate(date: string): string {
    return date.split('-').reverse().join('.');
  }

  positivePaymentsArrayAmount(): void {
    this.paymentsArray.forEach((payment: IPaymentInfoDto) => {
      payment.amount = Math.abs(payment.amount);
    });
  }

  setDateInPaymentArray(paymentsArray: IPaymentInfoDto[]): void {
    paymentsArray.forEach((payment: IPaymentInfoDto) => {
      payment.settlementdate = this.formatDate(payment.settlementdate);
    });
  }

  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  isOverpaymentReturnAvailable(): boolean {
    return this.overpayment && this.currentOrderStatus === OrderStatus.CANCELED;
  }

  setOverpayment(overpayment: number): void {
    this.message = this.orderService.getOverpaymentMsg(overpayment);
    this.overpayment = Math.abs(overpayment);
  }

  getStringDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
  }

  displayUnpaidAmount(): boolean {
    console.log(this.displayOverpayment, this.currentOrderStatus !== OrderStatus.CANCELED);
    return this.displayOverpayment && this.currentOrderStatus !== OrderStatus.CANCELED;
  }

  setCancelOrderOverpayment(sum: number): void {
    this.overpayment = sum;
  }

  enrollToBonusAccount(sum: number): void {
    const currentDate: string = this.getStringDate(new Date());
    const paymentDetails: PaymentDetails = {
      amount: sum,
      receiptLink: 'Enrollment to the bonus account',
      settlementdate: currentDate
    };

    this.orderService.addPaymentBonuses(this.orderId, paymentDetails).subscribe((responce: IPaymentInfoDto) => {
      responce.settlementdate = this.formatDate(responce.settlementdate);
      this.paymentsArray.push(responce);
      this.totalPaid -= this.overpayment;
      this.overpayment = 0;
      this.paymentUpdate.emit(this.overpayment);
      this.paymentToBonusAccount.emit(responce.amount);
    });
  }

  returnMoney(id: number): void {
    const matDialogRef = this.dialog.open(DialogPopUpComponent, {
      data: this.returnMoneyDialogDate,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: ''
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.orderService.saveOrderIdForRefund(id).subscribe((response) => {
            if (response.status === 201) {
              this.isMoneyReturning = true;
              this.isRefundApplicationCreate = true;
            }
            this.dialog.open(DialogPopUpComponent, {
              data: this.isRefundApplicationCreate ? this.refundApplicationDialogDate : this.refundApplicationErrorDialogDate,
              hasBackdrop: true,
              closeOnNavigation: true,
              disableClose: true,
              panelClass: ''
            });
          });
        }
      });
  }

  recountUnpaidAmount(value: number): void {
    this.unPaidAmount -= value;
    if (this.unPaidAmount < 0) {
      this.unPaidAmount = 0;
    }
  }

  preconditionChangePaymentData(extraPayment: IPaymentInfoDto): void {
    const checkPaymentId = (): number => this.paymentsArray.filter((payment: IPaymentInfoDto) => payment.id === extraPayment.id).length;

    this.recountUnpaidAmount(extraPayment.amount);
    extraPayment.settlementdate = this.formatDate(extraPayment.settlementdate);
    console.log('CHANGES', this.unPaidAmount);

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

  openPopup(viewMode: boolean, paymentIndex?: number): void {
    this.dialog
      .open(AddPaymentComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        disableClose: false,
        panelClass: 'custom-dialog-container',
        height: '100%',
        data: {
          orderId: this.orderInfo.generalOrderInfo.id,
          viewMode,
          payment: viewMode ? this.paymentsArray[paymentIndex] : null,
          isCanPaymentEdit: this.isOrderCanBePaid
        }
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((extraPayment: IPaymentInfoDto | number | null) => {
        if (typeof extraPayment === 'number') {
          this.recountUnpaidAmount(extraPayment);
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
        }
        this.orderService
          .getOrderInfo(this.orderId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: IOrderInfo) => {
            this.paymentUpdate.emit(data.paymentTableInfoDto.paidAmount);
            const newValue = data.generalOrderInfo.orderPaymentStatus;
            this.postDataItem(this.orderId, newValue);
            this.newPaymentStatus.emit(newValue);
          });
      });
  }

  get isOrderCanBePaid(): boolean {
    return this.currentOrderStatus !== OrderStatus.CANCELED && this.isEmployeeCanEditOrder;
  }

  get returnToBonusAccount(): string {
    return PaymentEnrollment.receiptLink;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
