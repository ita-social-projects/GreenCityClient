import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { HabitPopupInterface } from '../habit-popup-interface';

import { HabitsPopupComponent } from './habits-popup.component';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'datePipe' })
class DatePipeMock implements PipeTransform {
  transform(value: Date): string {
    return '2023-02-14';
  }
}

describe('HabitsPopupComponent', () => {
  let component: HabitsPopupComponent;
  let fixture: ComponentFixture<HabitsPopupComponent>;

  const mockPopupHabits: HabitPopupInterface[] = [
    {
      enrolled: false,
      habitDescription: 'Eating local food is good for air quality and reducing environmental emissions!',
      habitAssignId: 503,
      habitName: 'Buy local products'
    },
    {
      enrolled: true,
      habitDescription: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia',
      habitAssignId: 506,
      habitName: 'Use less transport'
    }
  ];
  const mockData = {
    habitsCalendarSelectedDate: '2022-02-20',
    isHabitListEditable: true,
    habits: mockPopupHabits
  };
  const habitAssignServiceMock = jasmine.createSpyObj('HabitAssignService', ['assignHabit']);
  habitAssignServiceMock.assignHabit = () => new Observable();
  const dialogRefMock = jasmine.createSpyObj('dialogRef', ['close', 'beforeClosed']);
  dialogRefMock.beforeClosed.and.returnValue(of(true));
  const languageServiceMock = jasmine.createSpyObj('languageService', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [HabitsPopupComponent],
      providers: [
        { provide: DatePipe, useClass: DatePipeMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: HabitAssignService, useValue: habitAssignServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('language', 'ua');
    fixture = TestBed.createComponent(HabitsPopupComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create HabitsPopupComponent', () => {
    expect(component).toBeTruthy();
  });

  it('makes expected calls in loadPopup', () => {
    spyOn(component, 'formatSelectedDate').and.returnValue('02 20 2022');
    component.loadPopup();
    expect(component.language).toBe('ua');
    expect(component.habitsCalendarSelectedDate).toBe('2022-02-20');
    expect(component.isHabitListEditable).toBeTruthy();
    expect(component.popupHabits).toEqual(mockPopupHabits);
    expect(component.today).toBe('02 20 2022');
  });

  it('makes expected calls in closePopup', () => {
    component.closePopup();
    expect(dialogRefMock.close).toHaveBeenCalledWith(mockPopupHabits);
  });

  it('makes expected calls in toggleEnrollHabit', () => {
    component.popupHabits = JSON.parse(JSON.stringify(mockPopupHabits));
    const setCircleFromPopUpToCardsSpy = spyOn(component, 'setCircleFromPopUpToCards');
    component.toggleEnrollHabit(503);
    expect(setCircleFromPopUpToCardsSpy).toHaveBeenCalledWith(503, true);
    expect(component.popupHabits[0].enrolled).toBeTruthy();
  });

  describe('setWorkingDaysForVisibleHabit', () => {
    it('makes expected calls when enrolled is true and id 1', () => {
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2, workingDays: 5 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, workingDays: 3 }];
      component.setWorkingDaysForVisibleHabit(true, 1);
      expect(habitAssignServiceMock.habitsInProgress[0].workingDays).toBe(4);
    });

    it('makes expected calls when enrolled is false and id 1', () => {
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2, workingDays: 5 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, workingDays: 3 }];
      component.setWorkingDaysForVisibleHabit(false, 1);
      expect(habitAssignServiceMock.habitsInProgress[0].workingDays).toBe(2);
    });

    it('makes expected calls when enrolled is true and id 2', () => {
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2, workingDays: 5 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, workingDays: 3 }];
      component.setWorkingDaysForVisibleHabit(true, 2);
      expect(habitAssignServiceMock.habitsInProgressToView[0].workingDays).toBe(6);
    });

    it('makes expected calls when enrolled is false and id 2', () => {
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2, workingDays: 5 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, workingDays: 3 }];
      component.setWorkingDaysForVisibleHabit(false, 2);
      expect(habitAssignServiceMock.habitsInProgressToView[0].workingDays).toBe(4);
    });
  });

  describe('updateHabitsCardsCircleAndStreak', () => {
    it('makes expected calls when isExistArray and ifValueNumber are not undefined', () => {
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2, habitStreak: 5, habitStatusCalendarDtoList: 4 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, habitStreak: 8, habitStatusCalendarDtoList: 4 }];
      component.updateHabitsCardsCircleAndStreak(2, mockPopupHabits, 3);
      expect(habitAssignServiceMock.habitsInProgressToView[0].habitStreak).toBe(3);
    });

    it('makes expected calls when isExistArray is not undefined and ifValueNumber is undefined', () => {
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2, habitStreak: 5, habitStatusCalendarDtoList: 4 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, habitStreak: 3, habitStatusCalendarDtoList: 4 }];
      component.updateHabitsCardsCircleAndStreak(2, mockPopupHabits, undefined);
      expect(habitAssignServiceMock.habitsInProgressToView[0].habitStatusCalendarDtoList).toBe(undefined);
    });

    it('makes expected calls when isExistArray is undefined and ifValueNumber is not undefined', () => {
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2, habitStreak: 5, habitStatusCalendarDtoList: 4 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, habitStreak: 4, habitStatusCalendarDtoList: 4 }];
      component.updateHabitsCardsCircleAndStreak(1, undefined, 3);
      expect(habitAssignServiceMock.habitsInProgress[0].habitStreak).toBe(3);
    });

    it('makes expected calls when isExistArray and ifValueNumber are undefined', () => {
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2, habitStreak: 5, habitStatusCalendarDtoList: 4 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, habitStreak: 3, habitStatusCalendarDtoList: 4 }];
      component.updateHabitsCardsCircleAndStreak(1, undefined, undefined);
      expect(habitAssignServiceMock.habitsInProgress[0].habitStatusCalendarDtoList).toBe(undefined);
    });
  });

  describe('setCircleFromPopUpToCards', () => {
    it('makes expected calls when is enrolled', () => {
      component.habitsCalendarSelectedDate = '2022-02-19';
      component.today = '2022-02-19';
      const setWorkingDaysForVisibleHabitSpy = spyOn(component, 'setWorkingDaysForVisibleHabit');
      const updateHabitsCardsCircleAndStreakSpy = spyOn(component, 'updateHabitsCardsCircleAndStreak');
      const setHabitStreakSpy = spyOn(component, 'setHabitStreak');
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, habitStatusCalendarDtoList: [] }];
      component.setCircleFromPopUpToCards(1, true);
      expect(setWorkingDaysForVisibleHabitSpy).toHaveBeenCalledWith(true, 1);
      expect(updateHabitsCardsCircleAndStreakSpy).toHaveBeenCalled();
      expect(setHabitStreakSpy).toHaveBeenCalled();
      expect(component.arrayOfDate).toEqual([{ enrollDate: '2023-02-14', id: null }]);
    });

    it('makes expected calls when is not enrolled', () => {
      component.habitsCalendarSelectedDate = '2022-02-19';
      component.today = '2022-02-19';
      const setWorkingDaysForVisibleHabitSpy = spyOn(component, 'setWorkingDaysForVisibleHabit');
      const updateHabitsCardsCircleAndStreakSpy = spyOn(component, 'updateHabitsCardsCircleAndStreak');
      const setHabitStreakSpy = spyOn(component, 'setHabitStreak');
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2 }];
      habitAssignServiceMock.habitsInProgress = [
        {
          id: 1,
          habitStatusCalendarDtoList: [{ enrollDate: '2022-02-20', id: null }]
        }
      ];
      component.setCircleFromPopUpToCards(1, false);
      expect(setWorkingDaysForVisibleHabitSpy).toHaveBeenCalledWith(false, 1);
      expect(updateHabitsCardsCircleAndStreakSpy).toHaveBeenCalled();
      expect(setHabitStreakSpy).toHaveBeenCalled();
      expect(component.arrayOfDate).toEqual([{ enrollDate: '2022-02-20', id: null }]);
    });

    it('makes expected calls when habitsCalendarSelectedDate is not today', () => {
      component.habitsCalendarSelectedDate = '2022-02-19';
      component.today = '2022-02-20';
      const setWorkingDaysForVisibleHabitSpy = spyOn(component, 'setWorkingDaysForVisibleHabit');
      const updateHabitsCardsCircleAndStreakSpy = spyOn(component, 'updateHabitsCardsCircleAndStreak');
      const setHabitStreakSpy = spyOn(component, 'setHabitStreak');
      habitAssignServiceMock.habitsInProgressToView = [{ id: 2 }];
      habitAssignServiceMock.habitsInProgress = [{ id: 1, habitStatusCalendarDtoList: [] }];
      component.setCircleFromPopUpToCards(1, false);
      expect(setWorkingDaysForVisibleHabitSpy).toHaveBeenCalledWith(false, 1);
      expect(updateHabitsCardsCircleAndStreakSpy).not.toHaveBeenCalled();
      expect(setHabitStreakSpy).toHaveBeenCalled();
      expect(component.arrayOfDate).toEqual([]);
    });
  });
});
