import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output } from '@angular/core';
import { IAlertInfo, IEditCell } from '@ubs/ubs-admin/models/edit-cell.model';
import { IColumnBelonging } from '@ubs/ubs-admin/models/ubs-admin.interface';
import { AdminTableService } from '@ubs/ubs-admin/services/admin-table.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { CommentPopUpComponent } from '@ubs/ubs-admin/components/shared/components/comment-pop-up/comment-pop-up.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { UBSAddAddressPopUpComponent } from '@ubs/shared/components/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '@ubs/ubs-admin/services/order.service';
import { Store } from '@ngrx/store';
import { SetCursorWaite } from 'src/app/store/actions/ubs-admin.actions';

@Component({
  selector: 'app-table-cell-input',
  templateUrl: './table-cell-input.component.html',
  styleUrls: ['./table-cell-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCellInputComponent {
  @Input() column: IColumnBelonging;
  @Input() id: number;
  @Input() ordersToChange: number[];
  @Input() isAllChecked: boolean;
  @Input() isUneditableStatus: boolean;
  @Input() data: string;
  @Input() lang: string;
  @Output() cancelEdit = new EventEmitter();
  @Output() editCommentCell = new EventEmitter();
  @Output() showBlockedInfo = new EventEmitter();

  isEditable: boolean;
  private typeOfChange: number[];
  private dialogConfig = new MatDialogConfig();

  constructor(
    private adminTableService: AdminTableService,
    private localStorageService: LocalStorageService,
    public dialog: MatDialog,
    private orderService: OrderService,
    private destroyRef: DestroyRef,
    private store: Store
  ) {}

  edit(): void {
    this.store.dispatch(SetCursorWaite({ isWaiting: true }));
    this.isEditable = false;
    this.typeOfChange = this.adminTableService.howChangeCell(this.isAllChecked, this.ordersToChange, this.id);
    this.adminTableService
      .blockOrders(this.typeOfChange)
      .pipe(
        catchError(() => {
          this.isEditable = true;
          return of([]);
        })
      )
      .subscribe((res: IAlertInfo[]) => {
        if (res && res[0]) {
          this.showBlockedInfo.emit(res);
        } else {
          setTimeout(() => {
            this.isEditable = true;
            this.openPopUp();
          });
        }
      });
  }

  private openPopUp(): void {
    this.store.dispatch(SetCursorWaite({ isWaiting: false }));
    this.dialogConfig.disableClose = true;
    const modalRef = this.dialog.open(CommentPopUpComponent, this.dialogConfig);
    modalRef.componentInstance.header = this.localStorageService.getCurrentLanguage() === 'uk' ? this.column.uk : this.column.en;
    modalRef.componentInstance.comment = this.data;
    modalRef.afterClosed().subscribe((updatedData) => {
      if (updatedData !== null && updatedData !== this.data) {
        const newCommentValue: IEditCell = {
          id: this.id,
          nameOfColumn: this.column.key,
          newValue: updatedData
        };
        this.editCommentCell.emit(newCommentValue);
      }
      this.cancelEdit.emit(this.typeOfChange);
      this.isEditable = false;
    });
  }

  onMouseEnter(event: MouseEvent, tooltip: any): void {
    const target = event.target as HTMLElement;
    tooltip.disabled = target.scrollWidth <= target.clientWidth;
  }

  isAddressKey(): boolean {
    const addressKeys = ['region', 'city', 'district', 'address', 'commentToAddressForClient'];
    return addressKeys.includes(this.column.key);
  }

  openEditAddressWindow(): void {
    this.store.dispatch(SetCursorWaite({ isWaiting: true }));
    this.adminTableService.blockOrders([this.id]).subscribe();
    this.orderService
      .getOrderAddress(this.id)
      .pipe(
        map((orderAddress) => ({
          ...orderAddress.orderAddressExportDetails,
          coordinates: {},
          actual: false,
          orderId: orderAddress.orderId
        })),
        switchMap((orderAddress) => {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'address-matDialog-styles';
          dialogConfig.data = {
            edit: true,
            address: orderAddress,
            orderId: orderAddress.orderId,
            addressForOrder: true
          };
          const dialogRef = this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);
          return dialogRef.afterClosed();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.adminTableService.unblockOrders([this.id]).subscribe();
      });
  }
}
