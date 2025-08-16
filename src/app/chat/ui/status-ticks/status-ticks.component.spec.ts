import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusTicksComponent } from './status-ticks.component';

describe('StatusTicksComponent', () => {
  let component: StatusTicksComponent;
  let fixture: ComponentFixture<StatusTicksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusTicksComponent]
    });
    fixture = TestBed.createComponent(StatusTicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
