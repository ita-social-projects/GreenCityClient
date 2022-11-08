import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderNotTakenOutReasonComponent } from './add-order-not-taken-out-reason.component';

describe('AddOrderNotTakenOutReasonComponent', () => {
  let component: AddOrderNotTakenOutReasonComponent;
  let fixture: ComponentFixture<AddOrderNotTakenOutReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrderNotTakenOutReasonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderNotTakenOutReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
