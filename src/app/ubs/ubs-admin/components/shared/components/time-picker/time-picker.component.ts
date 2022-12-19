import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { fromSelect, toSelect } from '../../../ubs-admin-table/table-cell-time/table-cell-time-range';
import { formatDate } from '@angular/common';

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
  currentHour: string;
  currentDate;

  @Input() setTimeFrom: string;
  @Input() setTimeTo: string;
  @Input() exportDate;
  @Output() timeOfExport = new EventEmitter<object>();
  ngOnInit(): void {
    this.fromInput = this.setTimeFrom;
    this.toInput = this.setTimeTo;
    this.fromSelect = fromSelect;
    this.toSelect = toSelect;
    this.initTime();
    this.checkExportDate();
  }

  checkExportDate(): void {
    this.initDate();

    if (this.currentDate >= this.exportDate) {
      this.fromSelect = this.compareTime();
    }
  }

  onTimeFromChange(): void {
    const fromIdx = fromSelect.indexOf(this.fromInput);
    this.toSelect = toSelect.slice(fromIdx);
  }

  onTimeToChange(): void {
    const toIdx = toSelect.indexOf(this.toInput);
    this.fromSelect = fromSelect.slice(0, toIdx + 1);
  }

  convertTime12to24(time12h): string {
    const [time, modifier] = time12h.split(' ');

    // tslint:disable-next-line:prefer-const
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  compareTime(): string[] {
    const arr = [];
    this.fromSelect.forEach((val, index) => {
      if (this.currentHour < this.fromSelect[index]) {
        arr.push(this.fromSelect[index]);
      }
    });
    return arr;
  }

  initDate(): void {
    this.currentDate = new Date();
    this.currentDate = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
    this.currentDate = new Date(this.currentDate);
    this.exportDate = new Date(this.exportDate);
  }

  initTime(): void {
    this.currentHour = Date.now().toString();
    this.currentHour = formatDate(this.currentHour, 'hh:mm a', 'en-US');
    this.currentHour = this.convertTime12to24(this.currentHour);
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
