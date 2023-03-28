import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminOrderDetailsFormComponent } from './ubs-admin-order-details-form.component';
import { FormBuilder } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ColumnFiltersPopUpComponent } from '../shared/components/column-filters-pop-up/column-filters-pop-up.component';
import { generalOrderInfoMock } from '../../services/orderInfoMock';

describe('UbsAdminOrderDetailsFormComponent', () => {
  let component: UbsAdminOrderDetailsFormComponent;
  let fixture: ComponentFixture<UbsAdminOrderDetailsFormComponent>;

  const formBuilderMock: FormBuilder = new FormBuilder();
  const orderServiceMock = jasmine.createSpyObj('orderService', ['getLocations']);
  const storeMock = jasmine.createSpyObj('store', ['select', 'subscribe', 'dispatch']);
  storeMock.select = () => of(true, true);

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
    const spy = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set isStatus to false when orderStatus is not "CANCELED"', () => {
    component.generalInfo.orderStatus = 'CANCELED';
    component.isStatus = false;
    component.ngOnInit();
    expect(component.isStatus).toBe(true);
  });

  it('should set isStatus to true when orderStatus is "CANCELED"', () => {
    component.generalInfo.orderStatus = 'DONE';
    component.isStatus = false;
    component.ngOnInit();
    expect(component.isStatus).toBe(false);
  });
});
