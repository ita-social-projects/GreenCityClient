import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from 'src/app/shared/services/moment-date-adapter';
import { SetCursorWaite } from 'src/app/store/actions/ubs-admin.actions';
import { IAlertInfo, IEditCell } from 'src/app/ubs/ubs-admin/models/edit-cell.model';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { MatDatepicker } from '@angular/material/datepicker';

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY'
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-table-cell-date',
  templateUrl: './table-cell-date.component.html',
  styleUrls: ['./table-cell-date.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { strict: true } }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCellDateComponent {
  @Input() date;
  @Input() nameOfColumn: string;
  @Input() id: number;
  @Input() ordersToChange: number[];
  @Input() isAllChecked: boolean;
  @Input() uneditableStatus: boolean;

  @Output() editDateCell = new EventEmitter();
  @Output() showBlockedInfo = new EventEmitter();

  current: Date = new Date();

  adminTableService = inject(AdminTableService);
  store = inject(Store);

  @Input() set lang(lang: string) {
    if (lang) {
      this.adapter.setLocale(lang);
    }
  }

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly adapter: DateAdapter<any>
  ) {}

  edit(picker: MatDatepicker<Date>, event?: KeyboardEvent): void {
    if (this.uneditableStatus || (event && event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    this.store.dispatch(SetCursorWaite({ isWaiting: true }));

    let typeOfChange: number[];

    if (this.isAllChecked) {
      typeOfChange = [];
    }

    if (this.ordersToChange.length) {
      typeOfChange = this.ordersToChange;
    }

    if (!this.isAllChecked && !this.ordersToChange.length) {
      typeOfChange = [this.id];
    }

    this.adminTableService.blockOrders(typeOfChange).subscribe((res: IAlertInfo[]) => {
      if (res[0] === undefined) {
        picker.open();
      } else {
        this.showBlockedInfo.emit(res);
      }
      this.store.dispatch(SetCursorWaite({ isWaiting: false }));
      this.cdr.markForCheck();
    });
  }

  changeData(e: { value: Date }): void {
    if (!e.value) {
      console.error('Invalid date value received.');
      return;
    }

    const date = e.value instanceof Date ? e.value : new Date(e.value);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const isoDate = `${yyyy}-${mm}-${dd}`;

    const newDateValue: IEditCell = {
      id: this.id,
      nameOfColumn: this.nameOfColumn,
      newValue: isoDate
    };
    this.editDateCell.emit(newDateValue);
  }
}
