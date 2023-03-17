import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { AddViolationsComponent } from '../add-violations/add-violations.component';
import { IUserInfo, IOrderInfo } from '../../models/ubs-admin.interface';
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

  @Input() orderInfo: IOrderInfo;

  phoneMask = Masks.phoneMask;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  isStatus = false;
  public userViolationForCurrentOrder: number;
  public totalUserViolations: number;

  constructor(private dialog: MatDialog) {}

  get recipientEmail() {
    return this.userInfoDto.get('recipientEmail');
  }

  ngOnInit(): void {
    this.pageOpen = true;
    this.setViolationData();
    this.onDefineOrderStatus();
  }

  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  public setViolationData(): void {
    this.totalUserViolations = this.userInfo.totalUserViolations;
    this.userViolationForCurrentOrder = this.userInfo.userViolationForCurrentOrder;
  }

  public onDefineOrderStatus() {
    if (this.orderInfo?.generalOrderInfo.orderStatus === 'CANCELED') {
      this.isStatus = true;
    }
  }

  openModal(viewMode: boolean): void {
    const matDialogRef = this.dialog.open(AddViolationsComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'admin-cabinet-dialog-container',
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

  getErrorMessage(abstractControl: AbstractControl, name?: string): string {
    if (abstractControl.errors.required) {
      return 'input-error.required';
    }

    if (abstractControl.errors.maxlength) {
      return 'input-error.max-length';
    }

    if (abstractControl.errors.pattern && !name) {
      return 'input-error.pattern';
    }

    if (abstractControl.errors.pattern && name === 'recipientPhoneNumber') {
      return 'input-error.number-format';
    }

    if (abstractControl.errors.wrongNumber) {
      return 'input-error.number-wrong';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
