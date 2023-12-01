import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventScheduleOverlayComponent } from './event-schedule-overlay.component';

describe('EventScheduleOverlayComponent', () => {
  let component: EventScheduleOverlayComponent;
  let fixture: ComponentFixture<EventScheduleOverlayComponent>;

  beforeEach(waitForAsync(() => {
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
