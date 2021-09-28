import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminTariffsLocationComponent } from './ubs-admin-tariffs-location.component';

describe('UbsAdminTariffsLocationComponent', () => {
  let component: UbsAdminTariffsLocationComponent;
  let fixture: ComponentFixture<UbsAdminTariffsLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsLocationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
