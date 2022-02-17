import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { UbsAdminOrderClientInfoComponent } from './ubs-admin-order-client-info.component';

describe('UbsAdminOrderClientInfoComponent', () => {
  let component: UbsAdminOrderClientInfoComponent;
  let fixture: ComponentFixture<UbsAdminOrderClientInfoComponent>;
  const fakeUserInfo = {
    customerEmail: 'nazar@gmail.com',
    customerName: 'Ivan',
    customerPhoneNumber: '380963423532',
    customerSurName: 'Taras',
    recipientEmail: 'nazar@gmail.com',
    recipientId: 259,
    recipientName: 'Nazar',
    recipientPhoneNumber: '380963423532',
    recipientSurName: 'Taras',
    totalUserViolations: 5,
    userViolationForCurrentOrder: 2
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, TranslateModule.forRoot()],
      declarations: [UbsAdminOrderClientInfoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderClientInfoComponent);
    component = fixture.componentInstance;
    component.userInfo = fakeUserInfo;
    component.orderId = 259;
    component.pageOpen = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('life cycle hook ngOnInit', () => {
    component.ngOnInit();
    expect(component.pageOpen).toBeTruthy();
    expect(component.totalUserViolations).toBe(5);
    expect(component.userViolationForCurrentOrder).toBe(2);
  });

  it('method openDetails', () => {
    component.openDetails();
    expect(component.pageOpen).toBeFalsy();
  });

  it('method setViolationData', () => {
    component.setViolationData();
    expect(component.totalUserViolations).toBe(5);
    expect(component.userViolationForCurrentOrder).toBe(2);
  });
});
