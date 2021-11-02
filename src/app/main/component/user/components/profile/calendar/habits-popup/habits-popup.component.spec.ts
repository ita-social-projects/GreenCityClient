import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { HabitPopupInterface } from '../habit-popup-interface';

import { HabitsPopupComponent } from './habits-popup.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { TranslateModule } from '@ngx-translate/core';

describe('HabitsPopupComponent', () => {
  let component: HabitsPopupComponent;
  let fixture: ComponentFixture<HabitsPopupComponent>;

  const mockPopupHabits: HabitPopupInterface[] = [
    {
      enrolled: false,
      habitDescription: 'Eating local food is good for air quality and reducing environmental emissions!',
      habitId: 503,
      habitName: 'Buy local products'
    },
    {
      enrolled: true,
      habitDescription: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia',
      habitId: 506,
      habitName: 'Use less transport'
    }
  ];
  let habitAssignServiceMock: HabitAssignService;
  habitAssignServiceMock = jasmine.createSpyObj('HabitAssignService', ['assignHabit']);
  habitAssignServiceMock.assignHabit = () => new Observable();
  const dialogRefMock = {
    beforeClosed() {
      return of(true);
    },
    close() {
      return of(true);
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [HabitsPopupComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: HabitAssignService, useValue: habitAssignServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('language', 'ua');
    fixture = TestBed.createComponent(HabitsPopupComponent);
    component = fixture.componentInstance;
    component.data.habits = mockPopupHabits;
    fixture.detectChanges();
  });

  it('should create HabitsPopupComponent', () => {
    expect(component).toBeTruthy();
  });
});
