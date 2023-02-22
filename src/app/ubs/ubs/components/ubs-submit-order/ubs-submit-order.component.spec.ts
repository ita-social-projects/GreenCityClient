import { OrderService } from '../../services/order.service';
import { of, Subject, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSSubmitOrderComponent } from './ubs-submit-order.component';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { LanguageService } from 'src/app/main/i18n/language.service';

describe('UBSSubmitOrderComponent', () => {
  let component: UBSSubmitOrderComponent;
  let fixture: ComponentFixture<UBSSubmitOrderComponent>;
  let mockedtakeOrderDetails;
  let router: Router;
  const fakeLocalStorageService = jasmine.createSpyObj('localStorageService', [
    'getCurrentLanguage',
    'setUserPagePayment',
    'setFinalSumOfOrder'
  ]);
  fakeLocalStorageService.getCurrentLanguage.and.returnValue('ua');
  fakeLocalStorageService.languageSubject = of('ua');
  const fakeOrderService = jasmine.createSpyObj('fakeOrderService', ['getOrderUrl']);
  const mockedOrderDetails = {
    bags: [],
    points: 9
  };
  const mockedPersonalData = {
    id: 9,
    firstName: 'fake',
    lastName: 'fake',
    email: 'fake',
    phoneNumber: 'fake',
    addressComment: 'fake',
    city: 'fake',
    cityEn: 'fakeEn',
    district: 'fake',
    districtEn: 'fakeEn',
    street: 'fake',
    streetEn: 'fakeEn',
    houseCorpus: 'fake',
    entranceNumber: 'fake',
    houseNumber: 'fake',
    senderFirstName: 'fake',
    senderLastName: 'fake',
    senderEmail: 'fake',
    senderPhoneNumber: 'fake'
  };

  class FakeShareFormService {
    get changedOrder() {
      return of(mockedOrderDetails);
    }
    get changedPersonalData() {
      return of(mockedPersonalData);
    }
  }

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return valUa;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [UBSSubmitOrderComponent],
      providers: [
        { provide: UBSOrderFormService, useClass: FakeShareFormService },
        { provide: OrderService, useValue: fakeOrderService },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: LanguageService, useValue: languageServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSSubmitOrderComponent);
    component = fixture.componentInstance;
    mockedtakeOrderDetails = component.takeOrderDetails;
    spyOn(component, 'takeOrderDetails').and.callFake(() => {});
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should invoke method getOrderFormNotifications()', () => {
    component.isNotification = true;
    const getOrderFormNotificationsSpy = spyOn(component, 'getOrderFormNotifications');
    component.ngOnInit();
    expect(getOrderFormNotificationsSpy).toHaveBeenCalled();
    expect(component.isDownloadDataNotification).toBeFalsy();
    expect(component.currentLanguage).toBe('ua');
  });

  it('method ngOnInit should invoke method takeOrderDetails()', () => {
    component.isNotification = false;
    component.ngOnInit();
    expect(component.takeOrderDetails).toHaveBeenCalled();
    expect(component.currentLanguage).toBe('ua');
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy = new Subject<boolean>();
    spyOn((component as any).destroy, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('takeOrderDetails should correctly set data from subscription', () => {
    const service = TestBed.inject(UBSOrderFormService);
    spyOnProperty(service, 'changedOrder').and.returnValue(of(mockedOrderDetails));
    spyOnProperty(service, 'changedPersonalData').and.returnValue(of(mockedPersonalData));
    fixture.detectChanges();
    component.takeOrderDetails = mockedtakeOrderDetails;
    component.takeOrderDetails();
    expect(component.orderDetails).toEqual(mockedOrderDetails);
    expect(component.personalData).toEqual(mockedPersonalData);
  });

  it('error from subscription should set loadingAnim to false', () => {
    const errorResponse = new HttpErrorResponse({
      error: { code: 'some code', message: 'some message' },
      status: 404
    });
    fakeOrderService.getOrderUrl.and.returnValue(throwError(errorResponse));
    fixture.detectChanges();
    component.redirectToOrder();
    expect(component.loadingAnim).toBe(false);
  });

  it('should return ua value by getLangValue', () => {
    const value = component.getLangValue('value', 'enValue');
    expect(value).toBe('value');
  });
});
