import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminTariffsAddLocationPopUpComponent } from './ubs-admin-tariffs-add-location-pop-up.component';

describe('UbsAdminTariffsAddLocationPopUpComponent', () => {
  let component: UbsAdminTariffsAddLocationPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddLocationPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsAddLocationPopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsAddLocationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
