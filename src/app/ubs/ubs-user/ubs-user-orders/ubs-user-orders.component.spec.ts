import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Router, RouterModule } from '@angular/router';

import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
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
  const fakeClosedOrdersData = [fakeOrder2];

  const RouterMock = jasmine.createSpyObj('Router', ['navigate']);

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);

  const userOrderServiceMock = {
    getCurrentUserOrders: () => of({ page: fakeCurrentOrdersData }),
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
      declarations: [UbsUserOrdersComponent, LocalizedCurrencyPipe],
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

  const buildComponent = () => {
    TestBed.compileComponents();
    fixture = TestBed.createComponent(UbsUserOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    buildComponent();
    expect(component).toBeDefined();
  });

  it('should navigate user to /ubs/order when clicking on new order button ', () => {
    buildComponent();
    const newOrderButton = fixture.debugElement.query(By.css('.btn_new_order')).nativeElement;
    newOrderButton.click();
    expect(RouterMock.navigate).toHaveBeenCalledWith(['ubs', 'order']);
  });

  it('should render ubs-user-orders-list component with correct inputs if there are current orders on init', () => {
    buildComponent();
    component.ngOnInit();
    const list = fixture.debugElement.query(By.css('app-ubs-user-orders-list'));
    expect(list).toBeTruthy();
    expect(JSON.stringify(list.properties.orders)).toBe(JSON.stringify(fakeCurrentOrdersData));
  });

  it('should display a message if there are no orders', () => {
    TestBed.overrideProvider(UserOrdersService, { useValue: userOrderServiceNoOrdersMock });
    buildComponent();
    component.ngOnInit();
    fixture.detectChanges();
    const noOrdersElement = fixture.debugElement.query(By.css('.if_empty')).nativeElement;
    expect(noOrdersElement.textContent).toContain('user-orders.no-orders');
  });

  it('should open a snackbar with error message if error occurs when loading data', () => {
    TestBed.overrideProvider(UserOrdersService, { useValue: userOrderServiceFailureMock });
    buildComponent();
    component.ngOnInit();
    expect(MatSnackBarMock.openSnackBar).toHaveBeenCalledWith('snack-bar.error.default');
  });
});
