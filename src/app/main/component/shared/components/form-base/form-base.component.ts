import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ComponentCanDeactivate } from '@global-service/pending-changes-guard/pending-changes.guard';
import { Router } from '@angular/router';
import { WarningPopUpComponent } from '@shared/components';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../../../../ubs/ubs/services/order.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';

@Component({
  selector: 'app-form-base',
  templateUrl: './form-base.component.html'
})
export class FormBaseComponent implements ComponentCanDeactivate {
  @ViewChild('formEditProf') formEditProf: ElementRef;

  public areChangesSaved = false;
  public initialValues = {};
  public previousPath = '';
  public popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: '',
    data: {
      popupTitle: '',
      popupSubtitle: '',
      popupConfirm: '',
      popupCancel: ''
    }
  };
  public habitId: number;

  public getFormValues(): any {
    // TODO: add functionality to this method
  }

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public orderService?: OrderService,
    public habitAssignService?: HabitAssignService
  ) {}

  @HostListener('window:beforeunload')
  canDeactivate(): boolean | Observable<boolean> {
    return this.areChangesSaved ? true : !this.checkChanges();
  }

  public cancel(): void {
    this.cancelPopupJustifying(true);
    localStorage.removeItem('newsTags');
  }

  public cancelHabit(id: number): void {
    this.habitId = id;
    this.cancelPopupJustifying(true);
  }

  public checkChanges(): boolean {
    const body = this.getFormValues();
    for (const key of Object.keys(body)) {
      if (JSON.stringify(body[key]) !== JSON.stringify(this.initialValues[key]) && this.initialValues[key] !== undefined) {
        return true;
      }
    }
  }

  cancelUBSwithoutSaving(): void {
    this.orderService.cancelUBSwithoutSaving();
    this.router.navigateByUrl('/ubs');
  }

  cancelUBS(isUbsOrderSubmit?: boolean): void {
    const condition = this.getFormValues();
    this.cancelPopupJustifying(condition, isUbsOrderSubmit);
  }

  private cancelPopupJustifying(condition: boolean, isUbsOrderSubmit?: boolean) {
    if (condition) {
      const matDialogRef = this.dialog.open(WarningPopUpComponent, this.popupConfig);

      matDialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((confirm) => {
          const currentUrl = this.router.url;
          const isUBS = currentUrl.includes('ubs/order');

          if (confirm) {
            this.areChangesSaved = true;
          }
          if (confirm && isUbsOrderSubmit) {
            this.router.navigate(['ubs', 'confirm']);
          }
          if (confirm && !isUbsOrderSubmit && isUBS) {
            this.cancelUBSwithoutSaving();
          }
          if (confirm && !isUbsOrderSubmit && !isUBS) {
            this.router.navigate([this.previousPath]);
          }
          if (confirm === null && isUbsOrderSubmit) {
            this.cancelUBSwithoutSaving();
          }
          if (confirm && this.habitId) {
            this.habitAssignService.deleteHabitById(this.habitId);
          }
        });
      return;
    }
    this.areChangesSaved = true;
    this.router.navigate([this.previousPath]);
  }
}
