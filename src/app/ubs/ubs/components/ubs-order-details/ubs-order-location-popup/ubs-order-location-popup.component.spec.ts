import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup.component';
import { OrderService } from '../../../services/order.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { ActiveTariffInfo } from '../../../models/ubs.interface';
import { Language } from '../../../../../shared/i18n/Language';
import { TranslateModule } from '@ngx-translate/core';

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
      descriptionMessageUk: 'Опис 1'
    },
    {
      id: 2,
      tariffNameEn: 'Tariff 2',
      tariffNameUk: 'Тариф 2',
      descriptionMessageEn: 'Desc 2',
      descriptionMessageUk: 'Опис 2'
    }
  ];

  beforeEach(async () => {
    dialogMock = jasmine.createSpyObj('MatDialogRef', ['close']);
    orderServiceMock = jasmine.createSpyObj('OrderService', ['getActiveTariffsInfo', 'getTariffName', 'getTariffDescription']);
    localStorageMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'getTariffId', 'setTariffId']);
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);

    orderServiceMock.getActiveTariffsInfo.and.returnValue(of(fakeTariffs));
    orderServiceMock.getTariffName.and.callFake((tariff: ActiveTariffInfo) => tariff.tariffNameEn);
    orderServiceMock.getTariffDescription.and.callFake((tariff: ActiveTariffInfo) => tariff.descriptionMessageEn);
    localStorageMock.getCurrentLanguage.and.returnValue('en' as Language);
    localStorageMock.getTariffId.and.returnValue(1);

    await TestBed.configureTestingModule({
      declarations: [UbsOrderLocationPopupComponent],
      imports: [ReactiveFormsModule, MatAutocompleteModule, TranslateModule.forRoot(), MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: LocalStorageService, useValue: localStorageMock },
        { provide: Store, useValue: storeMock },
        provideMockStore({})
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

  it('getTariffDescription should return description if tariff exists', () => {
    component.activeTariffs = fakeTariffs;
    const result = component.getTariffDescription(2);
    expect(result).toBe('Desc 2');
    expect(orderServiceMock.getTariffDescription).toHaveBeenCalledWith(fakeTariffs[1]);
  });

  it('getTariffDescription should return null if tariff not found', () => {
    component.activeTariffs = fakeTariffs;
    const result = component.getTariffDescription(999);
    expect(result).toBeNull();
  });

  it('changeTariff should update selectedTariff', () => {
    component.changeTariff(fakeTariffs[1]);
    expect(component.selectedTariff).toBe(fakeTariffs[1]);
  });

  it('passDataToComponent should call dialogRef.close with correct payload', () => {
    component.selectedTariff = fakeTariffs[0];
    component.activeTariffs = fakeTariffs;
    component.passDataToComponent();
    expect(dialogMock.close).toHaveBeenCalledWith({
      tariff: fakeTariffs[0].id,
      currentLanguage: 'en',
      data: undefined,
      activeTariffs: fakeTariffs
    });
  });

  it('closePopUp should call dialogRef.close', () => {
    component.closePopUp();
    expect(dialogMock.close).toHaveBeenCalled();
  });

  it('saveLocation should setTariffId, dispatch action and close dialog', () => {
    component.selectedTariff = fakeTariffs[1];
    component.saveLocation();
    expect(localStorageMock.setTariffId).toHaveBeenCalledWith(fakeTariffs[1].id);
    expect(storeMock.dispatch).toHaveBeenCalled(); // можна додатково перевірити payload якщо хочеш
    expect(dialogMock.close).toHaveBeenCalled();
  });
});
