import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';

@Component({
  selector: 'app-ubs-confirm-page',
  templateUrl: './ubs-confirm-page.component.html',
  styleUrls: ['./ubs-confirm-page.component.scss']
})
export class UbsConfirmPageComponent implements OnInit, OnDestroy {
  orderId: string;
  orderResponseError = false;
  orderStatusDone: boolean;
  isSpinner = true;
  pageReloaded = false;
  orderPaymentError = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private snackBar: MatSnackBarComponent,
    private jwtService: JwtService,
    private ubsOrderFormService: UBSOrderFormService,
    private shareFormService: UBSOrderFormService,
    private localStorageService: LocalStorageService,
    private orderService: OrderService,
    public router: Router
  ) {}

  toPersonalAccount(): void {
    this.jwtService.userRole$.pipe(takeUntil(this.destroy$)).subscribe((userRole) => {
      const isAdmin = userRole === 'ROLE_UBS_EMPLOYEE';
      this.saveDataOnLocalStorage();
      this.localStorageService.clearPaymentInfo();
      this.router.navigate([isAdmin ? 'ubs-admin' : 'ubs-user', 'orders']);
    });
  }

  ngOnInit() {
    this.ubsOrderFormService.orderId.pipe(takeUntil(this.destroy$)).subscribe((oderID) => {
      if (!oderID && this.localStorageService.getUbsOrderId()) {
        oderID = this.localStorageService.getUbsOrderId();
        this.pageReloaded = true;
      }
      if (oderID) {
        this.orderId = oderID;
        this.checkPaymentStatus();
        this.orderResponseError = !this.pageReloaded ? this.ubsOrderFormService.getOrderResponseErrorStatus() : !this.pageReloaded;
        this.orderStatusDone = !this.pageReloaded ? this.ubsOrderFormService.getOrderStatus() : this.pageReloaded;
        this.renderView();
      } else {
        this.orderService
          .getUbsOrderStatus()
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (response) => {
              this.orderResponseError = response?.result === 'error' ? true : false;
              this.orderStatusDone = !this.orderResponseError;
              this.orderId = response.order_id ? response.order_id.split('_')[0] : this.localStorageService.getUbsFondyOrderId();
              this.renderView();
              this.isSpinner = false;
            },
            (error) => {
              this.orderResponseError = true;
              this.isSpinner = false;
              console.log(error);
            }
          );
      }
    });
  }

  private checkPaymentStatus(): void {
    this.orderService
      .getUbsOrderStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.orderPaymentError = response?.code === 'payment_not_found';
        this.isSpinner = false;
      });
  }

  public isUserPageOrderPayment(): boolean {
    return this.localStorageService.getUserPagePayment() === 'true' || this.pageReloaded;
  }

  renderView(): void {
    if (!this.orderResponseError && !this.orderStatusDone) {
      this.saveDataOnLocalStorage();
      this.snackBar.openSnackBar('successConfirmSaveOrder', this.orderId);
    } else if (!this.orderResponseError && this.orderStatusDone) {
      this.saveDataOnLocalStorage();
    }
  }

  saveDataOnLocalStorage(): void {
    this.shareFormService.isDataSaved = true;
    this.shareFormService.saveDataOnLocalStorage();
  }

  returnToPayment(url: string): void {
    this.router.navigateByUrl(url);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.localStorageService.clearPaymentInfo();
  }
}
