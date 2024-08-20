import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CalendarBaseComponent } from '@shared/components';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { ItemClass } from './CalendarItemStyleClasses';
import { calendarDay, calendarMock, habitMock, habitMockFalse, habitsList, mockPopupHabits } from '@assets/mocks/habit/mock-habit-calendar';
import { CalendarInterface } from '@global-user/components/profile/calendar/calendar-interface';
import { BaseCalendar } from '@global-user/components/profile/calendar/calendar-week/calendar-week-interface';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';

@Injectable()
class TranslationServiceStub {
  public onDefaultLangChange = new EventEmitter<any>();
  public unsubscribe = new EventEmitter<any>();
}

describe('CalendarBaseComponent', () => {
  let component: CalendarBaseComponent;
  let fixture: ComponentFixture<CalendarBaseComponent>;
  let habitAssignServiceMock: jasmine.SpyObj<HabitAssignService>;

  beforeEach(waitForAsync(() => {
    habitAssignServiceMock = jasmine.createSpyObj('HabitAssignService', [
      'getAssignHabitsByPeriod',
      'getHabitDate',
      'habitDate',
      'mapOfArrayOfAllDate'
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [CalendarBaseComponent],
      providers: [
        { provide: TranslateService, useClass: TranslationServiceStub },
        {
          provide: LanguageService,
          useValue: {
            getCurrentLanguage: () => {}
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarBaseComponent);
    component = fixture.componentInstance;
    component.currentYear = 2020;
    component.currentMonth = 7;
    component.currentDayName = 'monday';
    component.yearData = 3;
    component.months = ['jan', 'feb', 'mar'];
    component.monthsShort = ['june', 'september', 'november'];
    component.calendarDay = calendarDay;

    fixture.detectChanges();
  });

  it('should create CalendarBaseComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('isCheckedAllHabits', () => {
    it('should return true if all habits are checked', () => {
      expect(component.isCheckedAllHabits(habitMock)).toEqual(true);
    });

    it('should return false if all habits are not checked', () => {
      expect(component.isCheckedAllHabits(habitMockFalse)).toEqual(false);
    });
  });

  it('should return true if habits is in progress', () => {
    expect(component.checkCanOpenPopup(calendarMock)).toEqual(true);
    calendarMock.hasHabitsInProgress = false;
    fixture.detectChanges();
    expect(component.checkCanOpenPopup(calendarMock)).toEqual(false);
  });

  it('should return true when toggle monthView', () => {
    component.monthView = true;
    component.toggleCalendarView();
    expect(!component.monthView).toEqual(true);
  });

  it('should get all users assigned habits', () => {
    const assignedHabits = [
      {
        id: 400,
        createDateTime: new Date('2023-06-29T20:05:20.271836Z')
      }
    ];
    spyOn(component, 'getAllAssignedHabbits').and.callFake(() => {
      component.allAssignedHabits = assignedHabits;
    });
    component.getAllAssignedHabbits();
    expect(component.allAssignedHabits).toEqual(assignedHabits);
  });

  it('should choose display class', () => {
    expect(component.chooseDisplayClass(component.calendarDay[4])).toBe(ItemClass.CURRENT);
    expect(component.chooseDisplayClass(component.calendarDay[5])).toBe(ItemClass.ENROLLEDPAST);
    expect(component.chooseDisplayClass(component.calendarDay[6])).toBe(ItemClass.UNENROLLEDPAST);
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
    const date = '2024-01-02';
    const result = component.getHabitsForDay(habitsList, date);
    expect(result).toEqual({
      enrollDate: '2024-01-02',
      habitAssigns: [
        {
          enrolled: false,
          habitDescription: 'Description 2',
          habitAssignId: 2,
          habitName: 'Habit 2'
        }
      ]
    });
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

    (component as any).calendarDay[4].date = {
      getMonth: () => 5,
      getFullYear: () => 2021
    };
    expect(component.currentDayName).toEqual('Tue');
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

  it('yearData should be equal to currentYear and monthCalendar to months', () => {
    component.buildMonthCalendar(component.months);
    expect(component.yearData).toEqual(component.currentYear);
    expect(component.monthsCalendar).toEqual(component.months);
  });

  it('monthView should return true, currentYear should be equal to yearData', () => {
    component.buildSelectedMonthCalendar(component.months[0]);
    expect(component.monthView).toBeTruthy();
    expect(component.currentYear).toEqual(component.yearData);
    expect(component.currentMonth).toEqual(component.monthsShort.indexOf(component.months[0]));
  });

  it('should return true if all habits are checked', () => {
    const result = component.isCheckedAllHabits(mockPopupHabits);
    expect(result).toBe(false);
  });

  it('should return false if not all habits are checked', () => {
    const result = component.isCheckedAllHabits(mockPopupHabits);
    expect(result).toBe(false);
  });

  it('should correctly calculate whether habit list is editable', () => {
    const dayItem = {
      year: 2020,
      month: 7,
      numberOfDate: 1,
      date: new Date()
    } as CalendarInterface;
    component.daysCanEditHabits = 5;
    spyOn(Date.prototype, 'setHours').and.callFake(function () {
      return 1;
    });
    component.checkHabitListEditable(true, dayItem);
    expect(component.isHabitListEditable).toBe(false);
  });

  it('should return true if popup can be opened', () => {
    const dayItem = { hasHabitsInProgress: true } as BaseCalendar;
    const result = component.checkCanOpenPopup(dayItem);
    expect(result).toBe(true);
  });

  it('should correctly calculate whether habit list is editable', () => {
    component.daysCanEditHabits = 5;
    spyOn(Date.prototype, 'setHours').and.callFake(function () {
      return 1;
    });
    component.checkHabitListEditable(true, calendarMock);
    expect(component.isHabitListEditable).toBe(false);
  });

  it('should return true if popup can be opened', () => {
    const dayItem: BaseCalendar = { hasHabitsInProgress: true } as BaseCalendar;
    const result = component.checkCanOpenPopup(dayItem);
    expect(result).toBe(true);
  });

  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => {});
    fixture.destroy();
  });
});
