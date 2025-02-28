import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HabitTitleComponent } from './habit-title.component';

describe('HabitTitleComponent', () => {
  let component: HabitTitleComponent;
  let fixture: ComponentFixture<HabitTitleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HabitTitleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
