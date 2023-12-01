import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HabitDurationComponent } from './habit-duration.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('HabitDurationComponent', () => {
  let component: HabitDurationComponent;
  let fixture: ComponentFixture<HabitDurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HabitDurationComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitDurationComponent);
    component = fixture.componentInstance;
    component.habitDurationInitial = 14;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
