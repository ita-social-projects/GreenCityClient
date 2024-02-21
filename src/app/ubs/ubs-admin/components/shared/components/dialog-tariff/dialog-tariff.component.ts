import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dialog-tariff',
  templateUrl: './dialog-tariff.component.html',
  styleUrls: ['./dialog-tariff.component.scss']
})
export class DialogTariffComponent {
  @Input() deactivatePopup: boolean;
  @Input() row: TemplateRef<any>;
  @Input() newDate;
  @Input() name: string;
  @Input() edit: boolean;
}
