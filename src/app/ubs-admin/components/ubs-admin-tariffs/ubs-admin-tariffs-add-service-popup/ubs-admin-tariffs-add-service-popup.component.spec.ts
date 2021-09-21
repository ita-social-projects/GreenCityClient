import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminTariffsAddServicePopupComponent } from './ubs-admin-tariffs-add-service-popup.component';

describe('UbsAdminTariffsAddServicePopupComponent', () => {
  let component: UbsAdminTariffsAddServicePopupComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddServicePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsAddServicePopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsAddServicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
