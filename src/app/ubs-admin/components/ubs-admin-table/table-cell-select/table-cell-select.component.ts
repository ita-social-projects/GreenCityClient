import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { IAlertInfo, IEditCell } from 'src/app/ubs-admin/models/edit-cell.model';
import { AdminTableService } from 'src/app/ubs-admin/services/admin-table.service';

@Component({
  selector: 'app-table-cell-select',
  templateUrl: './table-cell-select.component.html',
  styleUrls: ['./table-cell-select.component.scss']
})
export class TableCellSelectComponent implements OnInit {
  @Input() optional;
  @Input() id: number;
  @Input() nameOfColumn: string;
  @Input() key;
  @Input() currentValue;
  @Input() lang: string;
  @Input() ordersToChange: number[];
  @Input() isAllChecked: boolean;

  public isEditable: boolean;
  public isBlocked: boolean;
  private newOption: string;

  @Output() cancelEdit = new EventEmitter();
  @Output() editCellSelect = new EventEmitter();
  @Output() showBlockedInfo = new EventEmitter();

  constructor(private adminTableService: AdminTableService) {}

  ngOnInit() {
    this.currentValue = this.optional.filter((item) => item.key === this.key)[0];
  }

  public edit(): void {
    this.isEditable = false;
    this.isBlocked = true;
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

    this.adminTableService
      .blockOrders(typeOfChange)
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

  public save(): void {
    const newValueObj = this.optional.findIndex((item) => item[this.lang] === this.newOption);
    if (newValueObj === -1) {
      this.isEditable = false;
      this.cancelEdit.emit();
    } else {
      const newSelectValue: IEditCell = {
        id: this.id,
        nameOfColumn: this.nameOfColumn,
        newValue: this.optional[newValueObj].key
      };
      this.editCellSelect.emit(newSelectValue);
      this.isEditable = false;
      this.newOption = '';
    }
  }

  public cancel(): void {
    this.newOption = '';
    this.isEditable = false;
    this.cancelEdit.emit();
  }

  public chosenOption(e: any): void {
    this.newOption = e.target.value;
  }
}
