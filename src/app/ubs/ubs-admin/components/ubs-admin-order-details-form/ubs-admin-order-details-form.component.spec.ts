import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminOrderDetailsFormComponent } from './ubs-admin-order-details-form.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderService } from '../../services/order.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

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
      imports: [MatDialogModule, TranslateModule.forRoot(), HttpClientTestingModule],
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
    component.orderStatusInfo = OrderStatusInfoFake as any;
  });

  it('method onDefineOrderStatus', () => {
    const spy = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
