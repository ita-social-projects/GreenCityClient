import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarBaseComponent } from './calendar-base.component';

describe('CalendarBaseComponent', () => {
  let component: CalendarBaseComponent;
  let fixture: ComponentFixture<CalendarBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
