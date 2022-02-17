import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { OrderService } from '../../services/order.service';

import { UbsAdminOrderPaymentComponent } from './ubs-admin-order-payment.component';

describe('UbsAdminOrderPaymentComponent', () => {
  let component: UbsAdminOrderPaymentComponent;
  let fixture: ComponentFixture<UbsAdminOrderPaymentComponent>;
  const matDialogMock = () => ({
    open: () => ({
      afterClosed: () => ({ pipe: () => ({ subscribe: (f) => f({}) }) })
    })
  });
  const orderServiceMock = jasmine.createSpyObj('orderService', ['getOverpaymentMsg']);
  orderServiceMock.getOverpaymentMsg.and.returnValue('fakeMessage');
  const fakeOrderInfo = {
    generalOrderInfo: { id: 1 },
    paymentTableInfoDto: { paymentInfoDtos: {} }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminOrderPaymentComponent, LocalizedCurrencyPipe],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialog, useFactory: matDialogMock },
        { provide: OrderService, useValue: orderServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderPaymentComponent);
    component = fixture.componentInstance;
    component.orderInfo = fakeOrderInfo as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
