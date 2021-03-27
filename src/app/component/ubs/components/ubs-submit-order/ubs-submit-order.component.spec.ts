import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UBSSubmitOrderComponent } from './ubs-submit-order.component';

describe('PaymentFormComponent', () => {
  let component: UBSSubmitOrderComponent;
  let fixture: ComponentFixture<UBSSubmitOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UBSSubmitOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSSubmitOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
