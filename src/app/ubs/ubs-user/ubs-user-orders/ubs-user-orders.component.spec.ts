import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { RouterModule, Router } from '@angular/router';

import { UbsUserOrdersComponent } from './ubs-user-orders.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

import { Subject } from 'rxjs';

describe('UbsUserOrdersComponent', () => {
  let component: UbsUserOrdersComponent;
  let fixture: ComponentFixture<UbsUserOrdersComponent>;

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  const RouterMock = jasmine.createSpyObj(['navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrdersComponent, LocalizedCurrencyPipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: Router, useValue: RouterMock }
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

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    component.destroy = new Subject<boolean>();
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
