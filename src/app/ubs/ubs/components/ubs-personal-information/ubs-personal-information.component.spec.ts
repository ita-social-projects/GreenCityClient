import { of, Subject } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { UBSOrderFormService } from '../../services/ubs-order-form.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSPersonalInformationComponent } from './ubs-personal-information.component';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { IMaskModule } from 'angular-imask';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Language } from 'src/app/shared/i18n/Language';
import { APP_BASE_HREF } from '@angular/common';
import { UBSInputErrorComponent } from '@ubs/shared/components/ubs-input-error/ubs-input-error.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { Store } from '@ngrx/store';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';

describe('UBSPersonalInformationComponent', () => {
  let component: UBSPersonalInformationComponent;
  let fixture: ComponentFixture<UBSPersonalInformationComponent>;

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getLocationId',
    'languageBehaviourSubject',
    'getUserId',
    'getIsAnotherClient',
    'removeIsAnotherClient',
    'setAddressId',
    'getCurrentLanguage',
    'setIsAnotherClient',
    'setAddresses',
    'getCurrentLocationId',
    'getAddressId',
    'getLocations'
  ]);
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
        display: true,
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
    senderPhoneNumber: '+380999999999'
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

  const storeMock = {
    dispatch: jasmine.createSpy(),
    select: jasmine.createSpy().and.returnValue(of({ order: ubsOrderServiseMock })),
    pipe: () => of({})
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([], {}),
        HttpClientTestingModule,
        MatDialogModule,
        IMaskModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [UBSPersonalInformationComponent, UBSInputErrorComponent],
      providers: [
        { provide: Store, useValue: storeMock },
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
    fakeOrderService.getPersonalData.and.returnValue(of(mockedPersonalData));
    fakeOrderService.setOrder.and.callFake(() => {});
    localStorage.setItem('locations', JSON.stringify(mockLocations));
    fakeOrderService.locationSub = new Subject<any>();
    fakeOrderService.locationSubject = new Subject<any>();
    fakeOrderService.currentAddress = new Subject<any>();
    fakeOrderService.setCurrentAddress(listMock.addressList[0]);
    fakeOrderService.setLocationData('Київ');

    fixture = TestBed.createComponent(UBSPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method toggleClient should clear client data if anotherClient = true', () => {
    expect(component.personalDataForm.get('senderPhoneNumber').value).toBe('');
  });
});
