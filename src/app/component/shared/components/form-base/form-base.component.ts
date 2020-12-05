import { Component, HostListener } from '@angular/core';
import { ComponentCanDeactivate } from '@global-service/pending-changes-guard/pending-changes.guard';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { WarningPopUpComponent } from '@shared/components';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-form-base',
  templateUrl: './form-base.component.html'
})
export class FormBaseComponent implements ComponentCanDeactivate {

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
  public getFormValues(): any { }

  constructor(public router: Router,
              public dialog: MatDialog) {
  }

  @HostListener('window:beforeunload')

  canDeactivate(): boolean | Observable<boolean> {
    return this.areChangesSaved ? true : !this.checkChanges();
  }

  public cancel(): void {
    if (this.checkChanges()) {
      const matDialogRef = this.dialog.open(WarningPopUpComponent, this.popupConfig);

      const dialogSub = matDialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.areChangesSaved = true;
          this.router.navigate([this.previousPath]);
        }
        dialogSub.unsubscribe();
      });
    } else {
      this.areChangesSaved = true;
      this.router.navigate([this.previousPath]);
    }
  }

  public checkChanges(): boolean {
    const body = this.getFormValues();
    for (const key of Object.keys(body)) {
      if (Array.isArray(body[key])) {
        if (body[key].some((item, index) => item !== this.initialValues[key][index])) {
          return true;
        }
      } else {
        if (body[key] !== this.initialValues[key]) {
          return true;
        }
      }
    }
    return false;
  }
}
