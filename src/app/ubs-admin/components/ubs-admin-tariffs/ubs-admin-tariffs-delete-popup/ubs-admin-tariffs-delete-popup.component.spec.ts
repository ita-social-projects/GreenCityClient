import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminTariffsDeletePopupComponent } from './ubs-admin-tariffs-delete-popup.component';

describe('UbsAdminTariffsDeletePopupComponent', () => {
  let component: UbsAdminTariffsDeletePopupComponent;
  let fixture: ComponentFixture<UbsAdminTariffsDeletePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsDeletePopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
