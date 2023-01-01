import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventScheduleButtonComponent } from './event-schedule-button.component';

describe('EventScheduleButtonComponent', () => {
  let component: EventScheduleButtonComponent;
  let fixture: ComponentFixture<EventScheduleButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventScheduleButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventScheduleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
