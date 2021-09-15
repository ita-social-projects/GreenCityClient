import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-cell-readonly',
  templateUrl: './table-cell-readonly.component.html',
  styleUrls: ['./table-cell-readonly.component.scss']
})
export class TableCellReadonlyComponent implements OnInit {
  @Input() title;
  @Input() lang;
  @Input() date;

  ngOnInit() {}
}
