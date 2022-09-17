import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InfiniteScrollDirective, InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UbsUserOrdersComponent } from './ubs-user-orders.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

import { of, throwError } from 'rxjs';

import { UserOrdersService } from '../services/user-orders.service';
import { BonusesService } from '../ubs-user-bonuses/services/bonuses.service';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('UbsUserOrdersComponent', () => {
  let component: UbsUserOrdersComponent;
  let fixture: ComponentFixture<UbsUserOrdersComponent>;

  const fakeOrder1 = {
    extend: true,
    id: 1,
    orderFullPrice: 1100,
    orderStatusEng: 'Adjustment',
    paidAmount: 1100,
    paymentStatus: 'Paid'
  };
  const fakeOrder2 = {
    extend: true,
    id: 2,
    orderFullPrice: 1100,
    orderStatusEng: 'Adjustment',
    paidAmount: 1100,
    paymentStatus: 'Paid'
  };

  const fakeCurrentOrdersData = new Array(10).fill(fakeOrder1);
  const fakeCurrentOrdersDataPage2 = new Array(5).fill(fakeOrder2);
  const fakeClosedOrdersData = [fakeOrder2];

  const RouterMock = jasmine.createSpyObj('Router', ['navigate']);

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);

  const userOrderServiceMock = {
    getCurrentUserOrders: (page) => of({ page: page === 0 ? fakeCurrentOrdersData : fakeCurrentOrdersDataPage2 }),
    getClosedUserOrders: () => of({ page: fakeClosedOrdersData })
  };

  const userOrderServiceFailureMock = {
    getCurrentUserOrders: () => of({ page: fakeCurrentOrdersData }),
    getClosedUserOrders: () => throwError('error!')
  };

  const userOrderServiceNoOrdersMock = {
    getCurrentUserOrders: () => of({ page: [] }),
    getClosedUserOrders: () => of({ page: [] })
  };

  const bonusesServiceMock = {
    getUserBonuses: () => of({ points: 5 })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrdersComponent, LocalizedCurrencyPipe, InfiniteScrollDirective],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, InfiniteScrollModule, RouterModule.forRoot([])],
      providers: [
        { provide: Router, useValue: RouterMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: UserOrdersService, useValue: userOrderServiceMock },
        { provide: BonusesService, useValue: bonusesServiceMock },
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  }));

  const buildComponent = async () => {
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(UbsUserOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', async () => {
    await buildComponent();
    expect(component).toBeDefined();
  });

  it('should navigate user to /ubs/order when clicking on new order button ', async () => {
    await buildComponent();
    const newOrderButton = fixture.debugElement.query(By.css('.btn_new_order')).nativeElement;
    newOrderButton.click();
    expect(RouterMock.navigate).toHaveBeenCalledWith(['ubs', 'order']);
  });

  it('should render ubs-user-orders-list component with correct inputs if there are current orders on init', async () => {
    await buildComponent();
    component.ngOnInit();
    const list = fixture.debugElement.query(By.css('app-ubs-user-orders-list'));
    expect(list).toBeTruthy();
    expect(list.properties.orders).toEqual(fakeCurrentOrdersData);
  });

  it('should render list with more orders on scroll', async () => {
    await buildComponent();
    component.ngOnInit();
    const container = fixture.debugElement.query(By.directive(InfiniteScrollDirective));
    container.triggerEventHandler('scrolled', null);
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('app-ubs-user-orders-list'));
    expect(list).toBeTruthy();
    expect(list.properties.orders).toEqual([...fakeCurrentOrdersData, ...fakeCurrentOrdersDataPage2]);
  });

  it('should display a message if there are no orders', async () => {
    TestBed.overrideProvider(UserOrdersService, { useValue: userOrderServiceNoOrdersMock });
    await buildComponent();
    component.ngOnInit();
    fixture.detectChanges();
    const noOrdersElement = fixture.debugElement.query(By.css('.if_empty')).nativeElement;
    expect(noOrdersElement.textContent).toContain('user-orders.no-orders');
  });

  it('should open a snackbar with error message if error occurs when loading data', async () => {
    TestBed.overrideProvider(UserOrdersService, { useValue: userOrderServiceFailureMock });
    await buildComponent();
    component.ngOnInit();
    expect(MatSnackBarMock.openSnackBar).toHaveBeenCalledWith('snack-bar.error.default');
  });
});
