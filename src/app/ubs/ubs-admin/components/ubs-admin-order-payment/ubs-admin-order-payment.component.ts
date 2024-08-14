import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ChangingOrderPaymentStatus } from 'src/app/store/actions/bigOrderTable.actions';
import { IPaymentInfoDto, IOrderInfo, PaymentDetails, orderPaymentInfo } from '../../models/ubs-admin.interface';
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
  @Input() orderId: number;
  @Input() orderStatus: string;
  @Input() isEmployeeCanEditOrder: boolean;
  @Input() paymentInfo: orderPaymentInfo;
  @Output() newPaymentStatus = new EventEmitter<string>();
  @Output() isReturnMoneyChange = new EventEmitter<boolean>();
  @Output() isReturnBonusesChange = new EventEmitter<boolean>();
  @Output() paymentInfoChanged = new EventEmitter<orderPaymentInfo>();
  actualPrice: number;
  isStatusForReturnMoneyOrPaid: boolean;
  pageOpen: boolean;
  overpayment: number;
  paidAmount: number;
  unPaidAmount: number;
  paymentsArray: IPaymentInfoDto[];
  paymentsIdArray: string[] = [];
  currentOrderStatus: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
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
    this.setDateInPaymentArray();
    this.positivePaymentsArrayAmount();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.paymentInfo) {
      this.paymentInfo = { ...changes.paymentInfo.currentValue };
      this.overpayment = this.paymentInfo.paymentTableInfoDto.overpayment;
      this.paymentsArray = this.paymentInfo.paymentTableInfoDto.paymentInfoDtos;
      this.paidAmount = this.paymentInfo.paymentTableInfoDto.paidAmount;
      this.unPaidAmount = this.paymentInfo.paymentTableInfoDto.unPaidAmount;
      this.actualPrice = this.paymentInfo.orderFullPrice;
      console.log(this.overpayment, this.paymentInfo.paymentTableInfoDto);
    }

    if (changes.orderStatus) {
      this.currentOrderStatus = changes.orderStatus.currentValue;
      this.isStatusForReturnMoneyOrPaid =
        this.currentOrderStatus === OrderStatus.CANCELED ||
        this.currentOrderStatus === OrderStatus.DONE ||
        this.currentOrderStatus === OrderStatus.BROUGHT_IT_HIMSELF;
      if (this.currentOrderStatus === OrderStatus.CANCELED) {
        this.overpayment = this.paidAmount;
      }
    }
  }

  formatDate(date: string): string {
    return date.split('-').reverse().join('.');
  }

  positivePaymentsArrayAmount(): void {
    this.paymentsArray.forEach((payment: IPaymentInfoDto) => {
      payment.amount = Math.abs(payment.amount);
    });
  }

  setDateInPaymentArray(): void {
    this.paymentsArray.forEach((payment: IPaymentInfoDto) => {
      payment.settlementdate = this.formatDate(payment.settlementdate);
    });
  }

  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  isOverpaymentReturnAvailable(): boolean {
    return this.overpayment && this.isStatusForReturnMoneyOrPaid;
  }

  setOverpayment(overpayment: number): void {
    this.overpayment = Math.abs(overpayment);
  }

  getStringDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
  }

  displayUnpaidAmount(): boolean {
    return this.unPaidAmount && this.currentOrderStatus !== OrderStatus.CANCELED;
  }

  enrollToBonusAccount(): void {
    const currentDate: string = this.getStringDate(new Date());
    const paymentDetails: IPaymentInfoDto = {
      id: null,
      comment: null,
      settlementdate: currentDate,
      amount: this.overpayment,
      paymentId: null,
      receiptLink: 'Enrollment to the bonus account',
      currentDate: currentDate
    };
    this.isReturnBonusesChange.emit(true);
    this.paymentsArray.push(paymentDetails);
    this.paymentInfoChanged.emit({
      ...this.paymentInfo,
      paymentTableInfoDto: {
        overpayment: 0,
        paymentInfoDtos: [...this.paymentsArray],
        paidAmount: this.paidAmount - this.overpayment,
        unPaidAmount: 0
      }
    });
  }

  returnMoney(): void {
    this.dialog
      .open(DialogPopUpComponent, {
        data: this.returnMoneyDialogDate,
        hasBackdrop: true,
        closeOnNavigation: true,
        disableClose: true,
        panelClass: ''
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          const currentDate: string = this.getStringDate(new Date());
          const paymentDetails: IPaymentInfoDto = {
            id: null,
            comment: null,
            settlementdate: currentDate,
            amount: this.overpayment,
            paymentId: null,
            receiptLink: 'Enrollment to the bonus account',
            currentDate: currentDate
          };
          this.isReturnMoneyChange.emit(true);
          this.paymentsArray.push(paymentDetails);
          this.paymentInfoChanged.emit({
            ...this.paymentInfo,
            paymentTableInfoDto: {
              overpayment: 0,
              paymentInfoDtos: [...this.paymentsArray],
              paidAmount: this.paidAmount - this.overpayment,
              unPaidAmount: 0
            }
          });
        }
      });
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
          orderId: this.orderId,
          viewMode,
          payment: viewMode ? this.paymentsArray[paymentIndex] : null,
          isCanPaymentEdit: this.isOrderCanBePaid
        }
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.orderService
          .getOrderInfo(this.orderId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: IOrderInfo) => {
            this.paymentInfoChanged.emit({ orderFullPrice: data.orderFullPrice, paymentTableInfoDto: data.paymentTableInfoDto });
            const newValue = data.generalOrderInfo.orderPaymentStatus;
            this.postDataItem(this.orderId, newValue);
            this.newPaymentStatus.emit(newValue);
          });
      });
  }

  get isOrderCanBePaid(): boolean {
    return !this.isStatusForReturnMoneyOrPaid && this.isEmployeeCanEditOrder;
  }

  get returnToBonusAccount(): string {
    return PaymentEnrollment.receiptLink;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
