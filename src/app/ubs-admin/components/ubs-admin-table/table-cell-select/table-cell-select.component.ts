import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-cell-select',
  templateUrl: './table-cell-select.component.html',
  styleUrls: ['./table-cell-select.component.scss']
})
export class TableCellSelectComponent implements OnInit {
  @Input() optional;
  @Input() id;
  @Input() nameOfColumn;
  @Input() key;
  @Input() currentValue;
  @Input() lang;

  isEditable: boolean;
  newOption;

  @Output() editCellSelect = new EventEmitter();

  ngOnInit() {
    this.currentValue = this.optional.filter((item) => item.key === this.key)[0];
  }

  edit() {
    this.isEditable = true;
  }

  save() {
    const newValueObj = this.optional.findIndex((item) => item[this.lang] === this.newOption);

    if (newValueObj === -1) {
      this.isEditable = false;
    } else {
      this.editCellSelect.emit({ id: this.id, nameOfColumn: this.nameOfColumn, newValue: this.optional[newValueObj].key });
      this.isEditable = false;
      this.newOption = '';
    }
  }

  cancel() {
    this.newOption = '';
    this.isEditable = false;
  }

  chosenOption(e: any) {
    this.newOption = e.target.value;
  }
}
