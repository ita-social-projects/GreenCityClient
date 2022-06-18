import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WeekPickModel, WorkingTime } from '../../models/week-pick-model';
import { WeekDays } from '@global-models/weekDays.model';

@Component({
  selector: 'app-time-picker-pop-up',
  templateUrl: './time-picker-popup.component.html',
  styleUrls: ['./time-picker-popup.component.scss']
})
export class TimePickerPopupComponent implements OnInit {
  @Output()
  public timeOfWork = new EventEmitter<WorkingTime[]>();
  public selectTheWorkDay: WeekPickModel[] = [
    {
      dayToDisplay: 'places.days.monday',
      timeFrom: '',
      timeTo: '',
      fromSelected: [],
      toSelected: [],
      isSelected: false,
      dayToSend: WeekDays.MONDAY
    },
    {
      dayToDisplay: 'places.days.tuesday',
      timeFrom: '',
      timeTo: '',
      fromSelected: [],
      toSelected: [],
      isSelected: false,
      dayToSend: WeekDays.TUESDAY
    },
    {
      dayToDisplay: 'places.days.wednesday',
      timeFrom: '',
      timeTo: '',
      fromSelected: [],
      toSelected: [],
      isSelected: false,
      dayToSend: WeekDays.WEDNESDAY
    },
    {
      dayToDisplay: 'places.days.thursday',
      timeFrom: '',
      timeTo: '',
      fromSelected: [],
      toSelected: [],
      isSelected: false,
      dayToSend: WeekDays.THURSDAY
    },
    {
      dayToDisplay: 'places.days.friday',
      timeFrom: '',
      timeTo: '',
      fromSelected: [],
      toSelected: [],
      isSelected: false,
      dayToSend: WeekDays.FRIDAY
    },
    {
      dayToDisplay: 'places.days.saturday',
      timeFrom: '',
      timeTo: '',
      fromSelected: [],
      toSelected: [],
      isSelected: false,
      dayToSend: WeekDays.SATURDAY
    },
    {
      dayToDisplay: 'places.days.sunday',
      timeFrom: '',
      timeTo: '',
      fromSelected: [],
      toSelected: [],
      isSelected: false,
      dayToSend: WeekDays.SUNDAY
    }
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
    this.save();
  }

  onTimeToChange(i: number): void {
    const fromSelect: string[] = this.timePickHours.slice(0, -1);
    const toSelect: string[] = this.timePickHours.slice(1);
    const toIdx = toSelect.indexOf(this.selectTheWorkDay[i].timeTo);
    this.selectTheWorkDay[i].fromSelected = fromSelect.slice(0, toIdx + 1);
    this.save();
  }

  save(): void {
    this.timeOfWork.emit(
      this.selectTheWorkDay.map((day): WorkingTime => {
        return { dayOfWeek: day.dayToSend, timeTo: day.timeTo, timeFrom: day.timeFrom, isSelected: day.isSelected };
      })
    );
  }

  setTime(index) {
    this.selectTheWorkDay[index].isSelected = !this.selectTheWorkDay[index].isSelected;
    if (!this.selectTheWorkDay[index].isSelected) {
      this.selectTheWorkDay[index].toSelected = this.timePickHours;
      this.selectTheWorkDay[index].fromSelected = this.timePickHours;
      this.selectTheWorkDay[index].timeFrom = '';
      this.selectTheWorkDay[index].timeTo = '';
    }
    this.save();
  }
}
