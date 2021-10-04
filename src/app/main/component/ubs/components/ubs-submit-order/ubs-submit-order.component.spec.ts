import { OrderService } from './../../services/order.service';
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

describe('UBSSubmitOrderComponent', () => {
  let component: UBSSubmitOrderComponent;
  let fixture: ComponentFixture<UBSSubmitOrderComponent>;
  let mockedtakeOrderDetails;
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
    anotherClientFirstName: 'fake',
    anotherClientLastName: 'fake',
    anotherClientEmail: 'fake',
    anotherClientPhoneNumber: 'fake',
    city: 'fake',
    district: 'fake',
    street: 'fake',
    houseCorpus: 'fake',
    entranceNumber: 'fake',
    houseNumber: 'fake'
  };

  class FakeShareFormService {
    get changedOrder() {
      return of(mockedOrderDetails);
    }
    get changedPersonalData() {
      return of(mockedPersonalData);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [UBSSubmitOrderComponent],
      providers: [
        { provide: UBSOrderFormService, useClass: FakeShareFormService },
        { provide: OrderService, useValue: fakeOrderService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSSubmitOrderComponent);
    component = fixture.componentInstance;
    mockedtakeOrderDetails = component.takeOrderDetails;
    spyOn(component, 'takeOrderDetails').and.callFake(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('takeOrderDetails should correctly set data from subscription', () => {
    const service = TestBed.inject(UBSOrderFormService);
    spyOnProperty(service, 'changedOrder').and.returnValue(of(mockedOrderDetails));
    spyOnProperty(service, 'changedPersonalData').and.returnValue(of(mockedPersonalData));
    fixture.detectChanges();
    component.takeOrderDetails = mockedtakeOrderDetails;
    component.takeOrderDetails();
    expect(component.orderDetails).toBe(mockedOrderDetails);
    expect(component.personalData).toBe(mockedPersonalData);
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
});
