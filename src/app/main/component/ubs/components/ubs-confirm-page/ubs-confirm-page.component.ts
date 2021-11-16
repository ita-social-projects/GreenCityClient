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
      const isAdmin = userRole === 'ROLE_ADMIN';
      this.saveDataOnLocalStorage();
      this.router.navigate([isAdmin ? 'ubs-admin' : 'ubs-user', 'orders']);
    });
  }

  ngOnInit() {
    this.ubsOrderFormService.orderId.pipe(takeUntil(this.destroy$)).subscribe((oderID) => {
      if (oderID) {
        this.orderId = oderID;
        this.orderResponseError = this.ubsOrderFormService.getOrderResponseErrorStatus();
        this.orderStatusDone = this.ubsOrderFormService.getOrderStatus();
        this.renderView();
      } else {
        this.orderService
          .getUbsOrderStatus()
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (response) => {
              this.orderResponseError = response.result === 'error' ? true : false;
              this.orderStatusDone = this.orderResponseError ? false : true;
              this.orderId = response.order_id ? response.order_id.split('_')[0] : this.localStorageService.getUbsOrderId();
              this.renderView();
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

  renderView(): void {
    this.isSpinner = false;
    if (!this.orderResponseError && !this.orderStatusDone) {
      this.saveDataOnLocalStorage();
      this.snackBar.openSnackBar('successConfirmSaveOrder', this.orderId);
    } else if (!this.orderResponseError && this.orderStatusDone) {
      this.saveDataOnLocalStorage();
    }
  }

  saveDataOnLocalStorage(): void {
    this.shareFormService.isDataSaved = true;
    this.localStorageService.removeUbsOrderId();
    this.shareFormService.saveDataOnLocalStorage();
  }

  returnToPayment(): void {
    this.router.navigateByUrl('/ubs/order');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
