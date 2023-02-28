import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { OrderService } from '../../../../../ubs/ubs/services/order.service';
import { UBSOrderFormService } from '../../../../../ubs/ubs/services/ubs-order-form.service';

@Component({
  selector: 'app-warning-pop-up',
  templateUrl: './warning-pop-up.component.html',
  styleUrls: ['./warning-pop-up.component.scss', './warning-pop-up-ubs.component.scss']
})
export class WarningPopUpComponent implements OnInit, OnDestroy {
  public popupTitle: string;
  public popupSubtitle: string;
  public popupConfirm: string;
  public popupCancel: string;
  public isLoading = false;
  public isUBS: boolean;
  public isUbsOrderSubmit: boolean;
  public isHabit: boolean;
  public habitName: string;
  public habitId: number;
  public userId: number;
  public closeButton = './assets/img/profile/icons/cancel.svg';
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private matDialogRef: MatDialogRef<WarningPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public orderService: OrderService,
    public ubsOrderFormService: UBSOrderFormService,
    private habitAssignService: HabitAssignService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBarComponent
  ) {}

  ngOnInit() {
    this.setTitles();
    this.matDialogRef
      .keydownEvents()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((event) => {
        if (event.key === 'Escape') {
          this.userReply(false);
        }
        if (event.key === 'Enter') {
          this.userReply(true);
        }
      });
    this.matDialogRef
      .backdropClick()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.userReply(false));
    this.userId = this.localStorageService.getUserId();
  }

  private setTitles(): void {
    this.popupTitle = this.data.popupTitle;
    this.popupSubtitle = this.data.popupSubtitle;
    this.popupConfirm = this.data.popupConfirm;
    this.popupCancel = this.data.popupCancel;
    this.isUBS = this.data.isUBS;
    this.isUbsOrderSubmit = this.data.isUbsOrderSubmit;
    this.isHabit = this.data.isHabit;
    if (this.isHabit) {
      this.habitName = this.data.habitName;
    }
  }

  public userReply(reply: boolean | null): void {
    if (reply) {
      if (this.isUbsOrderSubmit) {
        this.isLoading = true;
        this.orderService.changeShouldBePaid(false);
        this.orderService.getOrderUrl().subscribe(
          (response) => {
            const { orderId } = JSON.parse(response);
            this.ubsOrderFormService.transferOrderId(orderId);
            this.ubsOrderFormService.setOrderResponseErrorStatus(orderId ? false : true);
            this.localStorageService.removeUbsFondyOrderId();
            this.localStorageService.removeUbsLiqPayOrderId();
            this.matDialogRef.close(reply);
            this.isLoading = false;
          },
          () => {
            this.orderService.changeShouldBePaid(true);
            this.isLoading = false;
          }
        );
        return;
      }
      localStorage.removeItem('newsTags');
    }

    this.matDialogRef.close(reply);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
