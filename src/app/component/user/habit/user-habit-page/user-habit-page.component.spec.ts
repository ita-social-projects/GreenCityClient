import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHabitPageComponent } from './user-habit-page.component';

describe('UserHabitPageComponent', () => {
  let component: UserHabitPageComponent;
  let fixture: ComponentFixture<UserHabitPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserHabitPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserHabitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
