import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminEditHomepageComponent } from './ubs-admin-edit-homepage.component';

describe('UbsAdminEditHomepageComponent', () => {
  let component: UbsAdminEditHomepageComponent;
  let fixture: ComponentFixture<UbsAdminEditHomepageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEditHomepageComponent]
    });
    fixture = TestBed.createComponent(UbsAdminEditHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
