import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WeekPickModel } from '../../models/week-pick-model';

@Component({
  selector: 'app-time-picker-pop-up',
  templateUrl: './time-picker-popup.component.html',
  styleUrls: ['./time-picker-popup.component.scss']
})
export class TimePickerPopupComponent implements OnInit {
  public fromInput: string;
  public toInput: string;
  public selectTheWorkDay: WeekPickModel[] = [
    { dayOfWeek: 'Понеділок', timeFrom: '', timeTo: '', fromSelected: [], toSelected: [], isSelected: false },
    { dayOfWeek: 'Вівторок', timeFrom: '', timeTo: '', fromSelected: [], toSelected: [], isSelected: false },
    { dayOfWeek: 'Середа', timeFrom: '', timeTo: '', fromSelected: [], toSelected: [], isSelected: false },
    { dayOfWeek: 'Чертвер', timeFrom: '', timeTo: '', fromSelected: [], toSelected: [], isSelected: false },
    { dayOfWeek: `П'ятниця`, timeFrom: '', timeTo: '', fromSelected: [], toSelected: [], isSelected: false },
    { dayOfWeek: 'Субота', timeFrom: '', timeTo: '', fromSelected: [], toSelected: [], isSelected: false },
    { dayOfWeek: 'Неділя', timeFrom: '', timeTo: '', fromSelected: [], toSelected: [], isSelected: false }
  ];
  private readonly timePickHours = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00'
  ];

  constructor(private matDialogRef: MatDialogRef<TimePickerPopupComponent>) {}
  ngOnInit(): void {
    const fromSelect: string[] = this.timePickHours.slice(0, -1);
    const toSelect: string[] = this.timePickHours.slice(1);
    this.selectTheWorkDay.forEach((_, index) => {
      this.selectTheWorkDay[index].fromSelected = [...fromSelect];
      this.selectTheWorkDay[index].toSelected = [...toSelect];
    });
  }

  onTimeFromChange(i: number): void {
    const fromSelect: string[] = this.timePickHours.slice(0, -1);
    const toSelect: string[] = this.timePickHours.slice(1);
    const fromIdx = fromSelect.indexOf(this.selectTheWorkDay[i].timeFrom);
    this.selectTheWorkDay[i].toSelected = toSelect.slice(fromIdx);
  }

  onTimeToChange(i: number): void {
    const fromSelect: string[] = this.timePickHours.slice(0, -1);
    const toSelect: string[] = this.timePickHours.slice(1);
    const toIdx = toSelect.indexOf(this.selectTheWorkDay[i].timeTo);
    this.selectTheWorkDay[i].fromSelected = fromSelect.slice(0, toIdx + 1);
  }

  save(): void {
    const workingDays = this.selectTheWorkDay.filter((day) => !!day.isSelected).map((day) => day.dayOfWeek);

    this.matDialogRef.close({ from: this.fromInput, to: this.toInput, dayOfWeek: workingDays });
  }

  cancel(): void {
    this.matDialogRef.close();
  }

  setTime(index) {
    this.selectTheWorkDay[index].isSelected = !this.selectTheWorkDay[index].isSelected;
  }
}
