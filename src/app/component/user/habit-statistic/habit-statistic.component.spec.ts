import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitStatisticComponent } from './habit-statistic.component';

describe('HabitStatisticComponent', () => {
  let component: HabitStatisticComponent;
  let fixture: ComponentFixture<HabitStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
