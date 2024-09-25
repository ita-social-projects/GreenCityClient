import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatTableModule } from '@angular/material/table';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ServerTranslatePipe } from 'src/app/shared/translate-pipe/translate-pipe.pipe';
import { ResizeColumnDirective } from 'src/app/ubs/ubs-admin/derictives/resize-table-columns.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { UbsAdminCustomerOrdersComponent } from './ubs-admin-customer-orders.component';
import { AdminCustomersService } from 'src/app/ubs/ubs-admin/services/admin-customers.service';
import { of } from 'rxjs';
import { PaymnetStatus } from 'src/app/ubs/ubs/order-status.enum';

describe('UbsAdminCustomerOrdersComponent', () => {
  let component: UbsAdminCustomerOrdersComponent;
  let fixture: ComponentFixture<UbsAdminCustomerOrdersComponent>;

  const ActivatedRouteFake = {
    params: of({
      id: '1'
    })
  };
  const RouteFake = jasmine.createSpyObj('router', ['navigate']);

  const AdminCustomersServiceFake = jasmine.createSpyObj('adminCustomerService', ['getCustomerViolations', 'getCustomerOrders']);
  AdminCustomersServiceFake.getCustomerOrders.and.returnValue(
    of({
      table: 'table',
      key: 'ddd',
      username: 'John',
      userOrdersList: [
        { id: 232, orderDate: '21/02/2022', orderStatus: OrderStatus.FORMED, orderPaymentStatus: PaymnetStatus.PAID, amount: 0 },
        { id: 305, orderDate: '23/02/2022', orderStatus: OrderStatus.DONE, orderPaymentStatus: PaymnetStatus.PAID, amount: null }
      ]
    })
  );
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCustomerOrdersComponent, ServerTranslatePipe, ResizeColumnDirective],
      imports: [TranslateModule.forRoot(), InfiniteScrollModule, MatTableModule, MatTooltipModule],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteFake },
        { provide: Router, useValue: RouteFake },
        { provide: AdminCustomersService, useValue: AdminCustomersServiceFake }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomerOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should create', () => {
    expect(component).toBeTruthy();
  });
});
