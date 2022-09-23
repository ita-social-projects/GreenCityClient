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

  @Input() isCurrentDaySelected = false;
  @Input() setTimeFrom: string;
  @Input() setTimeTo: string;
  @Output() timeOfExport = new EventEmitter<object>();

  ngOnInit(): void {
    this.fromInput = this.setTimeFrom;
    this.toInput = this.setTimeTo;
    this.fromSelect = this.isCurrentDaySelected ? this.calcTimeFromOptions(fromSelect) : fromSelect;
    this.toSelect = toSelect;
  }

  calcTimeFromOptions(timeOptions: string[]): string[] {
    let hour: string | number = new Date().getHours();
    let minute: string | number = new Date().getMinutes();

    const firstWorkingHour: number = Number(timeOptions[0].split(':')[0]);
    if (hour < firstWorkingHour) {
      return timeOptions;
    }

    if (minute >= 30) {
      hour += 1;
      minute = '00';
    } else {
      minute = '30';
    }
    hour = hour < 10 ? `0${hour}` : String(hour);

    const firstTimeOptionIndex = timeOptions.indexOf(`${hour}:${minute}`);

    return timeOptions.slice(firstTimeOptionIndex);
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
