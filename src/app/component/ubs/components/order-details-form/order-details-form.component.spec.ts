import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsFormComponent } from './order-details-form.component';

describe('OrderDetailsFormComponent', () => {
  let component: OrderDetailsFormComponent;
  let fixture: ComponentFixture<OrderDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
