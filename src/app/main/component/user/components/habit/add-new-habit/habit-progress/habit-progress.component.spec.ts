import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HabitProgressComponent } from './habit-progress.component';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { HabitAssignInterface } from 'src/app/main/interface/habit/habit-assign.interface';

describe('HabitProgressComponent', () => {
  let component: HabitProgressComponent;
  let fixture: ComponentFixture<HabitProgressComponent>;
  const habitAssignServiceMock = jasmine.createSpyObj('HabitAssignService', [
    'getAssignHabitsByPeriod',
    'enrollByHabit',
    'unenrollByHabit'
  ]);

  const fakeHabitStatusCalendarList = {
    enrollDate: '2022-06-19',
    id: 333
  };

  const fakeHabitAcquired = {
    id: 333,
    status: 'ACQUIRED',
    habit: {
      id: 333,
      habitTranslation: {
        name: 'fakeName'
      }
    },
    duration: 44,
    workingDays: 3,
    habitStreak: 2,
    habitStatusCalendarDtoList: [fakeHabitStatusCalendarList]
  };

  const fakeHabitInProgress = {
    id: 333,
    status: 'INPROGRESS',
    createDateTime: new Date('2021-06-19'),
    duration: 10,
    habit: {
      id: 321,
      defaultDuration: 14,
      habitTranslation: {
        name: 'fakeName',
        description: 'Test',
        habitItem: 'Test',
        languageCode: 'en'
      },
      image: '',
      tags: []
    },
    habitStreak: 5,
    lastEnrollmentDate: new Date('2021-06-19'),
    userId: 333,
    workingDays: 4,
    habitStatusCalendarDtoList: [fakeHabitStatusCalendarList]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitProgressComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), MatDialogModule],
      providers: [{ provide: HabitAssignService, useValue: habitAssignServiceMock }]
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
    it('makes expected calls if status is inprogress and habit doest have not the current date equals to registration date', () => {
      component.currentDate = '2022-06-19';
      component.habit = fakeHabitInProgress as any;
      component.buildHabitDescription();
      expect(component.daysCounter).toBe(4);
      expect(component.showPhoto).toBe(false);
      expect(component.habitMark).toBe('done');
    });

    it('makes expected calls if status is inprogress and habit doest have not the current date equals to registration date', () => {
      component.currentDate = '2022-02-19';
      component.habit = fakeHabitInProgress as any;
      component.buildHabitDescription();
      expect(component.daysCounter).toBe(4);
      expect(component.showPhoto).toBe(true);
      expect(component.habitMark).toBe('undone');
    });
  });

  describe('enroll', () => {
    it('makes expected calls if status is acquired', () => {
      habitAssignServiceMock.enrollByHabit.and.returnValue(of(fakeHabitAcquired));
      component.enroll();
      expect(component.daysCounter).toBe(44);
      expect(component.showPhoto).toBeFalsy();
      expect(component.habitMark).toBe('aquired');
    });

    it('makes expected calls if status is not acquired', () => {
      habitAssignServiceMock.enrollByHabit.and.returnValue(of(fakeHabitInProgress));
      const buildHabitDescriptionSpy = spyOn(component, 'buildHabitDescription');
      component.enroll();
      expect(buildHabitDescriptionSpy).toHaveBeenCalled();
      expect(component.habit.habitStatusCalendarDtoList).toEqual([fakeHabitStatusCalendarList]);
      expect(component.habit.workingDays).toBe(4);
      expect(component.habit.habitStreak).toBe(5);
      expect(component.isRequest).toBeFalsy();
    });
  });

  describe('unenroll', () => {
    it('makes expected calls', () => {
      habitAssignServiceMock.unenrollByHabit.and.returnValue(of(fakeHabitInProgress));
      const buildHabitDescriptionSpy = spyOn(component, 'buildHabitDescription');
      component.unenroll();
      expect(buildHabitDescriptionSpy).toHaveBeenCalled();
      expect(component.habit.habitStatusCalendarDtoList).toEqual([fakeHabitStatusCalendarList]);
      expect(component.habit.workingDays).toBe(4);
      expect(component.habit.habitStreak).toBe(5);
      expect(component.isRequest).toBeFalsy();
    });

    it('should get right description for one day in row on getDayName', () => {
      const value = component.getDayName(1);
      expect(value).toBe('user.habit.one-habit.good-day');
    });

    it('should get right description for days in row on getDayName', () => {
      const value = component.getDayName(2);
      expect(value).toBe('user.habit.one-habit.good-days');
    });
  });
});
