import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HabitProgressComponent } from './habit-progress.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DEFAULTFULLINFOHABIT } from '../../mocks/habit-assigned-mock';

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
    'unenrollByHabit'
  ]);

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges', () => {
    const spy = spyOn(component, 'countProgressBar');
    component.ngOnChanges();
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

    it('makes expected calls if status is not acquired', () => {
      habitAssignServiceMock.enrollByHabit.and.returnValue(of(DEFAULTFULLINFOHABIT));
      const buildHabitDescriptionSpy = spyOn(component, 'buildHabitDescription');
      component.enroll();
      expect(buildHabitDescriptionSpy).toHaveBeenCalled();
      expect(component.habit.habitStatusCalendarDtoList).toEqual(DEFAULTFULLINFOHABIT.habitStatusCalendarDtoList);
      expect(component.isRequest).toBeFalsy();
    });
  });

  describe('unenroll', () => {
    it('makes expected calls', () => {
      habitAssignServiceMock.unenrollByHabit.and.returnValue(of(DEFAULTFULLINFOHABIT));
      const buildHabitDescriptionSpy = spyOn(component, 'buildHabitDescription');
      component.unenroll();
      expect(buildHabitDescriptionSpy).toHaveBeenCalled();
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
});
