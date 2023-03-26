import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminOrderDetailsFormComponent } from './ubs-admin-order-details-form.component';
import { FormBuilder } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ColumnFiltersPopUpComponent } from '../shared/components/column-filters-pop-up/column-filters-pop-up.component';

describe('UbsAdminOrderDetailsFormComponent', () => {
  let component: UbsAdminOrderDetailsFormComponent;
  let fixture: ComponentFixture<UbsAdminOrderDetailsFormComponent>;

  const formBuilderMock: FormBuilder = new FormBuilder();
  const orderServiceMock = jasmine.createSpyObj('orderService', ['getLocations']);
  const storeMock = jasmine.createSpyObj('store', ['select', 'subscribe', 'dispatch']);
  storeMock.select = () => of(true, true);

  const generalOrderInfoMock = {
    id: 1,
    dateFormed: '2022-02-08T15:21:44.85458',
    adminComment: null,
    orderStatus: 'FORMED',
    orderStatusName: 'Сформовано',
    orderStatusNameEng: 'Formed',
    orderStatusesDtos: [
      {
        ableActualChange: false,
        key: 'FORMED',
        translation: 'Сформовано'
      },
      {
        ableActualChange: false,
        key: 'ADJUSTMENT',
        translation: 'Узгодження'
      },
      {
        ableActualChange: false,
        key: 'BROUGHT_IT_HIMSELF',
        translation: 'Привезе сам'
      },
      {
        ableActualChange: false,
        key: 'CONFIRMED',
        translation: 'Підтверджено'
      },
      {
        ableActualChange: false,
        key: 'ON_THE_ROUTE',
        translation: 'На маршруті'
      },
      {
        ableActualChange: true,
        key: 'DONE',
        translation: 'Виконано'
      },
      {
        ableActualChange: false,
        key: 'NOT_TAKEN_OUT',
        translation: 'Не вивезли'
      },
      {
        ableActualChange: true,
        key: 'CANCELED',
        translation: 'Скасовано'
      }
    ],
    orderPaymentStatus: 'PAID',
    orderPaymentStatusName: 'Оплачено',
    orderPaymentStatusNameEng: 'Paid',
    orderPaymentStatusesDto: [
      {
        key: 'PAID',
        translation: 'Оплачено'
      }
    ]
  };
  const OrderStatusInfoFake = {
    key: 'fakeKey',
    ableActualChange: 'true'
  };

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
    component.generalInfo = generalOrderInfoMock as any;
    component.orderStatusInfo = OrderStatusInfoFake as any;
  });

  it('method onDefineOrderStatus', () => {
    const spy = spyOn(component, 'onDefineOrderStatus');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set isStatus to false when orderStatus is not "CANCELED"', () => {
    component.generalInfo.orderStatus = 'CANCELED';
    component.isStatus = false;
    component.onDefineOrderStatus();
    expect(component.isStatus).toBe(true);
  });

  it('should set isStatus to true when orderStatus is "CANCELED"', () => {
    component.generalInfo.orderStatus = 'DONE';
    component.isStatus = false;
    component.onDefineOrderStatus();
    expect(component.isStatus).toBe(false);
  });
});
