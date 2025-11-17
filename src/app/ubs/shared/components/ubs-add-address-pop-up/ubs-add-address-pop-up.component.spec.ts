import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component, forwardRef } from '@angular/core';
import { of } from 'rxjs';
import { Language } from 'src/app/shared/i18n/Language';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { LocationService } from '@ubs/ubs-user/services/location/location.service';
import { UserOwnAuthService } from 'src/app/shared/services/auth/user-own-auth.service';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { ADDRESSESMOCK } from 'src/app/ubs/mocks/address-mock';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { Store } from '@ngrx/store';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Component({
  selector: 'app-address-input',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => MockAddressInputComponent)
    }
  ]
})
class MockAddressInputComponent implements ControlValueAccessor {
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}
}

describe('UBSAddAddressPopUpComponent', () => {
  let component: UBSAddAddressPopUpComponent;
  let fixture: ComponentFixture<UBSAddAddressPopUpComponent>;

  const MatSnackBarMock: MatSnackBarService = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);
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
    street: 'fake street UK',
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
  fakeLocalStorageService.getCurrentLanguage = () => Language.UK as Language;
  fakeLocalStorageService.languageBehaviourSubject = new BehaviorSubject(Language.UK);

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
  fakeLanguageServiceMock.getLangValue = (valUa: string, valEn: string) => valUa;

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, MatAutocompleteModule, TranslateModule.forRoot()],
      declarations: [UBSAddAddressPopUpComponent, MockAddressInputComponent],
      providers: [
        OrderService,
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: fakeInitData },
        { provide: MatSnackBarService, useValue: MatSnackBarMock },
        { provide: LocalStorageService, useValue: fakeLocalStorageService },
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
