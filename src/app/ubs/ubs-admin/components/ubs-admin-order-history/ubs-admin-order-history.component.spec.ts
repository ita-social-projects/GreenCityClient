import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminOrderHistoryComponent } from './ubs-admin-order-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IEmployee } from '../../models/ubs-admin.interface';
import { OrderInfoMockedData } from './../../services/orderInfoMock';

describe('UbsAdminOrderHistoryComponent', () => {
  let component: UbsAdminOrderHistoryComponent;
  let fixture: ComponentFixture<UbsAdminOrderHistoryComponent>;
  const orderServiceMock = jasmine.createSpyObj('orderService', ['getOrderHistory']);
  const fakeAllPositionsEmployees: Map<string, IEmployee[]> = new Map();

  const OrderInfoMock = OrderInfoMockedData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, BrowserAnimationsModule, NoopAnimationsModule, HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [UbsAdminOrderHistoryComponent],
      providers: [{ provide: OrderService, useValue: orderServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOrderHistory when orderInfo changes', () => {
    const spy = spyOn(component, 'getOrderHistory');
    component.orderInfo = OrderInfoMock;

    const changes = {
      orderInfo: {
        currentValue: true,
        firstChange: true,
        isFirstChange: () => true,
        previousValue: undefined
      }
    };
    component.ngOnChanges(changes);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should not call getOrderHistory when orderInfo does not change', () => {
    const spy = spyOn(component, 'getOrderHistory');
    component.orderInfo = OrderInfoMock;
    const changes = {};
    component.ngOnChanges(changes);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should set pageOpen to true when initially false', () => {
    component.pageOpen = false;
    component.openDetails();

    expect(component.pageOpen).toBe(true);
  });

  it('should set pageOpen to false when initially true', () => {
    component.pageOpen = true;
    component.openDetails();

    expect(component.pageOpen).toBe(false);
  });
});
