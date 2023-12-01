import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventScheduleComponent } from './event-schedule.component';

describe('EventScheduleComponent', () => {
  let component: EventScheduleComponent;
  let fixture: ComponentFixture<EventScheduleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventScheduleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
