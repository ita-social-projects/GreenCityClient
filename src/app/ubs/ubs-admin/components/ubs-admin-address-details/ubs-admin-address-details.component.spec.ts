import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { UbsAdminAddressDetailsComponent } from './ubs-admin-address-details.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { LocationService } from '@global-service/location/location.service';
import { OrderInfoMockedData } from '../../services/orderInfoMock';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { ADDRESSESMOCK } from 'src/app/ubs/mocks/address-mock';
import { of } from 'rxjs';
import { Language } from 'src/app/main/i18n/Language';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { Store } from '@ngrx/store';

xdescribe('UbsAdminAddressDetailsComponent', () => {
  let component: UbsAdminAddressDetailsComponent;

  let fixture: ComponentFixture<UbsAdminAddressDetailsComponent>;

  const FormGroupMock = new FormGroup({
    addressRegion: new FormControl('місто Київ'),
    addressRegionEng: new FormControl('Kyiv'),
    addressCity: new FormControl('Київ'),
    addressCityEng: new FormControl('Kyiv'),
    addressStreet: new FormControl('вулиця Михайла Ломоносова'),
    addressStreetEng: new FormControl('Mykhaila Lomonosova Street'),
    addressHouseNumber: new FormControl('12'),
    addressHouseCorpus: new FormControl('2'),
    addressEntranceNumber: new FormControl('5'),
    addressDistrict: new FormControl('Голосіївський район'),
    addressDistrictEng: new FormControl(`Holosiivs'kyi district`),
    addressRegionDistrictList: new FormControl(ADDRESSESMOCK.DISTRICTSKYIVMOCK)
  });

  const status = 'OK';

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'languageBehaviourSubject']);
  fakeLocalStorageService.getCurrentLanguage = () => 'ua';
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject('ua');

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string | AbstractControl, valEn: string | AbstractControl) => valUa;

  const fakeLocationServiceMock = jasmine.createSpyObj('locationService', [
    'getDistrictAuto',
    'getFullAddressList',
    'getSearchAddress',
    'getRequest',
    'appendDistrictLabel'
  ]);
  fakeLocationServiceMock.getDistrictAuto = () => ADDRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
  fakeLocationServiceMock.getFullAddressList = () => of([]);
  fakeLocalStorageService.getSearchAddress = () => ADDRESSESMOCK.SEARCHADDRESS;
  fakeLocalStorageService.getRequest = () => ADDRESSESMOCK.GOOGLEREQUEST;

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminAddressDetailsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: LocationService, useValue: fakeLocationServiceMock },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminAddressDetailsComponent);
    component = fixture.componentInstance;
  });
  it('test', () => {
    expect(component).toBeTruthy();
  });
});
