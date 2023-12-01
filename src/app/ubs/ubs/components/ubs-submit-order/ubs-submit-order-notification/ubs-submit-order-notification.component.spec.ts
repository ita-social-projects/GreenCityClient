import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UbsSubmitOrderNotificationComponent } from './ubs-submit-order-notification.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UbsSubmitOrderNotificationComponent', () => {
  let component: UbsSubmitOrderNotificationComponent;
  let fixture: ComponentFixture<UbsSubmitOrderNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [UbsSubmitOrderNotificationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
