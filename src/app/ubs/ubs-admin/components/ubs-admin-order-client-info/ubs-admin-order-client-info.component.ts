import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { AddViolationsComponent } from '../add-violations/add-violations.component';
import { IUserInfo } from '../../models/ubs-admin.interface';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { ViewViolationModalComponent } from '@ubs/ubs-admin/components/view-violation-modal/view-violation-modal.component';

@Component({
  selector: 'app-ubs-admin-order-client-info',
  templateUrl: './ubs-admin-order-client-info.component.html',
  styleUrls: ['./ubs-admin-order-client-info.component.scss']
})
export class UbsAdminOrderClientInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userInfo: IUserInfo;
  @Input() userInfoDto: FormGroup;
  @Input() orderId: number;
  @Input() orderStatus: string;
  @Input() isEmployeeCanEditOrder: boolean;

  phoneMask = Masks.phoneMask;
  isTherePlus = Patterns.isTherePlus;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageOpen: boolean;
  userViolationForCurrentOrder: number;
  totalUserViolations: number;
  isOrderDoneOrCanceled: boolean;
  isOrderNotTakenOut: boolean;
  isUneditableStatus: boolean;

  constructor(private dialog: MatDialog) {}

  get senderEmail() {
    return this.userInfoDto.get('senderEmail');
  }

  get senderPhoneNumber(): FormControl {
    return this.userInfoDto.get('senderPhoneNumber') as FormControl;
  }

  get canAddViolation(): boolean {
    return this.userViolationForCurrentOrder === 0 && (this.isOrderNotTakenOut || this.isOrderDoneOrCanceled);
  }

  get canViewViolation(): boolean {
    return !this.canAddViolation && this.userViolationForCurrentOrder > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orderStatus?.currentValue) {
      this.isOrderDoneOrCanceled =
        changes.orderStatus.currentValue === OrderStatus.DONE || changes.orderStatus.currentValue === OrderStatus.CANCELED;
      this.isUneditableStatus = this.isOrderDoneOrCanceled || changes.orderStatus.currentValue === OrderStatus.BROUGHT_IT_HIMSELF;
      this.isOrderNotTakenOut = changes.orderStatus.currentValue === OrderStatus.NOT_TAKEN_OUT;
    }
  }

  ngOnInit(): void {
    this.pageOpen = true;
    this.setViolationData();
  }

  openDetails(): void {
    this.pageOpen = !this.pageOpen;
  }

  setViolationData(): void {
    this.totalUserViolations = this.userInfo.totalUserViolations;
    this.userViolationForCurrentOrder = this.userInfo.userViolationForCurrentOrder;
  }

  openViewModal(): void {
    this.dialog.open(ViewViolationModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'admin-cabinet-dialog-container',
      data: this.orderId
    });
  }

  openModal(viewMode: boolean = false): void {
    if (!this.canAddViolation) {
      this.openViewModal();
      return;
    }

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

    matDialogRef.afterClosed().subscribe((res) => {
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

    if (abstractControl.errors.pattern && name === 'senderPhoneNumber') {
      return 'input-error.number-format';
    }

    if (abstractControl.errors.wrongNumber) {
      return 'input-error.number-wrong';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
