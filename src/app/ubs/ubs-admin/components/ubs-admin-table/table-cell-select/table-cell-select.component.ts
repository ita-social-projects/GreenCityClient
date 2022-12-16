import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { first, take } from 'rxjs/operators';
import { IAlertInfo, IEditCell } from 'src/app/ubs/ubs-admin/models/edit-cell.model';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { IBigOrderTableOrderInfo, IDataForPopUp } from '../../../models/ubs-admin.interface';
import { OrderService } from '../../../services/order.service';
import { AddOrderCancellationReasonComponent } from '../../add-order-cancellation-reason/add-order-cancellation-reason.component';

import { UbsAdminSeveralOrdersPopUpComponent } from '../../ubs-admin-several-orders-pop-up/ubs-admin-several-orders-pop-up.component';

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
  @Input() currentValue: string;
  @Input() lang: string;
  @Input() ordersToChange: number[];
  @Input() isAllChecked: boolean;
  @Input() doneOrCanceled: boolean;
  @Input() showPopUp: boolean;
  @Input() dataForPopUp: IDataForPopUp[];

  public isEditable: boolean;
  public isBlocked: boolean;
  private newOption: string;
  private typeOfChange: number[];
  private checkStatus: boolean;
  private dialogConfig = new MatDialogConfig();

  @Output() cancelEdit = new EventEmitter();
  @Output() editCellSelect = new EventEmitter();
  @Output() showBlockedInfo = new EventEmitter();
  @Output() editButtonClick = new EventEmitter();
  @Output() orderCancellation = new EventEmitter();
  search: string;
  sortType: string;
  sortingColumn: string;
  readonly onePageForWholeTable = 0;
  pageSize = 300;
  tableData: IBigOrderTableOrderInfo[];

  constructor(private adminTableService: AdminTableService, private orderSevice: OrderService, public dialog: MatDialog) {}

  ngOnInit() {
    this.currentValue = this.optional.filter((item) => item.key === this.key)[0];
    if (!this.currentValue) {
      this.currentValue = '';
    }
    this.filterStatuses();
    this.fn();
  }

  private filterStatuses(): void {
    if (this.nameOfColumn === 'orderStatus') {
      this.optional = this.orderSevice.getAvailableOrderStatuses(this.key, this.optional);
    }
  }
  // The condition of pickup details for required fields
  private filterStatusesForPopUp(): boolean {
    const statuses = ['ADJUSTMENT', 'CONFIRMED', 'ON_THE_ROUTE', 'DONE'];
    const key = this.optional[this.findKeyForNewOption()].key;
    return statuses.includes(key);
  }
  private findKeyForNewOption(): number {
    return this.optional.findIndex((item) => item[this.lang] === this.newOption);
  }
  public edit(): void {
    this.isEditable = false;
    this.isBlocked = true;
    this.typeOfChange = this.adminTableService.howChangeCell(this.isAllChecked, this.ordersToChange, this.id);
    this.adminTableService
      .blockOrders(this.typeOfChange)
      .pipe(take(1))
      .subscribe((res: IAlertInfo[]) => {
        if (res[0] === undefined) {
          this.isBlocked = false;
          this.isEditable = true;
        } else {
          this.isEditable = false;
          this.isBlocked = false;
          this.showBlockedInfo.emit(res);
        }
      });
    this.editButtonClick.emit(this.id);
  }

  public save(): void {
    const newValueObj = this.findKeyForNewOption();
    if (newValueObj === -1) {
      this.typeOfChange = this.adminTableService.howChangeCell(this.isAllChecked, this.ordersToChange, this.id);
      this.isEditable = false;
      this.cancelEdit.emit(this.typeOfChange);
    } else {
      const newSelectValue: IEditCell = {
        id: this.id,
        nameOfColumn: this.nameOfColumn,
        newValue: this.optional[newValueObj].key
      };
      this.editCellSelect.emit(newSelectValue);
      this.isEditable = false;
      this.newOption = '';
      this.cancelEdit.emit(this.typeOfChange);
    }
  }

  fn() {
    this.getOrdersTable(this.onePageForWholeTable, this.pageSize, '', 'DESC', 'id')
      .pipe(take(1))
      .subscribe((res) => {
        console.log('res:', res);
        this.tableData = res.content;
        // console.log('tableData:', this.tableData);
        return this.tableData;
      });
  }

  getOrdersTable(
    currentPage,
    pageSize,
    filters = this.search || '',
    sortingType = this.sortType || 'DESC',
    columnName = this.sortingColumn || 'id'
  ) {
    return this.adminTableService.getTable(columnName, currentPage, filters, pageSize, sortingType).pipe(first());
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

  public saveClick(): void {
    if (this.nameOfColumn === 'orderStatus' && this.checkStatus && this.showPopUp) {
      this.checkIfStatusConfirmed();
    } else if (this.nameOfColumn === 'orderStatus' && (this.newOption === 'Canceled' || this.newOption === 'Скасовано')) {
      this.openCancelPopUp();
    } else if (this.nameOfColumn === 'orderStatus') {
      this.save();
    } else {
      this.save();
    }
  }

  checkIfStatusConfirmed() {
    if (this.newOption !== 'Confirmed' && this.newOption !== 'Підтверджено') {
      this.openPopUp();
    } else {
      this.save();
    }
  }

  public cancel(): void {
    this.typeOfChange = this.adminTableService.howChangeCell(this.isAllChecked, this.ordersToChange, this.id);
    this.cancelEdit.emit(this.typeOfChange);
    this.newOption = '';
    this.isEditable = false;
  }

  public chosenOption(e: any): void {
    this.newOption = e.target.value;
    this.checkStatus = this.filterStatusesForPopUp();
  }

  public openCancelPopUp(): void {
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
}
