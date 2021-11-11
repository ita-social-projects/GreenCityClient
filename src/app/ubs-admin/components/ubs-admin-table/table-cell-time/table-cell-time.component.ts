import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { IAlertInfo, IEditCell } from 'src/app/ubs-admin/models/edit-cell.model';
import { AdminTableService } from 'src/app/ubs-admin/services/admin-table.service';
import { fromSelect, toSelect } from './table-cell-time-range';

@Component({
  selector: 'app-table-cell-time',
  templateUrl: './table-cell-time.component.html',
  styleUrls: ['./table-cell-time.component.scss']
})
export class TableCellTimeComponent implements OnInit {
  @Input() from;
  @Input() to;
  @Input() nameOfColumn: string;
  @Input() id: number;
  @Input() ordersToChange: number[];
  @Input() isAllChecked: boolean;

  @Output() cancelEdit = new EventEmitter();
  @Output() editTimeCell = new EventEmitter();
  @Output() showBlockedInfo = new EventEmitter();

  public fromInput: string;
  public toInput: string;
  public fromSelect: string[];
  public toSelect: string[];
  public isEditable: boolean;
  public isError = '';
  public isBlocked: boolean;
  private typeOfChange: number[];

  constructor(private adminTableService: AdminTableService) {}

  ngOnInit() {
    this.fromSelect = fromSelect;
    this.toSelect = toSelect;
    this.fromInput = this.from;
    this.toInput = this.to;
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
  }

  save() {
    if (this.fromInput === this.from && this.toInput === this.to) {
      this.isEditable = false;
      this.isError = '';
      return;
    }
    if (this.fromInput === this.toInput) {
      this.isError = 'Can not be the same';
      return;
    }
    if (this.fromInput.slice(0, 2) > this.toInput.slice(0, 2)) {
      this.isError = 'time error';
      return;
    }
    const newTimeValue: IEditCell = {
      id: this.id,
      nameOfColumn: this.nameOfColumn,
      newValue: `${this.fromInput}-${this.toInput}`
    };
    this.editTimeCell.emit(newTimeValue);
    this.isError = '';
    this.isEditable = false;
    this.cancelEdit.emit(this.typeOfChange);
  }

  cancel() {
    this.typeOfChange = this.adminTableService.howChangeCell(this.isAllChecked, this.ordersToChange, this.id);
    this.cancelEdit.emit(this.typeOfChange);
    this.isError = '';
    this.isEditable = false;
    this.fromInput = this.from;
    this.toInput = this.to;
  }
}
