import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPreviewComponent } from './event-preview.component';

describe('EventPreviewComponent', () => {
  let component: EventPreviewComponent;
  let fixture: ComponentFixture<EventPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventPreviewComponent]
    });
    fixture = TestBed.createComponent(EventPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
