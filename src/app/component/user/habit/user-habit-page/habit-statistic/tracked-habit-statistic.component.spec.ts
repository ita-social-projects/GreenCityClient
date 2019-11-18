import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackedHabitStatisticComponent } from './tracked-habit-statistic.component';

describe('HabitStatisticComponent', () => {
  let component: TrackedHabitStatisticComponent;
  let fixture: ComponentFixture<TrackedHabitStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackedHabitStatisticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackedHabitStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
