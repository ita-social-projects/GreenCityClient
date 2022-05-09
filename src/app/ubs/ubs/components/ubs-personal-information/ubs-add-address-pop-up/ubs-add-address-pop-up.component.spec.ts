import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { OrderService } from '../../../services/order.service';
import { Address } from '../../../models/ubs.interface';
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

describe('UBSAddAddressPopUpComponent', () => {
  let component: UBSAddAddressPopUpComponent;
  let fixture: ComponentFixture<UBSAddAddressPopUpComponent>;
  let orderService: OrderService;

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
    address: fakeAddress,
    currentLocation: 'fakeLocation'
  };
  const fakeData = [[['fakeUA', 'fakeEN']]];
  const fakeMatDialogRef = jasmine.createSpyObj(['close']);
  const fakeLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  fakeLocalStorageService.getCurrentLanguage = () => 'ua' as Language;

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
    const spy = spyOn(component as any, 'initGoogleAutocompleteServices');
    fixture.detectChanges();
    spy.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should set addAddressForm', () => {
    const spy = spyOn(component, 'onCitySelected');
    component.ngOnInit();
    expect(component.addAddressForm).toBeTruthy();
    expect(component.isDistrict).toBeTruthy();
    expect(component.currentLanguage).toBe('ua');
    expect(component.bigRegions).toEqual([{ regionName: 'Київська область', lang: 'ua' }]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('method ngAfterViewInit should invoke methods', () => {
    const inputTag = document.createElement('input');
    const spy = spyOn(component, 'setPredictStreets');
    spyOn(document, 'querySelector').and.returnValue(inputTag);
    const event = new Event('input');
    component.ngAfterViewInit();
    component.inputStreetElement.dispatchEvent(event);
    expect(spy).toHaveBeenCalledTimes(1);
    expect((component as any).initGoogleAutocompleteServices).toHaveBeenCalledTimes(1);
  });

  it('method onAutocompleteSelected should set values', () => {
    const eventMock = {
      name: 'fakeName',
      address_components: ['', '', { long_name: '' }]
    };
    const regionMock = 'fakeRegion';

    const spy = spyOn(component, 'translateStreet').and.callThrough();
    component.currentDistrict = regionMock;
    component.onAutocompleteSelected(eventMock);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(eventMock.name);
    expect(component.street.value).toBe('fakeUA');
    expect(component.streetEn.value).toBe('fakeEN');
  });

  it('method onDistrictSelected should invoke three another methods, and set region to addAddressForm', () => {
    const eventMock = {
      address_components: [{ long_name: 'Бучанський район' }]
    };
    const spy2 = spyOn(component, 'setDistrictAuto');
    const spy3 = spyOn(component, 'onAutocompleteSelected');

    component.onDistrictSelected(eventMock);

    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(component.addAddressForm.get('district').value).toBe('Оболонський');
  });

  it('method onNoClick should invoke destroyRef.close()', () => {
    component.onNoClick();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });

  it('method translateDistrict should invoke getJSON', () => {
    component.translateDistrict('fakeDistrict');
    expect(component.getJSON).toHaveBeenCalledWith('fakeDistrict');
    expect(component.district.value).toBe('fakeUA');
    expect(component.districtEn.value).toBe('fakeEN');
  });

  it('method translateStreet should invoke getJSON', () => {
    component.translateStreet('fakeStreet');
    expect(component.getJSON).toHaveBeenCalledWith('fakeStreet');
    expect(component.street.value).toBe('fakeUA');
    expect(component.streetEn.value).toBe('fakeEN');
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

  it('method onStreetSelected should invoke getDetails', () => {
    component.placeService = { getDetails: (a, b) => {} } as any;
    spyOn(component.placeService, 'getDetails').and.callThrough();
    const fakeStreetData = { place_id: 123 };
    component.onStreetSelected(fakeStreetData);
    expect(component.placeService.getDetails).toHaveBeenCalled();
  });

  it('method setDistrictAuto should set currentDistrict and invoke translateDistrict', () => {
    const event = { address_components: [{ long_name: 'fake district' }, { long_name: 'fake region' }] };
    const spy = spyOn(component, 'translateDistrict');
    component.setDistrictAuto(event as any);
    expect(component.currentDistrict).toBe('fake');
    expect(spy).toHaveBeenCalledWith('fake');
  });

  describe('selectCity', () => {
    it('makes expected calls if currentLanguage is "ua"', () => {
      const event = { target: { selectedIndex: 2, value: '012Київ' } };
      component.currentLanguage = 'ua';
      const spy = spyOn(component, 'onCitySelected');
      component.selectCity(event as any);
      expect(component.cityEn.value).toBe('Kyiv');
      expect(component.isDistrict).toBeTruthy();
      expect(spy).toHaveBeenCalledWith({
        northLat: 50.57230832685655,
        southLat: 50.54623397558239,
        eastLng: 30.34209295119151,
        westLng: 30.29022923521974
      });
    });

    it('makes expected calls if currentLanguage is "en"', () => {
      const event = { target: { selectedIndex: 2, value: '012Hatne' } };
      component.currentLanguage = 'en';
      const spy = spyOn(component, 'onCitySelected');
      component.selectCity(event as any);
      expect(component.city.value).toBe('Гатне');
      expect(component.isDistrict).toBeFalsy();
      expect(spy).toHaveBeenCalledWith({
        northLat: 50.57230832685655,
        southLat: 50.54623397558239,
        eastLng: 30.34209295119151,
        westLng: 30.29022923521974
      });
    });
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
      expect(component.districtEn.value).toBe("Fastivs'kyi");
    });

    it('makes expected calls if region is "Fastivs\'kyi" and currentLanguage is "en"', () => {
      component.isDistrict = false;
      component.currentLanguage = 'en';
      component.setDistrictTranslation("Fastivs'kyi");
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
