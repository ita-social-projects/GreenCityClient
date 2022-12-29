import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventScheduleInfoComponent } from './event-schedule-info.component';

describe('EventScheduleInfoComponent', () => {
  let component: EventScheduleInfoComponent;
  let fixture: ComponentFixture<EventScheduleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventScheduleInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventScheduleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
