import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-event-date-time-picker',
  templateUrl: './event-date-time-picker.component.html',
  styleUrls: ['./event-date-time-picker.component.scss']
})
export class EventDateTimePickerComponent implements OnInit {
  public minDate: Date;
  public startDisabled: boolean;
  public endDisabled: boolean;
  public dateDisabled: boolean;
  public timeArrStart = [];
  public timeArrEnd = [];

  @Output() date = new EventEmitter<Date>();
  @Output() startTime = new EventEmitter<string>();
  @Output() endTime = new EventEmitter<string>();

  ngOnInit(): void {
    this.minDate = new Date();
    this.fillTimeArray();
    this.endDisabled = true;
  }

  private fillTimeArray(): void {
    for (let i = 0; i < 24; i++) {
      this.timeArrStart.push(`${i} : 00`);
      this.timeArrEnd.push(`${i} : 00`);
    }
  }

  public addDate(date: MatDatepickerInputEvent<Date>): void {
    this.date.emit(date.value);
    this.dateDisabled = true;
  }

  public addStartTime(time: MatSelectChange): void {
    this.startTime.emit(time.value);
    this.startDisabled = true;
    this.endDisabled = false;
    const checkTime = time.value.split(':');

    +checkTime[0] === 23 ? (this.timeArrEnd = ['23 : 59']) : (this.timeArrEnd = [...this.timeArrStart.slice(+checkTime[0] + 1)]);
  }
  public addEndTime(time: MatSelectChange): void {
    this.endTime.emit(time.value);
    this.endDisabled = true;
  }

  public clear(): void {
    this.startDisabled = false;
    this.dateDisabled = false;
  }
}
