import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  fromSelect: string[] = [
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00'
  ];
  toSelect: string[] = ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];
  isEditable: boolean;
  isError = '';

  ngOnInit() {
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
    this.editTimeCell.emit({ id: this.id, nameOfColumn: this.nameOfColumn, newValue: `${this.fromInput}-${this.toInput}` });
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
