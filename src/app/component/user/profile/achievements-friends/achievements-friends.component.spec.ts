import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementsFriendsComponent } from './achievements-friends.component';

describe('AchievementsFriendsComponent', () => {
  let component: AchievementsFriendsComponent;
  let fixture: ComponentFixture<AchievementsFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AchievementsFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementsFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
