import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-dialog-tariff',
  templateUrl: './dialog-tariff.component.html',
  styleUrls: ['./dialog-tariff.component.scss']
})
export class DialogTariffComponent implements OnInit {
  @Input() deactivatePopup: boolean;
  @Input() row: TemplateRef<any>;
  @Input() newDate;
  @Input() name: string;
  @Input() edit: boolean;
  @Input() hideTitle = false;

  constructor() {}

  ngOnInit(): void {}
}
