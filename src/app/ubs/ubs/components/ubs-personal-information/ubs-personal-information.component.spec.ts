import { of, Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSPersonalInformationComponent } from './ubs-personal-information.component';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { IMaskModule } from 'angular-imask';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from 'src/app/main/i18n/Language';
import { APP_BASE_HREF } from '@angular/common';
import { UBSInputErrorComponent } from 'src/app/shared/ubs-input-error/ubs-input-error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GoogleScript } from 'src/assets/google-script/google-script';

describe('UBSPersonalInformationComponent', () => {
  let component: UBSPersonalInformationComponent;
  let fixture: ComponentFixture<UBSPersonalInformationComponent>;
  let realTakeUserData;

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getLocationId', 'languageBehaviourSubject']);
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('ua');
  fakeLocalStorageService.getLocationId = () => '1';

  const fakeGoogleScript = jasmine.createSpyObj('GoogleScript', ['load']);
  fakeGoogleScript.load.and.returnValue(of());

  const listMock = {
    addressList: [
      {
        actual: true,
        id: 2,
        city: 'fake',
        cityEn: 'fake',
        district: 'fake',
        districtEn: 'fake',
        street: 'fake',
        streetEn: 'fake',
        region: 'fake',
        regionEn: 'fake',
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
    addressComment: 'fake',
    city: 'fake',
    district: 'fake',
    region: 'fake',
    street: 'fake',
    houseCorpus: 'fake',
    entranceNumber: 'fake',
    houseNumber: 'fake',
    senderFirstName: 'fake',
    senderLastName: 'fake',
    senderEmail: 'fake',
    senderPhoneNumber: 'fake'
  };

  const mockLocations = {
    courierLimit: 'fake',
    courierStatus: 'fake status',
    tariffInfoId: 1,
    regionDto: {
      nameEn: 'fake name en',
      nameUk: 'fake name ua',
      regionId: 2
    },
    locationsDtosList: [
      {
        locationId: 3,
        nameEn: 'fake location en',
        nameUk: 'fake location ua'
      }
    ],
    courierTranslationDtos: [
      {
        languageCode: 'ua',
        name: 'fake name'
      }
    ],
    maxAmountOfBigBags: 99,
    maxPriceOfOrder: 500000,
    minAmountOfBigBags: 2,
    minPriceOfOrder: 500
  };

  const fakeShareFormService = jasmine.createSpyObj('fakeShareFormService', ['changePersonalData']);
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
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [UBSPersonalInformationComponent, UBSInputErrorComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: UBSOrderFormService, useValue: fakeShareFormService },
        { provide: OrderService, useValue: fakeOrderService },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: GoogleScript, useValue: fakeGoogleScript },
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('locations', JSON.stringify(mockLocations));
    localStorage.setItem('currentLocationId', JSON.stringify(1));
    fakeOrderService.locationSub = new Subject<any>();
    fakeOrderService.locationSubject = new Subject<any>();
    fakeOrderService.currentAddress = new Subject<any>();
    fakeOrderService.setCurrentAddress(listMock.addressList[0]);
    fakeOrderService.setLocationData('Київ');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSPersonalInformationComponent);
    component = fixture.componentInstance;
    realTakeUserData = component.takeUserData;
    spyOn(component, 'takeUserData').and.callFake(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on ngOnInit should set currentLocationId', () => {
    component.ngOnInit();
    expect(component.currentLocationId).toEqual(1);
  });

  it('setDisabledCityForLocation function should redefine addresses', () => {
    component.addresses = listMock.addressList;
    component.setDisabledCityForLocation();
    expect(component.addresses).toBeDefined();
  });

  it('method ngOnChanges should call changePersonalData and submit', () => {
    fakeShareFormService.changePersonalData.and.callFake(() => {});
    spyOn(component, 'submit').and.callFake(() => {});
    component.ngOnChanges({ completed: { currentValue: true } as SimpleChange });
    expect(component.submit).toHaveBeenCalled();
    expect(fakeShareFormService.changePersonalData).toHaveBeenCalled();
  });

  it('method findAllAddresses should get data from orderService', () => {
    fakeOrderService.findAllAddresses.and.returnValue(of(listMock));
    const spy = spyOn(component, 'checkAddress').and.callFake(() => {});
    component.findAllAddresses(true);
    expect(component.addresses).toBeDefined();
    expect(spy).toHaveBeenCalled();
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
    component.personalData = mockedPersonalData as any;
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
