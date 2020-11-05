import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitProgressComponent } from './habit-progress.component';

describe('HabitProgressComponent', () => {
  let component: HabitProgressComponent;
  let fixture: ComponentFixture<HabitProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
