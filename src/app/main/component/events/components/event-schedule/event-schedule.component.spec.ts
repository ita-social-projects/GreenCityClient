import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventScheduleComponent } from './event-schedule.component';

describe('EventScheduleComponent', () => {
  let component: EventScheduleComponent;
  let fixture: ComponentFixture<EventScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventScheduleComponent]
    });
    fixture = TestBed.createComponent(EventScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
