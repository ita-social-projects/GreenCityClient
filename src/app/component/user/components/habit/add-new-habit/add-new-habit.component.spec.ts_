import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AddNewHabitComponent } from './add-new-habit.component';
import { HabitCalendarComponent } from './habit-calendar/habit-calendar.component';
import { HabitDurationComponent } from './habit-duration/habit-duration.component';
import { HabitEditShoppingListComponent } from './habit-edit-shopping-list/habit-edit-shopping-list.component';
import { HabitInviteFriendsComponent } from './habit-invite-friends/habit-invite-friends.component';
import { HabitProgressComponent } from './habit-progress/habit-progress.component';

describe('AddNewHabitComponent', () => {
  let component: AddNewHabitComponent;
  let fixture: ComponentFixture<AddNewHabitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewHabitComponent, HabitDurationComponent, HabitProgressComponent,
        HabitInviteFriendsComponent, HabitEditShoppingListComponent, HabitCalendarComponent],
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
