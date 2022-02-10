import { Component, OnInit } from '@angular/core';
import { fromSelect, toSelect } from '../ubs-admin-table/table-cell-time/table-cell-time-range';

@Component({
  selector: 'app-ubs-admin-several-orders-pop-up',
  templateUrl: './ubs-admin-several-orders-pop-up.component.html',
  styleUrls: ['./ubs-admin-several-orders-pop-up.component.scss']
})
export class UbsAdminSeveralOrdersPopUpComponent implements OnInit {
  public showTimePicker = false;
  public fromSelect: string[];
  public toSelect: string[];
  public fromInput: string;
  public toInput: string;
  public from: string;
  public to: string;

  constructor() {}
  setExportTime() {
    this.showTimePicker = true;
    this.fromSelect = fromSelect;
    this.toSelect = toSelect;
  }

  onTimeFromChange() {
    const fromIdx = fromSelect.indexOf(this.fromInput);
    this.toSelect = toSelect.slice(fromIdx);
  }

  onTimeToChange() {
    const toIdx = toSelect.indexOf(this.toInput);
    this.fromSelect = fromSelect.slice(0, toIdx + 1);
  }

  save() {
    this.from = this.fromInput;
    this.to = this.toInput;
  }

  cancel() {
    this.fromInput = this.from;
    this.toInput = this.to;
    this.showTimePicker = false;
  }
  ngOnInit(): void {}
}
