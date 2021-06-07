import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminCabinetComponent } from './ubs-admin-cabinet.component';

describe('UbsAdminCabinetComponent', () => {
  let component: UbsAdminCabinetComponent;
  let fixture: ComponentFixture<UbsAdminCabinetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCabinetComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
