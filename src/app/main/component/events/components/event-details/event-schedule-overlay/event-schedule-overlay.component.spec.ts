import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventScheduleOverlayComponent } from './event-schedule-overlay.component';

describe('EventScheduleInfoComponent', () => {
  let component: EventScheduleOverlayComponent;
  let fixture: ComponentFixture<EventScheduleOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventScheduleOverlayComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventScheduleOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
