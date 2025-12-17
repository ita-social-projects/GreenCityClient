import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { OrderService } from '../../../services/order.service';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup.component';
import { Router } from '@angular/router';
import { activeCouriersMock } from 'src/app/ubs/ubs-admin/services/orderInfoMock';
import { provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { ActiveTariffInfo } from '../../../models/ubs.interface';

describe('UbsOrderLocationPopupComponent', () => {
  let component: UbsOrderLocationPopupComponent;
  let fixture: ComponentFixture<UbsOrderLocationPopupComponent>;
  const dialogMock = jasmine.createSpyObj('dialogRef', ['close']);

  const orderServiceMock = jasmine.createSpyObj('orderService', [
    'getActiveTariffsInfo',
    'getTariffName',
    'getTariffDescription',
    'getInfoAboutTariff'
  ]);
  const routerMock = jasmine.createSpyObj('router', ['navigate']);

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'getCurrentLanguage',
    'setLocationId',
    'setTariffId',
    'setLocations'
  ]);

  const fakeTariffs: ActiveTariffInfo[] = [
    {
      id: 1,
      tariffNameEn: 'Tariff 1',
      tariffNameUk: 'Тариф 1',
      descriptionMessageEn: 'Description 1',
      descriptionMessageUk: 'Опис 1'
    },
    {
      id: 2,
      tariffNameEn: 'Tariff 2',
      tariffNameUk: 'Тариф 2',
      descriptionMessageEn: 'Description 2',
      descriptionMessageUk: 'Опис 2'
    }
  ];

  beforeEach(async () => {
    localStorageServiceMock.getCurrentLanguage.and.returnValue('en');
    orderServiceMock.getActiveTariffsInfo.and.returnValue(of(fakeTariffs));
    orderServiceMock.getTariffName.and.returnValue('Tariff 1');
    orderServiceMock.getTariffDescription.and.returnValue('Description 1');
    orderServiceMock.getInfoAboutTariff.and.returnValue(
      of({
        orderIsPresent: true,
        tariffsForLocationDto: {
          locationsDtosList: [
            {
              locationId: 2,
              nameEn: 'fake location en'
            }
          ],
          tariffInfoId: 1
        }
      })
    );
    orderServiceMock.setLocationData.and.returnValue(undefined);
    orderServiceMock.completedLocation.and.returnValue(undefined);

    await TestBed.configureTestingModule({
      declarations: [UbsOrderLocationPopupComponent],
      imports: [HttpClientTestingModule, MatDialogModule, MatAutocompleteModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        provideMockStore({})
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderLocationPopupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should invoke method getActiveTariffsInfo()', () => {
    const spy = spyOn(orderServiceMock, 'getActiveTariffsInfo').and.callThrough();
    fixture.detectChanges();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('method saveLocation should call by click save button', fakeAsync(() => {
    fixture.detectChanges();
    const spy = spyOn(component, 'saveLocation');
    const btn = fixture.debugElement.query(By.css('.footer-btns .ubs-primary-global-button'));
    btn.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('method passDataToComponent should invoke this.dialogRef.close({})', () => {
    fixture.detectChanges();
    component.passDataToComponent();
    expect(dialogMock.close).toHaveBeenCalled();
  });

  describe('displayFn', () => {
    it('makes expected calls', () => {
      fixture.detectChanges();
      const tariff = {
        tariffNameEn: 'fakeNameEn',
        tariffNameUk: 'fakeNameUk'
      } as ActiveTariffInfo;
      const res = component.displayFn(tariff);
      expect(res).toBe('fakeNameEn');
    });

    it('makes expected calls if city is null', () => {
      fixture.detectChanges();
      const city = null;
      const res = component.displayFn(city);
      expect(res).toBe('');
    });
  });

  it('should initialize activeTariffs as empty array', () => {
    const componentInstance = new UbsOrderLocationPopupComponent(
      orderServiceMock as any,
      dialogMock as any,
      localStorageServiceMock as any,
      null
    );
    expect(componentInstance.activeTariffs).toEqual([]);
  });

  describe('getTariffName', () => {
    beforeEach(() => {
      fixture.detectChanges();
      orderServiceMock.getTariffName.calls.reset();
    });

    it('should return empty string when tariff is not found', () => {
      const result = component.getTariffName(null);

      expect(result).toBe('');
      expect(orderServiceMock.getTariffName).not.toHaveBeenCalled();
    });
  });

  describe('getTariffDescription', () => {
    beforeEach(() => {
      fixture.detectChanges();
      orderServiceMock.getTariffDescription.calls.reset();
    });

    it('should return tariff description when tariff is found', () => {
      (component as any).activeTariffs = fakeTariffs;
      orderServiceMock.getTariffDescription.and.returnValue('Description 1');

      const result = component.getTariffDescription(1);

      expect(result).toBe('Description 1');
      expect(orderServiceMock.getTariffDescription).toHaveBeenCalledWith(fakeTariffs[0]);
    });

    it('should return null when tariff is not found', () => {
      (component as any).activeTariffs = fakeTariffs;

      const result = component.getTariffDescription(999);

      expect(result).toBeNull();
      expect(orderServiceMock.getTariffDescription).not.toHaveBeenCalled();
    });

    it('should return null when activeTariffs is empty', () => {
      (component as any).activeTariffs = [];

      const result = component.getTariffDescription(1);

      expect(result).toBeNull();
      expect(orderServiceMock.getTariffDescription).not.toHaveBeenCalled();
    });

    it('should return correct description for different tariff ids', () => {
      (component as any).activeTariffs = fakeTariffs;
      orderServiceMock.getTariffDescription.and.returnValue('Description 2');

      const result = component.getTariffDescription(2);

      expect(result).toBe('Description 2');
      expect(orderServiceMock.getTariffDescription).toHaveBeenCalledWith(fakeTariffs[1]);
    });
  });
});
