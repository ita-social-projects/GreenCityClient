import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
// import { DropdownModule } from 'angular-bootstrap-md';
import { Language } from 'src/app/main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { LocationService } from '@global-service/location/location.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { ADDRESSESMOCK } from 'src/app/ubs/mocks/address-mock';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { Store } from '@ngrx/store';

xdescribe('UBSAddAddressPopUpComponent', () => {
  let component: UBSAddAddressPopUpComponent;
  let fixture: ComponentFixture<UBSAddAddressPopUpComponent>;

  const MatSnackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) => {};

  const fakeAddress = {
    id: 1,
    city: 'Київ',
    cityEn: 'Kyiv',
    district: 'Оболонський',
    districtEn: 'Obolonskyi',
    region: 'Київська область',
    regionEn: 'Kyiv region',
    entranceNumber: 13,
    street: 'fake street UA',
    streetEn: 'fake street EN',
    addressRegionDistrictList: ADDRESSESMOCK.DISTRICTSKYIVMOCK,
    houseCorpus: 12,
    houseNumber: 11,
    addressComment: 'fakeComment',
    actual: true,
    searchAddress: 'fakeStreet, fakeNumber, fakeCity, fakeRegion',
    coordinates: {
      latitude: 123,
      longitude: 456
    }
  };
  const fakeInitData = {
    edit: true,
    address: fakeAddress
  };

  const status = 'OK';

  const fakeMatDialogRef = jasmine.createSpyObj(['close']);

  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageBehaviourSubject',
    'getUserId',
    'getLocations'
  ]);
  fakeLocalStorageService.getCurrentLanguage = () => Language.UA as Language;
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject(Language.UA);

  const fakeGoogleScript = jasmine.createSpyObj('GoogleScript', ['load']);
  fakeGoogleScript.load.and.returnValue(of());

  const fakeLocationServiceMock = jasmine.createSpyObj('locationService', [
    'getDistrictAuto',
    'getFullAddressList',
    'getSearchAddress',
    'getRequest'
  ]);
  fakeLocationServiceMock.getDistrictAuto = () => ADDRESSESMOCK.PLACESTREETUK.address_components[1].long_name;
  fakeLocationServiceMock.getFullAddressList = () => of([]);
  fakeLocalStorageService.getSearchAddress = () => ADDRESSESMOCK.SEARCHADDRESS;
  fakeLocalStorageService.getRequest = () => ADDRESSESMOCK.GOOGLEREQUEST;

  const fakeLanguageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  fakeLanguageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return valUa;
  };

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        // DropdownModule,
        MatAutocompleteModule,
        TranslateModule.forRoot()
      ],
      declarations: [UBSAddAddressPopUpComponent],
      providers: [
        OrderService,
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: fakeInitData },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
        { provide: GoogleScript, useValue: fakeGoogleScript },
        { provide: LocationService, useValue: fakeLocationServiceMock },
        { provide: LanguageService, useValue: fakeLanguageServiceMock },
        { provide: Store, useValue: storeMock },

        UserOwnAuthService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSAddAddressPopUpComponent);
    component = fixture.componentInstance;
    const spy = spyOn(component as any, 'initGoogleAutocompleteServices');
    fixture.detectChanges();
    spy.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
