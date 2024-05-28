import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventScheduleOverlayComponent } from './event-schedule-overlay.component';
import { ResizableBottomSheetComponent } from 'src/app/shared/resizable-bottom-sheet/resizable-bottom-sheet.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EventScheduleOverlayComponent', () => {
  let component: EventScheduleOverlayComponent;
  let fixture: ComponentFixture<EventScheduleOverlayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventScheduleOverlayComponent],
      imports: [OverlayModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
