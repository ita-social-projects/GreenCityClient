import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsOrderAddressComponent } from './ubs-order-address.component';

xdescribe('UbsOrderAddressComponent', () => {
  let component: UbsOrderAddressComponent;
  let fixture: ComponentFixture<UbsOrderAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsOrderAddressComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
