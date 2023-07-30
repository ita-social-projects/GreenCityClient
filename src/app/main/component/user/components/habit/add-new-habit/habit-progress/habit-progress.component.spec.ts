import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitProgressComponent } from './habit-progress.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DEFAULTFULLINFOHABIT, DEFAULTFULLINFOHABIT_2 } from '../../mocks/habit-assigned-mock';

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
    'enrollByHabit',
    'unenrollByHabit',
    'habitChangesFromCalendarSubj'
  ]);
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitProgressComponent],
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
    habitAssignServiceMock.getAssignHabitsByPeriod.and.returnValue(of());
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

    it('makes expected on enroll call updateHabit if status is not acquired', () => {
      habitAssignServiceMock.enrollByHabit.and.returnValue(of(DEFAULTFULLINFOHABIT));
      const spy = spyOn(component as any, 'updateHabit');
      component.enroll();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('shoud call updateHabit on unenroll', () => {
    habitAssignServiceMock.unenrollByHabit.and.returnValue(of(DEFAULTFULLINFOHABIT));
    const spy = spyOn(component as any, 'updateHabit');
    component.unenroll();
    expect(spy).toHaveBeenCalled();
  });

  it('should set values on updateHabit', () => {
    const countProgressSpy = spyOn(component, 'buildHabitDescription');
    (component as any).updateHabit(DEFAULTFULLINFOHABIT);
    expect(countProgressSpy).toHaveBeenCalled();
    expect(component.habit.habitStatusCalendarDtoList).toEqual(DEFAULTFULLINFOHABIT.habitStatusCalendarDtoList);
    expect(component.habit.workingDays).toBe(6);
    expect(component.habit.habitStreak).toBe(5);
    expect(component.isRequest).toBeFalsy();
  });

  it('should get right description for one day in row on getDayName', () => {
    component.habit.habitStreak = 1;
    const value = component.getDayName();
    expect(value).toBe('user.habit.one-habit.good-day');
  });

  it('should get right description for days in row on getDayName', () => {
    component.habit.habitStreak = 2;
    const value = component.getDayName();
    expect(value).toBe('user.habit.one-habit.good-days');
  });
});
