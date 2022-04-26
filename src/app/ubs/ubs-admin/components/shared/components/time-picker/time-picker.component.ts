import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fromSelect, toSelect } from '../../../ubs-admin-table/table-cell-time/table-cell-time-range';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {
  public fromSelect: string[];
  public toSelect: string[];
  public fromInput: string;
  public toInput: string;
  public from: string;
  public to: string;

  @Input() setTimeFrom: string;
  @Input() setTimeTo: string;
  @Output() timeOfExport = new EventEmitter<object>();
  ngOnInit(): void {
    this.fromInput = this.setTimeFrom;
    this.toInput = this.setTimeTo;
    this.fromSelect = fromSelect;
    this.toSelect = toSelect;
  }
  onTimeFromChange(): void {
    const fromIdx = fromSelect.indexOf(this.fromInput);
    this.toSelect = toSelect.slice(fromIdx);
  }

  onTimeToChange(): void {
    const toIdx = toSelect.indexOf(this.toInput);
    this.fromSelect = fromSelect.slice(0, toIdx + 1);
  }

  save(): void {
    this.from = this.fromInput;
    this.to = this.toInput;
    if (this.fromInput && this.toInput) {
      this.timeOfExport.emit({ from: this.fromInput, to: this.toInput, dataWasChanged: true });
    }
  }

  cancel(): void {
    this.fromInput = this.from;
    this.toInput = this.to;
    this.timeOfExport.emit({ from: this.fromInput, to: this.toInput, dataWasChanged: false });
  }
}
