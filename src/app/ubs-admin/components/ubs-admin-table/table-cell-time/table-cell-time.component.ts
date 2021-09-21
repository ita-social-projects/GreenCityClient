import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IEditCell } from 'src/app/ubs-admin/models/edit-cell.model';
import { fromSelect, toSelect } from './table-cell-time-range';

@Component({
  selector: 'app-table-cell-time',
  templateUrl: './table-cell-time.component.html',
  styleUrls: ['./table-cell-time.component.scss']
})
export class TableCellTimeComponent implements OnInit {
  @Input() from;
  @Input() to;
  @Input() nameOfColumn;
  @Input() id;
  @Output() editTimeCell = new EventEmitter();

  fromInput: string;
  toInput: string;
  fromSelect: string[];
  toSelect: string[];
  isEditable: boolean;
  isError = '';

  ngOnInit() {
    this.fromSelect = fromSelect;
    this.toSelect = toSelect;
    this.fromInput = this.from;
    this.toInput = this.to;
  }

  edit() {
    this.isEditable = true;
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
  }

  cancel() {
    this.isError = '';
    this.isEditable = false;
    this.fromInput = this.from;
    this.toInput = this.to;
  }
}
