import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UBSAddAddressPopUpComponent } from './ubs-add-address-pop-up.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { DropdownModule } from 'angular-bootstrap-md';
import { Language } from 'src/app/main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { Address } from 'src/app/ubs/ubs/models/ubs.interface';

describe('UBSAddAddressPopUpComponent', () => {
  let component: UBSAddAddressPopUpComponent;
  let fixture: ComponentFixture<UBSAddAddressPopUpComponent>;
  let orderService: OrderService;

  const fakeLocation = {
    tariffInfoId: 1,
    minAmountOfBigBags: 2,
    maxAmountOfBigBags: 999,
    minPriceOfOrder: 500,
    maxPriceOfOrder: 50000,
    courierLimit: 'LIMIT_BY_SUM_OF_ORDER',
    courierStatus: null,
    regionDto: {
      regionId: 1,
      nameEn: 'Kyiv region',
      nameUk: 'Київська область'
    },
    locationsDtosList: [
      {
        locationId: 1,
        nameEn: 'Kyiv',
        nameUk: 'Київ'
      }
    ],
    courierTranslationDtos: [
      {
        name: 'UBS',
        languageCode: 'en'
      },
      {
        name: 'УБС',
        languageCode: 'ua'
      }
    ]
  };

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
  const fakeData = [[['fakeUA', 'fakeEN']]];
  const fakeMatDialogRef = jasmine.createSpyObj(['close']);
  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'getCurrentRegion',
    'getCurrentCity',
    'getLocations'
  ]);
  fakeLocalStorageService.getLocations = () => fakeLocation;
  fakeLocalStorageService.getCurrentLanguage = () => 'ua' as Language;
  fakeLocalStorageService.getCurrentCity = () => 'Kyiv';
  fakeLocalStorageService.getCurrentRegion = () => 'Kyiv region';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        DropdownModule,
        MatAutocompleteModule,
        TranslateModule.forRoot()
      ],
      declarations: [UBSAddAddressPopUpComponent],
      providers: [
        OrderService,
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: fakeInitData },
        { provide: MatSnackBarComponent, useValue: {} },
        { provide: LocalStorageService, useValue: fakeLocalStorageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSAddAddressPopUpComponent);
    component = fixture.componentInstance;
    spyOn(component, 'getJSON').and.returnValue(of(fakeData));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deleteAddress', () => {
    component.isDisabled = true;
    orderService = TestBed.inject(OrderService);
    spyOn(orderService, 'deleteAddress').and.returnValue(of(true));
    component.deleteAddress();
    expect((component as any).orderService.deleteAddress).toHaveBeenCalledTimes(1);
    expect(component.isDisabled).toBeFalsy();
  });

  it('method onNoClick should invoke destroyRef.close()', () => {
    component.onNoClick();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });

  it('method translateDistrict should invoke getJSON', () => {
    component.translateDistrict('fakeDistrict');
    expect(component.getJSON).toHaveBeenCalledWith('fakeDistrict');
    expect(component.district.value).toBe('fakeEN');
    expect(component.districtEn.value).toBe('fakeUA');
  });

  it('method setDistrict should invoke setDistrictTranslation', () => {
    const event = { target: { value: '012fakeValue' } };
    const spy = spyOn(component, 'setDistrictTranslation');
    component.setDistrict(event as any);
    expect(spy).toHaveBeenCalledWith('fakeValue');
  });

  it('method setFormattedAddress should set formattedAddress', () => {
    const event = { formatted_address: 'fakeAddress' };
    component.setFormattedAddress(event as any);
    expect(component.formattedAddress).toBe('fakeAddress');
  });

  describe('setDistrictTranslation', () => {
    it('makes expected calls if region is "Оболонський" and currentLanguage is "ua"', () => {
      component.isDistrict = true;
      component.currentLanguage = 'ua';
      component.setDistrictTranslation('Оболонський');
      expect(component.districtEn.value).toBe('Obolonskyi');
    });

    it('makes expected calls if region is "Obolonskyi" currentLanguage is "en"', () => {
      component.isDistrict = true;
      component.currentLanguage = 'en';
      component.setDistrictTranslation('Obolonskyi');
      expect(component.district.value).toBe('Оболонський');
    });

    it('makes expected calls if region is "Фастівський" and currentLanguage is "ua"', () => {
      component.isDistrict = false;
      component.currentLanguage = 'ua';
      component.setDistrictTranslation('Фастівський');
      expect(component.districtEn.value).toBe(`Fastivs'kyi`);
    });

    it('makes expected calls if region is "Fastivs\'kyi" and currentLanguage is "en"', () => {
      component.isDistrict = false;
      component.currentLanguage = 'en';
      component.setDistrictTranslation(`Fastivs'kyi`);
      expect(component.district.value).toBe('Фастівський');
    });
  });

  it('component function addAdress should set updatedAddresses from via orderService', () => {
    const response: { addressList: Address[] } = { addressList: [] };
    orderService = TestBed.inject(OrderService);
    spyOn(orderService, 'addAdress').and.returnValue(of(response));
    spyOn(orderService, 'updateAdress').and.returnValue(of(response));
    component.addAdress();
    fixture.detectChanges();
    expect(component.updatedAddresses).toEqual(response.addressList);
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
});
