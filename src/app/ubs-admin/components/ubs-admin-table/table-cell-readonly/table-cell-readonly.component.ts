import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-cell-readonly',
  templateUrl: './table-cell-readonly.component.html',
  styleUrls: ['./table-cell-readonly.component.scss']
})
export class TableCellReadonlyComponent {
  @Input() title;
  @Input() lang;
  @Input() date;

  showTooltip(title: any, tooltip: any) {
    const lengthStr = title.split('').length;
    if (lengthStr > 22) {
      tooltip.toggle();
    }
  }
}
