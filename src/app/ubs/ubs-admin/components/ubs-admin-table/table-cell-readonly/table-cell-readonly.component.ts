import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { IColumnBelonging } from '../../../models/ubs-admin.interface';

import { Language } from 'src/app/shared/i18n/Language';
import { TableKeys } from '../../../services/table-keys.enum';
import { Patterns } from 'src/assets/patterns/patterns';
import { MatTooltip } from '@angular/material/tooltip';
import { PaymentStatus } from '@ubs/ubs/enums/order-status.enum';

@Component({
  selector: 'app-table-cell-readonly',
  templateUrl: './table-cell-readonly.component.html',
  styleUrls: ['./table-cell-readonly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCellReadonlyComponent implements OnInit, OnChanges {
  @Input() title: string | number | null;
  @Input() optional: IColumnBelonging[];
  @Input() lang: string;
  @Input() key: string;
  @Input() orderId: number;
  unpaid: boolean;
  paid: boolean;
  halfpaid: boolean;
  dataObj: IColumnBelonging = null;
  data: string | number | { uk: string; en: string } | null;
  readonly paymentStatus = PaymentStatus;

  ngOnInit(): void {
    if (this.optional?.length) {
      this.dataObj = this.optional.filter((item) => item.key === this.title)[0];
    }
  }

  ngOnChanges(): void {
    if (this.title) {
      if (this.key === TableKeys.generalDiscount) {
        this.title = !/^0\.00 (UAH|грн)$/.test(String(this.title)) ? `-${this.title}` : this.title;
      }

      if (this.key === TableKeys.clientPhone || this.key === TableKeys.senderPhone) {
        this.title = `+${this.title?.toString().replace(Patterns.isTherePlus, '')}`;
      }

      const replaceRules = {
        [Language.EN]: { regex: /л|шт/gi, match: { л: 'L', шт: 'p' } },
        [Language.UK]: { regex: /[lp]/gi, match: { l: 'л', p: 'шт' } }
      };

      if (this.key === TableKeys.bagsAmount && replaceRules[this.lang]) {
        const { regex, match } = replaceRules[this.lang];
        this.title = (this.title as string).toLowerCase().replace(regex, (el) => match[el]);
      }
      this.data = this.title;
    }
  }

  onHover(event: MouseEvent, tooltip: MatTooltip): void {
    const target = event.target as HTMLElement;
    tooltip.disabled = target.scrollWidth <= target.clientWidth;
  }
}
