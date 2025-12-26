import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { of } from 'rxjs';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup.component';
import { OrderService } from '../../../services/order.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { ActiveTariffInfo } from '../../../models/ubs.interface';
import { Language } from '../../../../../shared/i18n/Language';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UbsOrderLocationPopupComponent', () => {
  let component: UbsOrderLocationPopupComponent;
  let fixture: ComponentFixture<UbsOrderLocationPopupComponent>;
  let dialogMock: jasmine.SpyObj<MatDialogRef<UbsOrderLocationPopupComponent>>;
  let orderServiceMock: jasmine.SpyObj<OrderService>;
  let localStorageMock: jasmine.SpyObj<LocalStorageService>;
  let storeMock: jasmine.SpyObj<Store>;

  const fakeTariffs: ActiveTariffInfo[] = [
    {
      id: 1,
      tariffNameEn: 'Tariff 1',
      tariffNameUk: 'Тариф 1',
      descriptionMessageEn: 'Desc 1',
      descriptionMessageUk: 'Опис 1',
      tariffLocations: [
        {
          id: 1,
          latitude: 50.4501,
          longitude: 30.5234,
          regionNameEn: 'Kyiv Region',
          regionNameUk: 'Київська область',
          nameEn: 'Kyiv City',
          nameUk: 'Київ',
          tariffsId: 101
        },
        {
          id: 2,
          latitude: 49.8397,
          longitude: 24.0297,
          regionNameEn: 'Lviv Region',
          regionNameUk: 'Львівська область',
          nameEn: 'Lviv City',
          nameUk: 'Львів',
          tariffsId: 102
        }
      ]
    },
    {
      id: 2,
      tariffNameEn: 'Tariff 2',
      tariffNameUk: 'Тариф 2',
      descriptionMessageEn: 'Desc 2',
      descriptionMessageUk: 'Опис 2',
      tariffLocations: [
        {
          id: 1,
          latitude: 50.4501,
          longitude: 30.5234,
          regionNameEn: 'Kyiv Region',
          regionNameUk: 'Київська область',
          nameEn: 'Kyiv City',
          nameUk: 'Київ',
          tariffsId: 101
        },
        {
          id: 2,
          latitude: 49.8397,
          longitude: 24.0297,
          regionNameEn: 'Lviv Region',
          regionNameUk: 'Львівська область',
          nameEn: 'Lviv City',
          nameUk: 'Львів',
          tariffsId: 102
        }
      ]
    }
  ];

  beforeEach(async () => {
    dialogMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    orderServiceMock = jasmine.createSpyObj('OrderService', ['getActiveTariffsInfo', 'getTariffName', 'getTariffDescription']);
    localStorageMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'getTariffId', 'setTariffId', 'getUserId']);
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);

    orderServiceMock.getActiveTariffsInfo.and.returnValue(of(fakeTariffs));
    orderServiceMock.getTariffName.and.callFake((tariff: ActiveTariffInfo) => tariff.tariffNameEn);
    orderServiceMock.getTariffDescription.and.callFake((tariff: ActiveTariffInfo) => tariff.descriptionMessageEn);
    localStorageMock.getCurrentLanguage.and.returnValue('en' as Language);
    localStorageMock.getTariffId.and.returnValue(1);

    await TestBed.configureTestingModule({
      declarations: [UbsOrderLocationPopupComponent],
      imports: [ReactiveFormsModule, MatAutocompleteModule, TranslateModule.forRoot(), MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: LocalStorageService, useValue: localStorageMock },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UbsOrderLocationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should fetch activeTariffs and set selectedTariff', () => {
    expect(component.activeTariffs).toEqual(fakeTariffs);
    expect(component.selectedTariff).toEqual(fakeTariffs[0]);
    expect(component.myControl.value).toEqual(fakeTariffs[0]);
  });

  it('displayFn should return tariff name or empty string', () => {
    expect(component.displayFn(fakeTariffs[1])).toBe('Tariff 2');
    expect(component.displayFn(null)).toBe('');
  });

  it('getTariffName should call orderService.getTariffName', () => {
    const result = component.getTariffName(fakeTariffs[0]);
    expect(result).toBe('Tariff 1');
    expect(orderServiceMock.getTariffName).toHaveBeenCalledWith(fakeTariffs[0]);
  });

  it('changeTariff should update selectedTariff', () => {
    component.changeTariff(fakeTariffs[1]);
    expect(component.selectedTariff).toBe(fakeTariffs[1]);
  });

  it('closePopUp should call dialogRef.close', () => {
    component.closePopUp();
    expect(dialogMock.close).toHaveBeenCalled();
  });

  it('saveLocation should setTariffId, dispatch action and close dialog', () => {
    component.selectedTariff = fakeTariffs[1];
    component.saveLocation();
    expect(localStorageMock.setTariffId).toHaveBeenCalledWith(fakeTariffs[1].id);
    expect(storeMock.dispatch).toHaveBeenCalled();
    expect(dialogMock.close).toHaveBeenCalled();
  });
});
