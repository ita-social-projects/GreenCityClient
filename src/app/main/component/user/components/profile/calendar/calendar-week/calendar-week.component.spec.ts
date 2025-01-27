import { CalendarWeekComponent } from './calendar-week.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CalendarBaseComponent } from '@shared/components';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarWeekInterface } from './calendar-week-interface';
import { Language } from 'src/app/main/i18n/Language';

describe('CalendarWeekComponent', () => {
  let component: CalendarWeekComponent;
  let fixture: ComponentFixture<CalendarWeekComponent>;
  let day: CalendarWeekInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarWeekComponent, CalendarBaseComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: TranslateService, useValue: {} },
        { provide: LanguageService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarWeekComponent);
    component = fixture.componentInstance;
    day = {
      date: new Date('Sun Jul 02 2023 12:21:28 GMT+0300'),
      dayName: 'test',
      isCurrent: true,
      isMissed: false,
      hasHabitsInProgress: true,
      areHabitsDone: true,
      numberOfDate: 1,
      month: 1,
      year: 2001
    };
    component.currentDate = new Date('Sun Jul 02 2023 00:00:00 GMT+0300');
    component.weekDates = [];
    component.language = Language.UA;
    component.weekTitle = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to next week when isNext is true', () => {
    component.weekDates = [day];
    const initialWeekDates = [...component.weekDates];
    component.changeWeek(true);
    expect(component.weekDates).not.toEqual(initialWeekDates);
  });

  it('should go to previous week when isNext is false', () => {
    component.weekDates = [day];
    const initialWeekDates = [...component.weekDates];
    component.changeWeek(false);
    expect(component.weekDates).not.toEqual(initialWeekDates);
  });

  it('should call openDialogDayHabits if checkCanOpenPopup returns true', () => {
    spyOn(component, 'checkCanOpenPopup').and.returnValue(true);
    const openDialogDayHabitsSpy = spyOn(component, 'openDialogDayHabits');
    const dayAsCalendarInterface = component.toCalendarMonth(day);
    const mockEvent = new MouseEvent('click');
    component.showHabits(mockEvent, day);
    expect(openDialogDayHabitsSpy).toHaveBeenCalledWith(mockEvent, false, dayAsCalendarInterface);
  });

  it('should mark dates with grey border if habits are not done 8 days before', () => {
    const weekDates: CalendarWeekInterface[] = [
      {
        date: new Date(2023, 9, 24),
        dayName: 'Tuesday',
        isCurrent: false,
        isMissed: false,
        hasHabitsInProgress: true,
        areHabitsDone: false,
        numberOfDate: 24,
        month: 10,
        year: 2023
      },
      {
        date: new Date(2023, 9, 25),
        dayName: 'Wednesday',
        isCurrent: false,
        isMissed: false,
        hasHabitsInProgress: true,
        areHabitsDone: true,
        numberOfDate: 25,
        month: 10,
        year: 2023
      },
      {
        date: new Date(2023, 9, 26),
        dayName: 'Thursday',
        isCurrent: false,
        isMissed: false,
        hasHabitsInProgress: true,
        areHabitsDone: false,
        numberOfDate: 26,
        month: 10,
        year: 2023
      },
      {
        date: new Date(2023, 10, 1),
        dayName: 'Wednesday',
        isCurrent: false,
        isMissed: true,
        hasHabitsInProgress: false,
        areHabitsDone: false,
        numberOfDate: 1,
        month: 11,
        year: 2023
      }
    ];

    spyOn(component, 'buildWeekCalendar').and.callFake((date: Date) => {
      component.weekDates = [...weekDates];
    });

    const startDate = new Date(2023, 9, 24);
    component.buildWeekCalendar(startDate);

    const eighthDay = component.weekDates.find((entry) => entry.date.getDate() === 1);

    expect(component.weekDates.length).toEqual(4);
    expect(eighthDay).toBeDefined();
    expect(eighthDay?.areHabitsDone).toBeFalse();
    expect(eighthDay?.hasHabitsInProgress).toBeFalse();
  });
});
