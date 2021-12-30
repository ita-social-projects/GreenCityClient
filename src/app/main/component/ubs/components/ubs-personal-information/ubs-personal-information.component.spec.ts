import { of, Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSInputErrorComponent } from '../ubs-input-error/ubs-input-error.component';
import { UBSPersonalInformationComponent } from './ubs-personal-information.component';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { IMaskModule } from 'angular-imask';

describe('UBSPersonalInformationComponent', () => {
  let component: UBSPersonalInformationComponent;
  let fixture: ComponentFixture<UBSPersonalInformationComponent>;
  let realTakeUserData;

  const fakeLocalStorageResponse = JSON.stringify(null);
  const listMock = {
    addressList: [
      {
        actual: true,
        id: 2,
        city: 'fake',
        district: 'fake',
        street: 'fake',
        region: 'fake',
        houseCorpus: 'fake',
        entranceNumber: 'fake',
        houseNumber: 'fake',
        addressComment: 'fake',
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      }
    ]
  };

  const mockedPersonalData = {
    id: 3,
    firstName: 'fake',
    lastName: 'fake',
    email: 'fake',
    phoneNumber: 'fake',
    anotherClientFirstName: 'fake',
    anotherClientLastName: 'fake',
    anotherClientEmail: 'fake',
    anotherClientPhoneNumber: 'fake',
    addressComment: 'fake',
    city: 'fake',
    district: 'fake',
    region: 'fake',
    street: 'fake',
    houseCorpus: 'fake',
    entranceNumber: 'fake',
    houseNumber: 'fake'
  };

  const fakeShareFormService = jasmine.createSpyObj('fakeShareFormService', ['changePersonalData', 'orderDetails']);
  const fakeOrderService = jasmine.createSpyObj('OrderService', [
    'findAllAddresses',
    'getPersonalData',
    'deleteAddress',
    'setOrder',
    'setCurrentAddress',
    'setLocationData',
    'addAdress'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        HttpClientTestingModule,
        MatDialogModule,
        IMaskModule,
        TranslateModule.forRoot()
      ],
      declarations: [UBSPersonalInformationComponent, UBSInputErrorComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: UBSOrderFormService, useValue: fakeShareFormService },
        { provide: OrderService, useValue: fakeOrderService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fakeOrderService.locationSub = new Subject<any>();
    fakeOrderService.currentAddress = new Subject<any>();
    fakeOrderService.setCurrentAddress(listMock.addressList[0]);
    fakeOrderService.setLocationData('Київ');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSPersonalInformationComponent);
    component = fixture.componentInstance;
    realTakeUserData = component.takeUserData;
    spyOn(component, 'takeUserData').and.callFake(() => {});
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(fakeLocalStorageResponse);
    spyOn(localStorage, 'removeItem');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnChanges should call changePersonalData and submit', () => {
    fakeShareFormService.changePersonalData.and.callFake(() => {});
    spyOn(component, 'submit').and.callFake(() => {});
    component.ngOnChanges({ completed: { currentValue: true } as SimpleChange });
    expect(component.submit).toHaveBeenCalled();
    expect(fakeShareFormService.changePersonalData).toHaveBeenCalled();
  });

  it('method findAllAddresses should get data from orderService', () => {
    const spy = spyOn<any>(component, 'getLastAddresses').and.callThrough();
    fakeOrderService.findAllAddresses.and.returnValue(of(listMock));
    spyOn(component, 'checkAddress').and.callFake(() => {});
    component.findAllAddresses(true);
    expect(spy).toHaveBeenCalledWith(listMock.addressList);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const destroy = 'destroy';
    component[destroy] = new Subject<boolean>();
    spyOn(component[destroy], 'unsubscribe');
    component.ngOnDestroy();
    expect(component[destroy].unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('method takeUserData should get data from orderService', () => {
    fakeOrderService.personalData = mockedPersonalData;
    spyOn(component, 'setFormData').and.callFake(() => {});
    spyOn(component, 'findAllAddresses').and.callFake(() => {});
    fakeOrderService.getPersonalData.and.returnValue(of(mockedPersonalData));
    component.takeUserData = realTakeUserData;
    fixture.detectChanges();
    component.takeUserData();
    expect(component.setFormData).toHaveBeenCalledTimes(1);
    expect(component.findAllAddresses).toHaveBeenCalledTimes(1);
  });

  it('method checkAddress should invoke changeAddressInPersonalData', () => {
    spyOn(component, 'changeAddressInPersonalData').and.callFake(() => {});
    component.checkAddress(0);
    expect(component.changeAddressInPersonalData).toHaveBeenCalledTimes(1);
  });

  it('method changeAddressInPersonalData should set data to PersonalData', () => {
    const spy = spyOn(component, 'changeAddressInPersonalData');
    component.changeAddressInPersonalData();
    expect(spy).toHaveBeenCalled();
  });

  it('method setFormData should set data to PersonalDataForm', () => {
    const spy = spyOn(component, 'setFormData');
    component.setFormData();
    expect(spy).toHaveBeenCalled();
  });

  it('method togglClient should set client data if anotherClient = false', () => {
    component.anotherClient = false;
    spyOn(component, 'changeAnotherClientInPersonalData');
    component.togglClient();
    expect(component.personalDataForm.get('anotherClientPhoneNumber').value).toBe('+380');
  });

  it('method togglClient should clear client data if anotherClient = true', () => {
    component.anotherClient = true;
    spyOn(component, 'changeAnotherClientInPersonalData');
    component.togglClient();
    expect(component.personalDataForm.get('anotherClientPhoneNumber').value).toBe('');
  });

  it('method editAddress should invoke openDialog', () => {
    spyOn(component, 'openDialog').and.callFake(() => {});
    component.editAddress(0);
    expect(component.openDialog).toHaveBeenCalledTimes(1);
  });

  it('method activeAddressId should set id of active address', () => {
    component.addresses = listMock.addressList;
    component.activeAddressId();
    expect(component.addressId).toBe(listMock.addressList[0].id);
  });

  it('method deleteAddress should invoke deleteAddress from orderService', () => {
    fakeOrderService.deleteAddress.and.returnValue(of(listMock));
    const spy = spyOn(component, 'checkAddress');
    component.deleteAddress(listMock.addressList[0]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('method addNewAddress should add new address to address list in PersonalDataForm', () => {
    component.addresses = listMock.addressList;
    const spy = spyOn(component, 'openDialog');
    component.addNewAddress();
    expect(component.personalDataForm.get('address').value).toBe(listMock.addressList);
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('method getControl should return control of PersonalDataForm', () => {
    const spy = spyOn(component, 'getControl');
    component.getControl('address');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('method getFormValues should return true', () => {
    expect(component.getFormValues()).toBeTruthy();
  });

  it('method openDialog should open matDialog', () => {
    const spy = spyOn(component, 'openDialog');
    component.openDialog(true, listMock.addressList[0].id);
    expect(spy).toHaveBeenCalled();
  });

  it('method submit should invoke methods', () => {
    const mockedOrderDetails = {
      bags: [],
      points: 9,
      additionalOrders: ['']
    };
    component.personalData = mockedPersonalData;
    fakeShareFormService.orderDetails = mockedOrderDetails;
    fixture.detectChanges();
    spyOn(component, 'activeAddressId').and.callFake(() => {});
    spyOn(component, 'changeAddressInPersonalData').and.callFake(() => {});
    fakeOrderService.setOrder.and.callFake(() => {});
    component.submit();
    expect(component.activeAddressId).toHaveBeenCalledTimes(1);
    expect(component.changeAddressInPersonalData).toHaveBeenCalledTimes(1);
    expect(fakeOrderService.setOrder).toHaveBeenCalledTimes(1);
  });

  it('method changeAddressComment should change address comment according to current address', () => {
    const spy = spyOn(component, 'changeAddressComment');
    component.changeAddressComment();
    expect(spy).toHaveBeenCalled();
  });
});
