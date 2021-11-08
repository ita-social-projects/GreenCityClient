import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';

@Component({
  selector: 'app-ubs-confirm-page',
  templateUrl: './ubs-confirm-page.component.html',
  styleUrls: ['./ubs-confirm-page.component.scss']
})
export class UbsConfirmPageComponent implements OnInit, OnDestroy {
  orderId: string;
  responseStatus: string;
  orderResponseError = false;
  orderStatusDone: boolean;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBarComponent,
    private jwtService: JwtService,
    private ubsOrderFormService: UBSOrderFormService,
    private shareFormService: UBSOrderFormService,
    private localStorageService: LocalStorageService,
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
        this.ubsOrderFormService
          .getUbsOrderStatus()
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (response) => {
              console.log(response);
              // this.orderResponseError = ...
              // this.orderStatusDone = ...
              this.renderView();
            },
            (error) => {
              this.orderResponseError = true;
              console.log(error);
            }
          );
      }
    });
  }

  renderView(): void {
    // this.ubsOrderFormService.orderId.pipe(takeUntil(this.destroy$)).subscribe((oderID) => {
    //   this.orderId = oderID;
    //   this.orderResponseError = this.orderId ? this.ubsOrderFormService.getOrderResponseErrorStatus() : true;
    //   this.orderStatusDone = this.ubsOrderFormService.getOrderStatus();
    if (!this.orderResponseError && !this.orderStatusDone) {
      this.saveDataOnLocalStorage();
      this.activatedRoute.queryParams.subscribe((params) => {
        this.orderId = params.order_id;
        // Hardcoded. Need a logic from back-end to save orderId for saved unpaid order
        this.responseStatus = params.response_status;
        this.snackBar.openSnackBar('successConfirmSaveOrder', this.orderId);
      });
    } else if (!this.orderResponseError && this.orderStatusDone) {
      this.saveDataOnLocalStorage();
    }
    // });
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
