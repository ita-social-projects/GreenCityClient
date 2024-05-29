import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventInformationComponent } from './create-event-information.component';

describe('CreateEventInformationComponent', () => {
  let component: CreateEventInformationComponent;
  let fixture: ComponentFixture<CreateEventInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEventInformationComponent]
    });
    fixture = TestBed.createComponent(CreateEventInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
