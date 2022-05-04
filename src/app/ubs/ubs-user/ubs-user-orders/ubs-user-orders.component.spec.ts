import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { RouterModule, Router } from '@angular/router';

import { UbsUserOrdersComponent } from './ubs-user-orders.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

import { Subject, of } from 'rxjs';

import { UserOrdersService } from '../services/user-orders.service';
import { BonusesService } from '../ubs-user-bonuses/services/bonuses.service';
import { APP_BASE_HREF } from '@angular/common';

describe('UbsUserOrdersComponent', () => {
  let component: UbsUserOrdersComponent;
  let fixture: ComponentFixture<UbsUserOrdersComponent>;

  const fakeOrder1 = {
    extend: true,
    id: 1,
    orderFullPrice: 1100,
    orderStatus: 'Adjustment',
    paidAmount: 1100,
    paymentStatus: 'Paid'
  };
  const fakeOrder2 = {
    extend: true,
    id: 2,
    orderFullPrice: 1100,
    orderStatus: 'Adjustment',
    paidAmount: 1100,
    paymentStatus: 'Paid'
  };

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);

  const userOrderServiceMock = jasmine.createSpyObj('userOrderService', ['getAllUserOrders']);

  userOrderServiceMock.getAllUserOrders.and.returnValue(of({ page: [fakeOrder1, fakeOrder2] }));

  const bonusesServiceMock = jasmine.createSpyObj('bonusesService', ['getUserBonuses']);

  bonusesServiceMock.getUserBonuses.and.returnValue(
    of({
      points: 5
    })
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrdersComponent, LocalizedCurrencyPipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: UserOrdersService, useValue: userOrderServiceMock },
        { provide: BonusesService, useValue: bonusesServiceMock },
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('router should been called', () => {
    spyOn((component as any).router, 'navigate');
    component.redirectToOrder();
    expect((component as any).router.navigate).toHaveBeenCalledWith(['ubs', 'order']);
  });

  it('loading should return true', () => {
    component.loadingOrders = true;
    component.loadingBonuses = true;
    const isLoadingTrue = component.loading();
    expect(isLoadingTrue).toBe(true);
  });

  it('loading should return false', () => {
    component.loadingOrders = false;
    component.loadingBonuses = true;
    const isLoadingTrue = component.loading();
    expect(isLoadingTrue).toBeFalsy();
  });

  it('should call getAllUserOrders and getUserBonuses ', () => {
    fakeOrder1.orderStatus = 'Adjustment';
    component.loadingBonuses = false;
    component.ngOnInit();
    expect((component as any).userOrdersService.getAllUserOrders).toHaveBeenCalled();
    expect((component as any).bonusesService.getUserBonuses).toHaveBeenCalled();
    expect(component.loadingBonuses).toBe(true);
  });

  it('orderHistory length should been 1', () => {
    fakeOrder1.orderStatus = 'Done';
    component.ngOnInit();
    expect(component.orderHistory.length).toBe(1);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    component.destroy = new Subject<boolean>();
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
