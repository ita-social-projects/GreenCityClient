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
  let habitAssignServiceMock: HabitAssignService;
  /*const habitAssignServiceMock = jasmine.createSpyObj('HabitAssignService', [
    'getAssignHabitsByPeriod',
    'enrollByHabit',
    'unenrollByHabit'
  ]); /** */

  let habitMock: HabitAssignInterface;
  habitMock = {
    id: 333,
    status: 'INPROGRESS',
    createDateTime: new Date('2021-06-19'),
    duration: 10,
    habit: {
      defaultDuration: 14,
      habitTranslation: {
        description: 'Test',
        habitItem: 'Test',
        languageCode: 'en',
        name: 'Test'
      },
      id: 506,
      image: '',
      tags: []
    },
    habitStatusCalendarDtoList: [],
    habitStreak: 0,
    lastEnrollmentDate: new Date('2021-06-19'),
    userId: 333,
    workingDays: 1,
    shoppingListItems: []
  };

  const fakeHabitStatusCalendarList = {
    enrollDate: '2022-02-19',
    id: 123
  };

  const fakeHabitAssign = {
    id: 123,
    status: 'ACQUIRED',
    habit: {
      id: 123,
      habitTranslation: {
        name: 'fakeName'
      }
    },
    duration: 44,
    workingDays: 3,
    habitStreak: 2,
    habitStatusCalendarDtoList: [fakeHabitStatusCalendarList]
  };

  const fakeHabit = {
    id: 321,
    habitTranslation: {
      name: 'fakeName'
    }
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('countProgressBar', () => {
    component.habit = habitMock;
    component.countProgressBar();
    expect(component.indicator).toEqual(10);
  });

  it('ngOnChanges', () => {
    const spy = spyOn(component, 'countProgressBar');
    component.ngOnChanges();
    expect(spy).toHaveBeenCalled();
  });

  describe('buildHabitDescription', () => {
    it('makes expected calls if status is INPROGRESS and a habit has the current date is not equal to the registration date', () => {
      component.currentDate = '2022-02-19';
      component.habit = habitMock as any;
      component.buildHabitDescription();
      expect(component.daysCounter).toBe(1);
      expect(component.showPhoto).toBe(true);
      expect(component.habitMark).toBe('undone');
    });

    it('//makes expected calls if status is INPROGRESS and a habit has the current date is equal to the registration date', () => {
      component.currentDate = '2022-02-19';
      component.habit = fakeHabitAssign as any;
      component.buildHabitDescription();
      expect(component.daysCounter).toBe(44);
      expect(component.showPhoto).toBe(false);
      expect(component.habitMark).toBe('aquired');
    });

    it('makes expected calls if status is AQUIRED', () => {
      component.currentDate = '2022-02-20';
      component.habit = fakeHabitAssign as any;
      component.buildHabitDescription();
      expect(component.daysCounter).toBe(44);
      expect(component.showPhoto).toBe(false);
      expect(component.habitMark).toBe('aquired');
    });
  });
});
