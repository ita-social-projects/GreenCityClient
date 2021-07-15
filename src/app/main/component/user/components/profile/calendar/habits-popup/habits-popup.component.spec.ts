import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { of } from 'rxjs';
import { HabitPopupInterface } from '../habit-popup-interface';

import { HabitsPopupComponent } from './habits-popup.component';

describe('HabitsPopupComponent', () => {
  let component: HabitsPopupComponent;
  let fixture: ComponentFixture<HabitsPopupComponent>;

  const mockPopupHabits: HabitPopupInterface[] = [
    {
      enrolled: false,
      habitDescription: 'Eating local food is good for air quality and reducing environmental emissions!',
      habitId: 503,
      habitName: 'Buy local products',
    },
    {
      enrolled: true,
      habitDescription: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia',
      habitId: 506,
      habitName: 'Use less transport',
    },
  ];
  const dialogRefMock = {
    beforeClosed() {
      return of(true);
    },
    close() {
      return of(true);
    },
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitsPopupComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsPopupComponent);
    component = fixture.componentInstance;
    component.data.habits = mockPopupHabits;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
