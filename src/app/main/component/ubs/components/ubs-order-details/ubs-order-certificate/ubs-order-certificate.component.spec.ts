import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsOrderCertificateComponent } from './ubs-order-certificate.component';

describe('UbsOrderCertificateComponent', () => {
  let component: UbsOrderCertificateComponent;
  let fixture: ComponentFixture<UbsOrderCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsOrderCertificateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
