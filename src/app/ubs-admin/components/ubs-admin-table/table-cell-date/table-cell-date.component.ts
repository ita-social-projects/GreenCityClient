import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-cell-date',
  templateUrl: './table-cell-date.component.html',
  styleUrls: ['./table-cell-date.component.scss']
})
export class TableCellDateComponent implements OnInit {
  @Input() date;
  @Input() nameOfColumn;
  @Input() id;
  @Output() editDateCell = new EventEmitter();
  isEditable: boolean;

  ngOnInit() {}

  edit() {
    this.isEditable = true;
  }
  changeData(e) {
    this.editDateCell.emit({ id: this.id, nameOfColumn: this.nameOfColumn, newValue: e.value });
    this.isEditable = false;
  }
}
