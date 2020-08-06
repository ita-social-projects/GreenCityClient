import {WeekDays} from '../model/weekDays.model';
import {OpeningHours} from '../model/openingHours.model';
import {OpenHours} from '../model/openHours/open-hours.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeekDaysUtils {
  static sortedUTCDays = [WeekDays.SUNDAY, WeekDays.MONDAY, WeekDays.TUESDAY,
    WeekDays.WEDNESDAY, WeekDays.THURSDAY, WeekDays.FRIDAY, WeekDays.SATURDAY];
  static sortedDays = [WeekDays.MONDAY, WeekDays.TUESDAY,
    WeekDays.WEDNESDAY, WeekDays.THURSDAY, WeekDays.FRIDAY, WeekDays.SATURDAY, WeekDays.SUNDAY];

  public static getCurrentDay(): string {
    const currTime = new Date();
    return this.sortedUTCDays[currTime.getUTCDay()];
  }


  equalsToday(oh: OpeningHours): boolean {
    return WeekDaysUtils.getCurrentDay() === oh.weekDay;
  }

  showTodayOnly(openHours: OpeningHours[]): any {
    let result = '';
    openHours.forEach(oh => {
      if (WeekDaysUtils.getCurrentDay() === oh.weekDay) {
        const now = new Date();
        if (null != oh.breakTime) {
          const bStart = Number.parseInt(oh.breakTime.startTime.substr(0, 2), 10);
          const bEnd = Number.parseInt(oh.breakTime.endTime.substr(0, 2), 10);
          if (now.getHours() > bStart && now.getHours() < bEnd) {
            return result = 'Break now ' + oh.breakTime.startTime + ' - ' + oh.breakTime.endTime;
          }
        }
        const open = Number.parseInt(oh.openTime.substr(0, 2), 10);
        const close = Number.parseInt(oh.closeTime.substr(0, 2), 10);
        if (now.getHours() > open && now.getHours() < close) {
          return result = 'Open now ' + oh.openTime + ' - ' + oh.closeTime;
        }
      }
    });
    return result === '' ? result = 'Close' : result;
  }

  showBreakTime(oh: OpeningHours): any {
    if (oh.breakTime != null) {
      return 'break ' + oh.breakTime.startTime + ' - ' + oh.breakTime.endTime;
    }
    return;
  }

  sortOpenHoursList(openHours: OpeningHours[]): OpeningHours[] {
    const sortedOpenHours = [];
    WeekDaysUtils.sortedDays.forEach(day => {
      openHours.forEach(oh => {
        if (day === oh.weekDay) {
          sortedOpenHours.push(oh);
        }
      });
    });
    return sortedOpenHours;
  }

  convertHoursToShort(openHours: OpenHours[]): any {
    let result = '';
    let prevHours = '';
    let firstDay = '';
    let lastDay = '';
    openHours.forEach(hours => {
      if (prevHours === '') {
        firstDay = `${this.getWeekDayShortForm(hours.weekDay)}`;
        prevHours = `${hours.openTime}-${hours.closeTime}`;
      } else {
        if (prevHours === `${hours.openTime}-${hours.closeTime}`) {
          lastDay = ` - ${this.getWeekDayShortForm(hours.weekDay)}`;
        } else {
          result += firstDay + lastDay + ' ' + prevHours + '\n';
          prevHours = `${hours.openTime}-${hours.closeTime}`;
          firstDay = `${this.getWeekDayShortForm(hours.weekDay)}`;
          lastDay = '';
        }
      }
    });
    return result + firstDay + lastDay + ' ' + prevHours + '\n';
  }

  public getWeekDayShortForm(day: string): any {
    switch (day) {
      case 'MONDAY':
        return 'Mon';
      case 'TUESDAY':
        return 'Tue';
      case 'WEDNESDAY':
        return 'Wed';
      case 'THURSDAY':
        return 'Thu';
      case 'FRIDAY':
        return 'Fri';
      case 'SATURDAY':
        return 'Sat';
      case 'SUNDAY':
        return 'Sun';
      default :
        return day;
    }
  }
}
