import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IColumnBelonging } from '../../../models/ubs-admin.interface';

@Component({
  selector: 'app-table-cell-readonly',
  templateUrl: './table-cell-readonly.component.html',
  styleUrls: ['./table-cell-readonly.component.scss']
})
export class TableCellReadonlyComponent implements OnInit, OnChanges {
  @Input() title: string | number | { ua: string; en: string } | null;
  @Input() optional: IColumnBelonging[];
  @Input() lang: string;
  @Input() date: string;
  @Input() key: string;
  public dataObj: IColumnBelonging = null;
  public data: string | number | { ua: string; en: string } | null;

  ngOnInit(): void {
    if (this.optional?.length) {
      this.dataObj = this.optional.filter((item) => item.key === this.title)[0];
    }
  }

  ngOnChanges(): void {
    this.data =
      this.key === 'bagsAmount' && this.lang === 'en'
        ? (this.title as string).toLowerCase().replace(/л|шт/gi, (el) => (el === 'л' ? 'L' : 'p'))
        : this.title;
  }

  isTooltipEnabled(title: any): boolean {
    const textContainerWidth = 112;
    const textWidth = document.createElement('canvas').getContext('2d').measureText(title).width;

    return textContainerWidth < textWidth;
  }
}
