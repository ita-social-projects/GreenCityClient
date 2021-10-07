import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsSubmitOrderNotificationComponent } from './ubs-submit-order-notification.component';

describe('UbsSubmitOrderNotificationComponent', () => {
  let component: UbsSubmitOrderNotificationComponent;
  let fixture: ComponentFixture<UbsSubmitOrderNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsSubmitOrderNotificationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsSubmitOrderNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
