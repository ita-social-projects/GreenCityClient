import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize, take } from 'rxjs/operators';
import { IAlertInfo, IEditCell } from 'src/app/ubs/ubs-admin/models/edit-cell.model';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { IDataForPopUp } from '../../../models/ubs-admin.interface';
import { OrderService } from '../../../services/order.service';
import { AddOrderCancellationReasonComponent } from '../../add-order-cancellation-reason/add-order-cancellation-reason.component';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { UbsAdminSeveralOrdersPopUpComponent } from '../../ubs-admin-several-orders-pop-up/ubs-admin-several-orders-pop-up.component';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { UbsAdminConfirmStatusChangePopUpComponent } from '../../ubs-admin-confirm-status-change-pop-up/ubs-admin-confirm-status-change-pop-up.component';
import { Store } from '@ngrx/store';
import { SetCursorWaite } from 'src/app/store/actions/ubs-admin.actions';
import { AddOrderNotTakenOutReasonComponent } from '@ubs/ubs-admin/components/add-order-not-taken-out-reason/add-order-not-taken-out-reason.component';

@Component({
  selector: 'app-table-cell-select',
  templateUrl: './table-cell-select.component.html',
  styleUrls: ['./table-cell-select.component.scss']
})
export class TableCellSelectComponent implements OnInit {
  @Input() optional: any;
  @Input() id: number;
  @Input() nameOfColumn: string;
  @Input() key: string;
  @Input() currentValue = '';
  @Input() lang: string;
  @Input() ordersToChange: number[];
  @Input() isAllChecked: boolean;
  @Input() uneditableStatus: boolean;
  @Input() showPopUp: boolean;
  @Input() dataForPopUp: IDataForPopUp[];

  isLocked = false; //Locked by user
  isBlocked = false; //Blocked by someone else
  isSelectOpened = false;
  isDisabled = true;
  options = [];
  private newOption: string;
  private oldOption: string;
  private typeOfChange: number[];
  private checkStatus: boolean;
  private dialogConfig = new MatDialogConfig();

  @Output() cancelEdit = new EventEmitter();
  @Output() editCellSelect = new EventEmitter();
  @Output() showBlockedInfo = new EventEmitter();
  @Output() editButtonClick = new EventEmitter();
  @Output() orderCancellation = new EventEmitter();

  @ViewChild('select') select: MatSelect;

  constructor(
    private readonly adminTableService: AdminTableService,
    private readonly orderService: OrderService,
    public dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.currentValue = this.optional.filter((item) => item.key === this.key)[0];
    this.oldOption = this.currentValue;
    this.filterStatuses();
  }

  onSelectClick(): void {
    if (this.isLocked) {
      return;
    }
    this.lockOrder();
    this.store.dispatch(SetCursorWaite({ isWaiting: true }));
  }

  onSelectClosed(): void {
    this.isLocked = false;
    this.isDisabled = true;

    this.releaseLock();
    this.store.dispatch(SetCursorWaite({ isWaiting: false }));
  }

  lockOrder(): void {
    this.adminTableService
      .blockOrders([this.id])
      .pipe(
        take(1),
        finalize(() => {
          this.editButtonClick.emit(this.id);
        })
      )
      .subscribe((res: IAlertInfo[]) => {
        this.processLockResponse(res);
        this.store.dispatch(SetCursorWaite({ isWaiting: false }));
      });
  }

  save(): void {
    const newValueObj = this.findKeyForNewOption();
    if (newValueObj === -1 && this.id) {
      this.typeOfChange = this.adminTableService.howChangeCell(this.isAllChecked, this.ordersToChange, this.id);
      this.cancelEdit.emit(this.typeOfChange);
    } else {
      const newSelectValue: IEditCell = {
        id: this.id,
        nameOfColumn: this.nameOfColumn,
        newValue: this.optional[newValueObj].key
      };
      this.editCellSelect.emit(newSelectValue);
      this.newOption = '';
    }
  }

