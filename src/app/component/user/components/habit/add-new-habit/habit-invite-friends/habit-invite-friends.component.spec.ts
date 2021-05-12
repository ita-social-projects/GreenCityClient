import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitInviteFriendsComponent } from './habit-invite-friends.component';

describe('HabitInviteFriendsComponent', () => {
  let component: HabitInviteFriendsComponent;
  let fixture: ComponentFixture<HabitInviteFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitInviteFriendsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitInviteFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
