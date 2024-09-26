import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminAddressDetailsComponent } from './ubs-admin-address-details.component';

describe('UbsAdminAddressDetailsComponent', () => {
  let component: UbsAdminAddressDetailsComponent;

  let fixture: ComponentFixture<UbsAdminAddressDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminAddressDetailsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminAddressDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should set pageOpen to true when openDetails is called', () => {
    component.openDetails();
    expect(component.pageOpen).toBeTruthy();
  });

  it('should toggle pageOpen from true to false when openDetails is called', () => {
    component.pageOpen = true;
    component.openDetails();
    expect(component.pageOpen).toBeFalsy();
  });
});
