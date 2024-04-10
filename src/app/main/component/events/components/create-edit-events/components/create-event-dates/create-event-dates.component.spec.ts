import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventDatesComponent } from './create-event-dates.component';

describe('CreateEventDatesComponent', () => {
  let component: CreateEventDatesComponent;
  let fixture: ComponentFixture<CreateEventDatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEventDatesComponent]
    });
    fixture = TestBed.createComponent(CreateEventDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
