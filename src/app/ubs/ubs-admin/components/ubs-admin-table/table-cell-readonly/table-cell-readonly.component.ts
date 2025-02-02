import { Component, DestroyRef, inject, Input, OnChanges, OnInit } from '@angular/core';
import { Address, IBigOrderTableOrderInfo, IColumnBelonging } from '../../../models/ubs-admin.interface';
import { Language } from 'src/app/main/i18n/Language';
import { TableKeys } from '../../../services/table-keys.enum';
import { Patterns } from 'src/assets/patterns/patterns';
import { PaymnetStatus } from 'src/app/ubs/ubs/order-status.enum';
import { AdminTableService } from '@ubs/ubs-admin/services/admin-table.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { OrderService } from '@ubs/ubs-admin/services/order.service';
import { pipe, switchMap } from 'rxjs';
@Component({
  selector: 'app-table-cell-readonly',
  templateUrl: './table-cell-readonly.component.html',
  styleUrls: ['./table-cell-readonly.component.scss']
})
export class TableCellReadonlyComponent implements OnInit, OnChanges {
  @Input() title: string | number | null;
  @Input() optional: IColumnBelonging[];
  @Input() lang: string;
  @Input() key: string;
  @Input() orderId: number;
  unpaid: boolean;
  paid: boolean;
  halfpaid: boolean;
  dataObj: IColumnBelonging = null;
  data: string | number | { ua: string; en: string } | null;
  private readonly font = '12px Lato, sans-serif';
  destroyRef = inject(DestroyRef);
  dialog = inject(MatDialog);
  adminTableService = inject(AdminTableService);
  orderService = inject(OrderService);

  ngOnInit(): void {
    if (this.optional?.length) {
      this.dataObj = this.optional.filter((item) => item.key === this.title)[0];
    }
  }

  ngOnChanges(): void {
    if (this.title) {
      if (this.key === TableKeys.generalDiscount) {
        this.title = !/^0\.00 (UAH|грн)$/.test(String(this.title)) ? `-${this.title}` : this.title;
      }

      if (this.key === TableKeys.clientPhone || this.key === TableKeys.senderPhone) {
        this.title = `+${this.title?.toString().replace(Patterns.isTherePlus, '')}`;
      }

      const replaceRules = {
        [Language.EN]: { regex: /л|шт/gi, match: { л: 'L', шт: 'p' } },
        [Language.UA]: { regex: /[lp]/gi, match: { l: 'л', p: 'шт' } }
      };

      if (this.key === TableKeys.bagsAmount && replaceRules[this.lang]) {
        const { regex, match } = replaceRules[this.lang];
        this.title = (this.title as string).toLowerCase().replace(regex, (el) => match[el]);
      }

      this.data = this.title;

      this.isStatus();
    }
  }

  isStatus() {
    switch (this.data) {
      case PaymnetStatus.PAID:
        this.paid = true;
        break;

      case PaymnetStatus.HALF_PAID:
        this.halfpaid = true;
        break;

      case PaymnetStatus.UNPAID:
        this.unpaid = true;
        break;
    }
  }

  onMouseEnter(event: MouseEvent, tooltip: any): void {
    this.adminTableService.showTooltip(event, tooltip, this.font);
  }

  isAddressKey(): boolean {
    return this.key === 'region' || this.key === 'city' || this.key === 'district' || this.key === 'address';
  }

  openEditAddressWindow(): void {
    this.orderService
      .getOrderInfo(this.orderId)
      .pipe(
        switchMap((orderInfo) => {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass = 'address-matDialog-styles';
          dialogConfig.data = {
            edit: true,
            addFromProfile: true,
            address: orderInfo.addressExportDetailsDto
          };
          const dialogRef = this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);
          return dialogRef.afterClosed();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {});
  }
}
