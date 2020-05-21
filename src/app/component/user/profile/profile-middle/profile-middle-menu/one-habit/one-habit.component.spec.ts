import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneHabitComponent } from './one-habit.component';

describe('OneHabitComponent', () => {
  let component: OneHabitComponent;
  let fixture: ComponentFixture<OneHabitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneHabitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
