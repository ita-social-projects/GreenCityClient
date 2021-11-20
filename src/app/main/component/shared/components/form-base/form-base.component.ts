import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ComponentCanDeactivate } from '@global-service/pending-changes-guard/pending-changes.guard';
import { Router } from '@angular/router';
import { WarningPopUpComponent } from '@shared/components';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../../ubs/services/order.service';
import { UBSOrderFormService } from '../../../ubs/services/ubs-order-form.service';

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

  public getFormValues(): any {
    // TODO: add functionality to this method
  }

  constructor(
    public router: Router,
    public dialog: MatDialog,
    public orderService?: OrderService,
    public ubsOrderFormService?: UBSOrderFormService
  ) {}

  @HostListener('window:beforeunload')
  canDeactivate(): boolean | Observable<boolean> {
    return this.areChangesSaved ? true : !this.checkChanges();
  }

  public cancel(): void {
    this.cancelPopupJustifying(true);
    localStorage.removeItem('newsTags');
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
          if (confirm) {
            const currentUrl = this.router.url;
            const isUBS = currentUrl.includes('ubs/order');
            if (isUBS) {
              this.orderService.changeShouldBePaid(false);
              this.orderService.getOrderUrl().subscribe(
                (response) => {
                  const { orderId } = JSON.parse(response);
                  this.ubsOrderFormService.transferOrderId(orderId);
                  this.ubsOrderFormService.setOrderResponseErrorStatus(orderId ? false : true);
                  this.areChangesSaved = true;
                  this.router.navigate(['ubs', 'confirm']);
                },
                () => {
                  this.orderService.changeShouldBePaid(true);
                }
              );
            } else {
              this.areChangesSaved = true;
              this.router.navigate([this.previousPath]);
            }
          } else if (isUbsOrderSubmit) {
            this.cancelUBSwithoutSaving();
          }
        });
      return;
    }
    this.areChangesSaved = true;
    this.router.navigate([this.previousPath]);
  }
}
