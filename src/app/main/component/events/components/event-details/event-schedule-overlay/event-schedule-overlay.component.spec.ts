import { OverlayModule } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventScheduleOverlayComponent } from './event-schedule-overlay.component';

describe('EventScheduleOverlayComponent', () => {
  let component: EventScheduleOverlayComponent;
  let fixture: ComponentFixture<EventScheduleOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventScheduleOverlayComponent],
      imports: [OverlayModule]
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
