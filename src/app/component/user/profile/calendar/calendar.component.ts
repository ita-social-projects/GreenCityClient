import { Component, OnInit } from '@angular/core';
import { CalendarInterface } from './calendar-interface';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  // private monthView = false;
  private monthAndYearName: string;
  private daysNameLong = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  private months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  private currentMonth = new Date().getMonth();
  private currentYear = new Date().getFullYear();
  private calendarDay: CalendarInterface[] = [];


  private calendar: CalendarInterface = {
    date: new Date(),
    numberOfDate: 0,
    year: 0,
    month: 0,
    firstDay: 0,
    dayName: '',
    totalDaysInMonth: 0,
    isHabitsTracked: false,
    isCurrentDayActive: false
  };

  constructor() {
  }

  ngOnInit() {
    this.buildCalendar(this.currentMonth, this.currentYear);
  }

  private getDaysInMonth(iMonth, iYear): number {
    return new Date(iYear, iMonth + 1, 0).getDate();
  }

  private buildCalendar(month, year): void {
    this.calendar.month = month;
    this.calendar.year = year;
    this.calendar.firstDay = (new Date(year, month, 0)).getDay();
    this.calendar.totalDaysInMonth = this.getDaysInMonth(month, year);
    this.monthAndYearName = this.months[month] + ' ' + year;

    for (let i = 1; i <= this.calendar.totalDaysInMonth; i++) {
      this.calendarDay.push({
        numberOfDate : i,
        date : new Date(),
        month : this.calendar.month,
        year : this.calendar.year,
        firstDay : this.calendar.firstDay,
        totalDaysInMonth : this.calendar.totalDaysInMonth,
        dayName : new Date(this.calendar.year, this.calendar.month, i)
          .toDateString()
          .substring(0, 3),
        isHabitsTracked: false,
        isCurrentDayActive: false
      });
    }
    this.setEmptyDays();
    this.isCurrentDayActive();
  }

  private setEmptyDays(): void {
    for (let i = 1; i <= this.calendar.firstDay; i++) {
      this.calendarDay.unshift({
        numberOfDate : '',
        date : new Date(),
        month : this.calendar.month,
        year : this.calendar.year,
        firstDay : this.calendar.firstDay,
        totalDaysInMonth : this.calendar.totalDaysInMonth,
        dayName : new Date(this.calendar.year, this.calendar.month, i)
          .toDateString()
          .substring(0, 3),
        isHabitsTracked: false,
        isCurrentDayActive: false
      });
    }
  }
  private isCurrentDayActive(): void {
    this.calendarDay.map(el =>
      (el.date.getDate() === el.numberOfDate) ?
        el.isCurrentDayActive = true : el.isCurrentDayActive
    );
  }

  private nextMonth(): void {
    this.currentYear = (this.currentMonth === 11) ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.calendarDay = [];
    this.buildCalendar(this.currentMonth, this.currentYear);
  }

  private previousMonth(): void {
    this.currentYear = (this.currentMonth === 0) ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = (this.currentMonth === 0) ? 11 : this.currentMonth - 1;
    this.calendarDay = [];
    this.buildCalendar(this.currentMonth, this.currentYear);
  }
}
