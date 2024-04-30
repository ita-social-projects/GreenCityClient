import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { HabitProgressComponent } from './habit-progress.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CUSTOMFULLINFOHABIT, DEFAULTFULLINFOHABIT, DEFAULTFULLINFOHABIT_2 } from '../../mocks/habit-assigned-mock';
import { HabitCalendarComponent } from '@global-user/components/habit/add-new-habit/habit-calendar/habit-calendar.component';
import { CalendarWeekComponent } from '@global-user/components/profile/calendar/calendar-week/calendar-week.component';
import { HabitStatus } from '@global-models/habit/HabitStatus.enum';

@Pipe({ name: 'datePipe' })
class DatePipeMock implements PipeTransform {
  transform(value: Date): string {
    return '2022-02-20';
  }
}

describe('HabitProgressComponent', () => {
  let component: HabitProgressComponent;
  let fixture: ComponentFixture<HabitProgressComponent>;
  const habitAssignServiceMock = jasmine.createSpyObj('HabitAssignService', [
    'getAssignHabitsByPeriod',
    'getAssignedHabits',
    'enrollByHabit',
    'unenrollByHabit',
    'habitChangesFromCalendarSubj'
  ]);
  habitAssignServiceMock.getAssignedHabits.and.returnValue(of([]));
  habitAssignServiceMock.habitsFromDashBoard = JSON.parse(
    JSON.stringify([
      {
        enrollDate: '2022-02-10',
        habitAssigns: [
          {
            habitId: 123,
            enrolled: false
          }
        ]
      }
    ])
  );

  const fakeHabitAcquired = { ...DEFAULTFULLINFOHABIT, status: 'ACQUIRED' };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HabitProgressComponent, HabitCalendarComponent, CalendarWeekComponent, DatePipeMock],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), MatDialogModule],
      providers: [
        { provide: HabitAssignService, useValue: habitAssignServiceMock },
        { provide: DatePipe, useClass: DatePipeMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitProgressComponent);
    component = fixture.componentInstance;
    component.habit = fakeHabitAcquired as any;
    habitAssignServiceMock.habitsFromDashBoard = [];
    habitAssignServiceMock.getUserHabits = jasmine.createSpy().and.returnValue(of([]));
    habitAssignServiceMock.getAssignHabitsByPeriod = jasmine.createSpy().and.returnValue(of({}));
    habitAssignServiceMock.getAllAssignedHabbits = jasmine.createSpy().and.returnValue(of({}));
    habitAssignServiceMock.getAssignedHabits = jasmine.createSpy().and.returnValue(of([]));
    habitAssignServiceMock.habitChangesFromCalendarSubj = of({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges', () => {
    const spy = spyOn(component, 'countProgressBar');
    component.ngOnChanges();
    expect(spy).toHaveBeenCalled();
    expect(habitAssignServiceMock.habitForEdit).toEqual(component.habit);
  });

  it('ngOnInit should call updateHabitSteak and countProgressBar', () => {
    const spy1 = spyOn(component, 'updateHabitSteak');
    const spy2 = spyOn(component, 'countProgressBar');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should call isDeskWidth while ngOnInit', () => {
    const spy = spyOn(component, 'isDeskWidth');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should update habitSteak', () => {
    const spy = spyOn(component, 'countDifferenceInDays');
    component.currentDate = '2023-04-16';
    component.habit = DEFAULTFULLINFOHABIT_2 as any;
    component.updateHabitSteak({ date: '2023-04-16', isEnrolled: true });
    expect(component.habit.workingDays).toBe(3);
    expect(component.habit.habitStreak).toBe(1);
    component.updateHabitSteak({ date: '2023-04-14', isEnrolled: false });
    expect(component.habit.workingDays).toBe(2);
    expect(component.habit.habitStreak).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  describe('buildHabitDescription', () => {
    it('should set habitMark done', () => {
      component.currentDate = '2023-04-14';
      component.habit = DEFAULTFULLINFOHABIT as any;
      component.buildHabitDescription();
      expect(component.habitMark).toBe('done');
    });

    it('should set habitMark undone', () => {
      component.currentDate = '2022-04-12';
      component.habit = DEFAULTFULLINFOHABIT as any;
      component.buildHabitDescription();
      expect(component.habitMark).toBe('undone');
    });
  });

  describe('enroll', () => {
    it('makes expected calls if status is acquired', () => {
      habitAssignServiceMock.enrollByHabit.and.returnValue(of(fakeHabitAcquired));
      component.enroll();
      expect(component.habitMark).toBe('acquired');
    });

    it('makes expected on enroll call updateHabit if status is not acquired', fakeAsync(() => {
      const response = DEFAULTFULLINFOHABIT;
      response.status = HabitStatus.INPROGRESS;
      habitAssignServiceMock.enrollByHabit.and.returnValue(of(response));
      const updateHabitSpy = spyOn(component as any, 'updateHabit');
      const setGreenCircleInCalendarSpy = spyOn(component as any, 'setGreenCircleInCalendar');
      component.enroll();
      tick();
      expect(updateHabitSpy).toHaveBeenCalledWith(response);
      expect(setGreenCircleInCalendarSpy).toHaveBeenCalledWith(true);
    }));
  });

  it('should call updateHabit on un enroll', fakeAsync(() => {
    const response = DEFAULTFULLINFOHABIT;
    response.status = HabitStatus.INPROGRESS;
    habitAssignServiceMock.unenrollByHabit.and.returnValue(of(response));
    const updateHabitSpy = spyOn(component as any, 'updateHabit');
    const setGreenCircleInCalendarSpy = spyOn(component as any, 'setGreenCircleInCalendar');
    component.unenroll();
    tick();
    expect(setGreenCircleInCalendarSpy).toHaveBeenCalledWith(false);
    expect(updateHabitSpy).toHaveBeenCalledWith(response);
  }));

  it('should set values on updateHabit', () => {
    const countProgressSpy = spyOn(component, 'buildHabitDescription');
    (component as any).updateHabit(DEFAULTFULLINFOHABIT);
    expect(countProgressSpy).toHaveBeenCalled();
    expect(component.habit.habitStatusCalendarDtoList).toEqual(DEFAULTFULLINFOHABIT.habitStatusCalendarDtoList);
    expect(component.habit.workingDays).toBe(6);
    expect(component.habit.habitStreak).toBe(5);
    expect(component.isRequest).toBeFalsy();
  });

  it('should calculate the difference in days between two dates', () => {
    const date1 = '2024-02-29';
    const date2 = '2024-02-01';
    const difference = component.countDifferenceInDays(date1, date2);
    expect(difference).toBe(28);
  });

  it('should update isDesktopWidth on window resize', () => {
    const isDeskWidthSpy = spyOn(component, 'isDeskWidth').and.returnValue(true);
    window.dispatchEvent(new Event('resize'));
    expect(isDeskWidthSpy).toHaveBeenCalled();
    expect(component.isDesktopWidth).toBe(true);
  });

  it('should return correct day name', () => {
    component.habit = DEFAULTFULLINFOHABIT_2;
    let dayName = component.getDayName();
    expect(dayName).toBe('user.habit.one-habit.good-day');
    component.habit = CUSTOMFULLINFOHABIT;
    dayName = component.getDayName();
    expect(dayName).toBe('user.habit.one-habit.good-days');
  });
});
