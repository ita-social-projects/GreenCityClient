import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEditCell } from 'src/app/ubs-admin/models/edit-cell.model';
@Component({
  selector: 'app-table-cell-date',
  templateUrl: './table-cell-date.component.html',
  styleUrls: ['./table-cell-date.component.scss']
})
export class TableCellDateComponent {
  @Input() date;
  @Input() nameOfColumn;
  @Input() id;
  @Output() editDateCell = new EventEmitter();
  isEditable: boolean;

  edit() {
    this.isEditable = true;
  }
  changeData(e) {
    const newDateValue: IEditCell = {
      id: this.id,
      nameOfColumn: this.nameOfColumn,
      newValue: e.value
    };
    this.editDateCell.emit(newDateValue);
    this.isEditable = false;
  }
}
