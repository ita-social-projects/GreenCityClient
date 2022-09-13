import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddViolationsComponent } from '../add-violations/add-violations.component';
import { IUserInfo } from '../../models/ubs-admin.interface';
import { take } from 'rxjs/operators';
import { Masks } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-ubs-admin-order-client-info',
  templateUrl: './ubs-admin-order-client-info.component.html',
  styleUrls: ['./ubs-admin-order-client-info.component.scss']
})
export class UbsAdminOrderClientInfoComponent implements OnInit, OnDestroy {
  @Input() userInfo: IUserInfo;
  @Input() userInfoDto: FormGroup;

  @Input() orderId: number;

  phoneMask = Masks.phoneMask;
  pageOpen: boolean;
  public userViolationForCurrentOrder: number;
  public totalUserViolations: number;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.pageOpen = true;
    this.setViolationData();
  }

  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  public setViolationData(): void {
    this.totalUserViolations = this.userInfo.totalUserViolations;
    this.userViolationForCurrentOrder = this.userInfo.userViolationForCurrentOrder;
  }

  openModal(viewMode: boolean): void {
    const matDialogRef = this.dialog.open(AddViolationsComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        id: this.orderId,
        viewMode
      }
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (typeof res === 'number') {
          this.userViolationForCurrentOrder += res;
          this.totalUserViolations += res;
        }
      });
  }

  getErrorMessage(abstractControl: AbstractControl) {
    if (abstractControl.errors.required) {
      return 'input-error.required';
    }

    if (abstractControl.errors.pattern) {
      return 'input-error.number-length';
    }

    if (abstractControl.errors.maxlength) {
      return 'input-error.max-length';
    }

    if (abstractControl.errors.pattern) {
      return 'input-error.pattern';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
