import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewViolationModalComponent } from './view-violation-modal.component';

describe('ViewViolationModalComponent', () => {
  let component: ViewViolationModalComponent;
  let fixture: ComponentFixture<ViewViolationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewViolationModalComponent]
    });
    fixture = TestBed.createComponent(ViewViolationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
