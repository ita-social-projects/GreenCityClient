import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedCurrencyPipe } from 'src/app/shared/localized-currency-pipe/localized-currency.pipe';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UbsUserOrderDetailsComponent } from './ubs-user-order-details.component';
import { IUserOrderInfo } from '../ubs-user-orders-list/models/UserOrder.interface';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { fakeInputOrderData } from '@ubs/mocks/order-data-mock';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { of } from 'rxjs';

describe('UbsUserOrderDetailsComponent', () => {
  let component: UbsUserOrderDetailsComponent;
  let fixture: ComponentFixture<UbsUserOrderDetailsComponent>;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLangObs']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => valUa;
  languageServiceMock.getCurrentLangObs = () => of('ua');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserOrderDetailsComponent, LocalizedCurrencyPipe, LangValueDirective],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserOrderDetailsComponent);
    component = fixture.componentInstance;
    component.order = JSON.parse(JSON.stringify(fakeInputOrderData)) as IUserOrderInfo;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should calcuate certificatesAmount', () => {
    component.ngOnInit();
    expect(component.certificatesAmount).toBe(510);
  });

  describe('isOrderPaid', () => {
    it('order  is paid', () => {
      fakeInputOrderData.paymentStatus = 'Paid';
      const isOrderPaidRes = component.isPaid(fakeInputOrderData as IUserOrderInfo);
      expect(isOrderPaidRes).toBeTruthy();
    });

    it('order is not unpaid', () => {
      fakeInputOrderData.paymentStatus = 'Unpaid';
      const isOrderPaidRes = component.isPaid(fakeInputOrderData as IUserOrderInfo);
      expect(isOrderPaidRes).toBeFalsy();
    });
  });
});
