import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminOrderDetailsFormComponent } from './ubs-admin-order-details-form.component';
import { FormBuilder } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Store } from '@ngrx/store';

describe('UbsAdminOrderDetailsFormComponent', () => {
  let component: UbsAdminOrderDetailsFormComponent;
  let fixture: ComponentFixture<UbsAdminOrderDetailsFormComponent>;

  const formBuilderMock: FormBuilder = new FormBuilder();
  const orderServiceMock = jasmine.createSpyObj('orderService', ['getLocations']);
  const storeMock = jasmine.createSpyObj('store', ['select', 'subscribe', 'dispatch']);
  const doneAfterBroughtHimself = false;

  const GeneralInfoFake = {
    orderStatus: 'DONE',
    adminComment: 'Admin',
    orderPaymentStatus: 'PAID',
    orderStatusesDtos: [
      { ableActualChange: false, key: 'DONE', translation: 'Formed' },
      { ableActualChange: false, key: 'ADJUSTMENT', translation: 'Adjustment' },
      { ableActualChange: false, key: 'BROUGHT_IT_HIMSELF', translation: 'Brought by himself' },
      { ableActualChange: true, key: 'CANCELED', translation: 'Canceled' }
    ]
  };

  const OrderStatusInfoFake = {
    key: 'fakeKey',
    ableActualChange: 'true'
  };

  storeMock.doneAfterBroughtHimself = 1111;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, TranslateModule.forRoot()],
      declarations: [UbsAdminOrderDetailsFormComponent],
      providers: [
        { provide: FormBuilder, useValue: formBuilderMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderDetailsFormComponent);
    component = fixture.componentInstance;
    component.generalInfo = GeneralInfoFake as any;
    component.orderStatusInfo = OrderStatusInfoFake as any;
  });
});