  saveClick(): void {
    if (this.nameOfColumn !== 'orderStatus') {
      this.save();
      return;
    }

    const isNotTakenOut = ['Not taken out', 'Не вивезли'].includes(this.newOption);
    const isCancelOption = ['Canceled', 'Скасовано'].includes(this.newOption);
    const isConfirmOption = ['Сформовано', 'Formed', 'Confirmed', 'Підтверджено', 'Привезе сам', 'Brought by himself'].includes(
      this.newOption
    );

    if (isConfirmOption) {
      this.openConfirmPopUp();
    } else if (isCancelOption) {
      this.openCancelPopUp();
    } else if (isNotTakenOut) {
      this.notTakenOutOpenPop();
    } else if (this.checkStatus && this.showPopUp) {
      this.checkIfStatusConfirmed();
    } else {
      this.save();
    }
  }

  checkIfStatusConfirmed(): void {
    if (this.newOption !== 'Confirmed' && this.newOption !== 'Підтверджено') {
      this.openPopUp();
    } else {
      this.save();
    }
  }

  cancel(): void {
    this.typeOfChange = this.adminTableService.howChangeCell(this.isAllChecked, this.ordersToChange, this.id);
    this.cancelEdit.emit(this.typeOfChange);
    this.newOption = '';
    this.currentValue = this.oldOption;
  }

  chosenOption(e: MatSelectChange): void {
    this.newOption = e.value;
    this.checkStatus = this.filterStatusesForPopUp();
    this.saveClick();
  }

  openCancelPopUp(): void {
    this.dialog
      .open(AddOrderCancellationReasonComponent, {
        hasBackdrop: true
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res.action === 'cancel') {
          this.cancel();
          return;
        }
        const orderCancellationData = {
          cancellationReason: res.reason,
          cancellationComment: res.reason === 'OTHER' ? res.comment : null
        };
        this.orderCancellation.emit(orderCancellationData);
        this.save();
      });
  }

  openConfirmPopUp(): void {
    this.dialogConfig.data = { newOption: this.newOption };
    this.dialog
      .open(UbsAdminConfirmStatusChangePopUpComponent, this.dialogConfig)
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (!res) {
          this.cancel();
          return;
        }
        this.save();
      });
  }

  private processLockResponse(res: IAlertInfo[]): void {
    if (res.length) {
      this.isBlocked = true;
      this.isLocked = false;
      this.isDisabled = true;
      this.showBlockedInfo.emit(res);
    } else {
      this.isLocked = true;
      this.isBlocked = false;
      this.isDisabled = false;
      setTimeout(() => {
        this.select.open();
      });
    }
  }

  private releaseLock(): void {
    this.adminTableService.unblockOrders([this.id]).pipe(take(1)).subscribe();
  }

  private openPopUp(): void {
    this.dialogConfig.disableClose = true;
    const modalRef = this.dialog.open(UbsAdminSeveralOrdersPopUpComponent, this.dialogConfig);
    modalRef.componentInstance.dataFromTable = this.dataForPopUp;
    modalRef.componentInstance.ordersId = this.ordersToChange;
    modalRef.componentInstance.currentLang = this.lang;
    modalRef.afterClosed().subscribe((result) => {
      result ? this.save() : this.cancel();
    });
  }

  notTakenOutOpenPop(): void {
    this.dialog
      .open(AddOrderNotTakenOutReasonComponent, {
        hasBackdrop: true,
        data: {
          id: this.id
        }
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        res ? this.save() : this.cancel();
      });
  }

  private filterStatuses(): void {
    if (this.nameOfColumn === 'orderStatus') {
      this.optional = this.orderService.getAvailableOrderStatuses(this.key, this.optional);
    }
  }

  // The condition of pickup details for required fields
  private filterStatusesForPopUp(): boolean {
    const statuses = [OrderStatus.ADJUSTMENT, OrderStatus.CONFIRMED, OrderStatus.ON_THE_ROUTE, OrderStatus.DONE];
    const key = this.optional[this.findKeyForNewOption()].key;
    return statuses.includes(key);
  }

  private findKeyForNewOption(): number {
    return this.optional.findIndex((item) => item[this.lang === 'ua' ? 'uk' : this.lang] === this.newOption);
  }
}
