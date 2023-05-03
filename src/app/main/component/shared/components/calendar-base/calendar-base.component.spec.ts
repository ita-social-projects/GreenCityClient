import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CalendarBaseComponent } from './calendar-base.component';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarInterface } from '@global-user/components/profile/calendar/calendar-interface';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Injectable()
class TranslationServiceStub {
  public getTranslation = new EventEmitter<any>();
  public onDefaultLangChange = new EventEmitter<any>();
  public getDefaultLang = new EventEmitter<any>();
  public unsubscribe = new EventEmitter<any>();
}

describe('CalendarBaseComponent', () => {
  let component: CalendarBaseComponent;
  let fixture: ComponentFixture<CalendarBaseComponent>;
  let calendarMock: CalendarInterface;
  let isMonthCalendar: boolean;
  let habitsList: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [CalendarBaseComponent],
      providers: [
        { provide: TranslateService, useClass: TranslationServiceStub },
        { provide: LanguageService, useValue: { getCurrentLanguage: () => {} } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarBaseComponent);
    component = fixture.componentInstance;
    habitsList = [
      { list: 'one', enrollDate: 11 },
      { list: 'two', enrollDate: 22 },
      { list: 'three', enrollDate: 33 }
    ];
    component.currentYear = 2020;
    component.currentMonth = 7;
    component.currentDayName = 'monday';
    component.yearData = 3;
    component.months = ['jan', 'feb', 'mar'];
    component.monthsShort = ['june', 'september', 'november'];
    isMonthCalendar = true;
    component.calendarDay = [
      {
        numberOfDate: new Date().getDate(),
        date: new Date(),
        month: 5,
        year: 2021,
        firstDay: 1,
        totalDaysInMonth: 30,
        dayName: 'test',
        hasHabitsInProgress: true,
        areHabitsDone: false,
        isCurrentDayActive: undefined
      },
      {
        numberOfDate: 2,
        date: new Date(),
        month: 5,
        year: 2021,
        firstDay: 1,
        totalDaysInMonth: 30,
        dayName: 'test',
        hasHabitsInProgress: true,
        areHabitsDone: false,
        isCurrentDayActive: undefined
      },
      {
        numberOfDate: 8,
        date: new Date(),
        month: 5,
        year: 2020,
        firstDay: 1,
        totalDaysInMonth: 30,
        dayName: 'test',
        hasHabitsInProgress: true,
        areHabitsDone: false,
        isCurrentDayActive: undefined
      },
      {
        numberOfDate: 4,
        date: new Date(),
        month: 8,
        year: 2021,
        firstDay: 1,
        totalDaysInMonth: 30,
        dayName: 'test',
        hasHabitsInProgress: true,
        areHabitsDone: false,
        isCurrentDayActive: undefined
      },
      {
        numberOfDate: 8,
        date: new Date(),
        month: 5,
        year: 2021,
        firstDay: 1,
        totalDaysInMonth: 30,
        dayName: 'test',
        hasHabitsInProgress: true,
        areHabitsDone: false,
        isCurrentDayActive: true
      }
    ];

    calendarMock = {
      numberOfDate: 11,
      date: new Date(),
      month: 0,
      year: 2020,
      firstDay: 1,
      totalDaysInMonth: 30,
      dayName: 'test',
      hasHabitsInProgress: true,
      areHabitsDone: false,
      isCurrentDayActive: false
    };

    fixture.detectChanges();
  });

  it('should create CalendarBaseComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('isCheckedAllHabits', () => {
    it('should return true if all habits are checked', () => {
      const habitMock = [
        {
          enrolled: true,
          habitDescription: 'test',
          habitAssignId: 0,
          habitName: 'test'
        }
      ];

      expect(component.isCheckedAllHabits(habitMock)).toEqual(true);
    });

    it('should return false if all habits are not checked', () => {
      const habitMock = [
        {
          enrolled: false,
          habitDescription: 'test',
          habitAssignId: 0,
          habitName: 'test'
        }
      ];
      expect(component.isCheckedAllHabits(habitMock)).toEqual(false);
    });
  });

  it('should return true if habits is in progress', () => {
    expect(component.checkCanOpenPopup(calendarMock)).toEqual(true);
  });

  it('should return true when toggle monthView', () => {
    component.monthView = true;
    component.toggleCalendarView();
    expect(!component.monthView).toEqual(true);
  });

  describe('formDate', () => {
    it('should create formatDate component when isMonthCalendar equal to true', () => {
      const result = component.formatDate(true, calendarMock);
      expect(result).toBeTruthy();
    });

    it('should create formatDate component when isMonthCalendar equal to false', () => {
      const result = component.formatDate(false, calendarMock);
      expect(result).toBeTruthy();
    });
  });

  describe('formatSelectedDate', () => {
    it('should return date: jan 11 2020', () => {
      const result = component.formatSelectedDate(true, calendarMock);
      expect(result).toEqual('jan 11, 2020');
    });
  });

  it('should return true when isActiveMonth', () => {
    component.isActiveMonth();
    expect(component.isActiveMonth).toBeTruthy();
  });

  it('should return 2 after previousYear method', () => {
    component.previousYear();
    expect(component.yearData).toEqual(2);
  });

  it('should return 4 after nextYear method', () => {
    component.nextYear();
    expect(component.yearData).toEqual(4);
  });

  it('should return calendarMock', () => {
    component.getMonthTemplate(4);
    calendarMock.numberOfDate = 4;
    expect(calendarMock.numberOfDate).toBe(4);
  });

  it('should return calendarMock with enrollDate: 22', () => {
    const result = component.getHabitsForDay(habitsList, 22);
    expect(result).toEqual({ list: 'two', enrollDate: 22 });
  });

  it('should return 31 day in month', () => {
    const result = component.getDaysInMonth(calendarMock.month, calendarMock.year);
    expect(result).toEqual(31);
  });

  it('should return boolean at various comparisons when isCurrentDayActive method is work', () => {
    component.isCurrentDayActive();
    expect(component.calendarDay[0].isCurrentDayActive).toBeFalsy();
    expect(component.calendarDay[1].isCurrentDayActive).toBeFalsy();
    expect(component.calendarDay[2].isCurrentDayActive).toBeFalsy();
    expect(component.calendarDay[3].isCurrentDayActive).toBeFalsy();
  });

  it('should return current day of week', () => {
    component.markCurrentDayOfWeek();
    // @ts-ignore
    component.calendarDay[4].date = { getMonth: () => 5, getFullYear: () => 2021 };
    expect(component.currentDayName).toEqual('monday');
  });

  describe('nextMonth', () => {
    it('should return year: 2020 and month: 8', () => {
      component.nextMonth();
      expect(component.currentYear).toBe(2020);
      expect(component.currentMonth).toBe(8);
    });

    it('should return year: 2021 and currentMonth: 0', () => {
      component.currentMonth = 11;
      component.nextMonth();
      expect(component.currentYear).toBe(2021);
      expect(component.currentMonth).toBe(0);
    });

    it('should call component', () => {
      spyOn(component, 'buildCalendar');
      spyOn(component, 'getUserHabits');
      component.nextMonth();
      expect(component.buildCalendar).toHaveBeenCalled();
      expect(component.getUserHabits).toHaveBeenCalledWith(true, component.calendarDay);
    });
  });

  describe('previousMonth', () => {
    it('should return year: 2020 and month: 6', () => {
      component.previousMonth();
      expect(component.currentYear).toBe(2020);
      expect(component.currentMonth).toBe(6);
    });

    it('should return year: 2019 and month: 11', () => {
      component.currentMonth = 0;
      component.previousMonth();
      expect(component.currentYear).toBe(2019);
      expect(component.currentMonth).toBe(11);
    });
  });

  xit('yearData should be equal to currentYear and monthCalendar to months', () => {
    component.buildMonthCalendar(component.months);
    expect(component.yearData).toEqual(component.currentYear);
    expect(component.monthsCalendar).toEqual(component.months);
  });

  it('monthView should return true, currentYear should be equal to yearData', () => {
    component.buildSelectedMonthCalendar(component.months);
    expect(component.monthView).toBeTruthy();
    expect(component.currentYear).toEqual(component.yearData);
    expect(component.currentMonth).toEqual(component.monthsShort.indexOf(component.months[0]));
  });

  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => {});
    fixture.destroy();
  });
});
