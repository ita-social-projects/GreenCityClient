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
    'getLocations',
    'getAllActiveCouriers',
    'getActiveTariffsInfo',
    'getLocationName',
    'getTariffName',
    'getTariffDescription',
    'getInfoAboutTariff',
    'setLocationData',
    'completedLocation'
  ]);
  const routerMock = jasmine.createSpyObj('router', ['navigate']);
  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'getCurrentLanguage',
    'setLocationId',
    'setTariffId',
    'setLocations'
  ]);

  const fakeData = {
    allActiveLocationsDtos: [
      {
        locations: [
          {
            locationId: 2,
            nameEn: 'fake location en',
            nameUk: 'fake location uk'
          }
        ],
        nameEn: 'fake name en',
        nameUk: 'fake name uk',
        regionId: 1
      }
    ],
    tariffsForLocationDto: null,
    orderIsPresent: true
  };

  const fakeDataWithLocationIdOne = {
    allActiveLocationsDtos: [
      {
        locations: [
          {
            locationId: 1,
            nameEn: 'Kyiv',
            nameUk: 'Київ'
          },
          {
            locationId: 2,
            nameEn: 'Lviv',
            nameUk: 'Львів'
          }
        ],
        nameEn: 'fake region en',
        nameUk: 'fake region uk',
        regionId: 1
      }
    ],
    tariffsForLocationDto: null,
    orderIsPresent: true
  };

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

  const activecouriersMock = activeCouriersMock;

  beforeEach(async () => {
    localStorageServiceMock.getCurrentLanguage.and.returnValue('en');
    orderServiceMock.getLocations.and.returnValue(of(fakeData));
    orderServiceMock.getAllActiveCouriers.and.returnValue(of(activecouriersMock));
    orderServiceMock.getActiveTariffsInfo.and.returnValue(of(fakeTariffs));
    orderServiceMock.getLocationName.and.returnValue('fake location en, fake name en');
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

  it('method ngOnInit should invoke method getActiveCouriers()', () => {
    const spy = spyOn(component, 'getActiveCouriers').and.callThrough();
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
      const city = {
        locationId: 3,
        locationName: 'fakeName'
      };
      const res = component.displayFn(city);
      expect(res).toBe('fakeName');
    });

    it('makes expected calls if city is null', () => {
      fixture.detectChanges();
      const city = null;
      const res = component.displayFn(city);
      expect(res).toBe('');
    });
  });

  describe('changeLocation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set selectedLocationId to the provided id', () => {
      const result = component.changeLocation(3, 'fakeCity, fakeRegion');

      expect(component.selectedLocationId).toBe(3);
      expect(result).toBe(3);
    });

    it('should set currentLocation to the first part of locationName', () => {
      component.changeLocation(5, 'Kyiv, Ukraine');

      expect(component.currentLocation).toBe('Kyiv');
    });

    it('should set selectedTariffId to the provided id', () => {
      component.changeLocation(7, 'Lviv, Ukraine');

      expect((component as any).selectedTariffId).toBe(7);
    });

    it('should return the provided id', () => {
      const result = component.changeLocation(10, 'Odesa, Ukraine');

      expect(result).toBe(10);
    });

    it('should handle location name without comma', () => {
      component.changeLocation(2, 'SingleName');

      expect(component.currentLocation).toBe('SingleName');
      expect(component.selectedLocationId).toBe(2);
      expect((component as any).selectedTariffId).toBe(2);
    });

    it('should set all three properties correctly in one call', () => {
      const id = 15;
      const locationName = 'TestCity, TestRegion';

      const result = component.changeLocation(id, locationName);

      expect(component.selectedLocationId).toBe(15);
      expect(component.currentLocation).toBe('TestCity');
      expect((component as any).selectedTariffId).toBe(15);
      expect(result).toBe(15);
    });

    it('should set selectedTariffId equal to provided id', () => {
      const testId = 42;
      const testLocation = 'Kharkiv, Ukraine';

      component.changeLocation(testId, testLocation);

      expect(component.selectedTariffId).toBe(testId);
    });
  });

  it('should initialize activeTariffs as empty array', () => {
    const componentInstance = new UbsOrderLocationPopupComponent(
      orderServiceMock as any,
      dialogMock as any,
      localStorageServiceMock as any,
      null,
      null
    );
    expect(componentInstance.activeTariffs).toEqual([]);
  });

  describe('getTariffName', () => {
    beforeEach(() => {
      fixture.detectChanges();
      orderServiceMock.getTariffName.calls.reset();
    });

    it('should return tariff name when tariff is found', () => {
      (component as any).activeTariffs = fakeTariffs;
      orderServiceMock.getTariffName.and.returnValue('Tariff 1');

      const result = component.getTariffName(1);

      expect(result).toBe('Tariff 1');
      expect(orderServiceMock.getTariffName).toHaveBeenCalledWith(fakeTariffs[0]);
    });

    it('should return empty string when tariff is not found', () => {
      (component as any).activeTariffs = fakeTariffs;

      const result = component.getTariffName(999);

      expect(result).toBe('');
      expect(orderServiceMock.getTariffName).not.toHaveBeenCalled();
    });

    it('should return empty string when activeTariffs is empty', () => {
      (component as any).activeTariffs = [];

      const result = component.getTariffName(1);

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

  describe('getLocations', () => {
    it('should set isFetching to true and then false', fakeAsync(() => {
      component.courierUBS = { courierId: 1, nameEn: 'UBS' };
      const subject = new Subject();
      orderServiceMock.getLocations.and.returnValue(subject.asObservable());

      expect(component.isFetching).toBe(false);

      component.getLocations();
      expect(component.isFetching).toBe(true);

      subject.next(fakeData);
      subject.complete();
      tick();

      expect(component.isFetching).toBe(false);
    }));

    it('should set selectedTariffId to locationId when city with locationId 1 is found', fakeAsync(() => {
      component.courierUBS = { courierId: 1, nameEn: 'UBS' };
      orderServiceMock.getLocations.and.returnValue(of(fakeDataWithLocationIdOne));
      orderServiceMock.getLocationName.and.returnValue('Kyiv, fake region en');

      component.getLocations();
      tick();

      expect(component.selectedTariffId).toBe(1);
      expect(component.selectedLocationId).toBe(1);
    }));

    it('should not set selectedTariffId when no city with locationId 1 exists', fakeAsync(() => {
      component.courierUBS = { courierId: 1, nameEn: 'UBS' };
      component.selectedTariffId = undefined;
      orderServiceMock.getLocations.and.returnValue(of(fakeData));

      component.getLocations();
      tick();

      expect(component.selectedTariffId).toBeUndefined();
    }));

    it('should populate cities array correctly', fakeAsync(() => {
      component.courierUBS = { courierId: 1, nameEn: 'UBS' };
      orderServiceMock.getLocations.and.returnValue(of(fakeDataWithLocationIdOne));
      orderServiceMock.getLocationName.and.callFake((city, region) => {
        return `${city.nameEn}, ${region.nameEn}`;
      });

      component.getLocations();
      tick();

      expect(component.cities.length).toBe(2);
      expect(component.cities[0].locationId).toBe(1);
      expect(component.cities[1].locationId).toBe(2);
    }));

    it('should call changeLocation when city with locationId 1 is found', fakeAsync(() => {
      component.courierUBS = { courierId: 1, nameEn: 'UBS' };
      orderServiceMock.getLocations.and.returnValue(of(fakeDataWithLocationIdOne));
      orderServiceMock.getLocationName.and.returnValue('Kyiv, fake region en');
      const changeLocationSpy = spyOn(component, 'changeLocation').and.callThrough();

      component.getLocations();
      tick();

      expect(changeLocationSpy).toHaveBeenCalledWith(1, 'Kyiv, fake region en');
    }));

    it('should set myControl value when city with locationId 1 is found', fakeAsync(() => {
      component.courierUBS = { courierId: 1, nameEn: 'UBS' };
      orderServiceMock.getLocations.and.returnValue(of(fakeDataWithLocationIdOne));
      orderServiceMock.getLocationName.and.returnValue('Kyiv, fake region en');

      component.getLocations();
      tick();

      expect(component.myControl.value).toEqual({
        locationId: 1,
        locationName: 'Kyiv, fake region en'
      });
    }));
  });

  describe('getActiveCouriers', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call getAllActiveCouriers and getActiveTariffsInfo', fakeAsync(() => {
      orderServiceMock.getAllActiveCouriers.calls.reset();
      orderServiceMock.getActiveTariffsInfo.calls.reset();

      fixture.detectChanges();
      component.getActiveCouriers();
      tick();

      expect(orderServiceMock.getAllActiveCouriers).toHaveBeenCalled();
      expect(orderServiceMock.getActiveTariffsInfo).toHaveBeenCalled();
    }));

    it('should set activeTariffs from response', fakeAsync(() => {
      fixture.detectChanges();
      component.getActiveCouriers();
      tick();

      expect(component.activeTariffs).toBe(fakeTariffs);
      expect(component.activeTariffs.length).toBe(2);
    }));

    it('should find courierUBS by nameEn containing "UBS"', fakeAsync(() => {
      fixture.detectChanges();
      const expectedCourier = activecouriersMock.find((c) => c.nameEn.includes('UBS'));

      component.getActiveCouriers();
      tick();

      expect(component.courierUBS).toEqual(expectedCourier);
    }));

    it('should call getAllActiveCouriers and getActiveTariffsInfo', fakeAsync(() => {
      orderServiceMock.getAllActiveCouriers.calls.reset();
      orderServiceMock.getActiveTariffsInfo.calls.reset();

      component.getActiveCouriers();
      tick();
      fixture.detectChanges();

      expect(orderServiceMock.getAllActiveCouriers).toHaveBeenCalled();
      expect(orderServiceMock.getActiveTariffsInfo).toHaveBeenCalled();
    }));

    it('should call getLocations and filterOptions when courierUBS is found', fakeAsync(() => {
      const getLocationsSpy = spyOn(component, 'getLocations');
      const filterOptionsSpy = spyOn(component, 'filterOptions');

      orderServiceMock.getAllActiveCouriers.and.returnValue(of([{ courierId: 1, nameEn: 'UBS Courier', nameUk: 'Кур’єр UBS' }]));
      orderServiceMock.getActiveTariffsInfo.and.returnValue(of(fakeTariffs));

      component.getActiveCouriers();
      tick();
      fixture.detectChanges();

      expect(component.courierUBS).toBeTruthy();
      expect(getLocationsSpy).toHaveBeenCalled();
      expect(filterOptionsSpy).toHaveBeenCalled();
    }));

    it('should not call getLocations when courierUBS is not found', fakeAsync(() => {
      orderServiceMock.getAllActiveCouriers.and.returnValue(of([]));
      const getLocationsSpy = spyOn(component, 'getLocations');
      fixture.detectChanges();

      component.getActiveCouriers();
      tick();

      expect(getLocationsSpy).not.toHaveBeenCalled();
    }));

    it('should not call filterOptions when courierUBS is not found', fakeAsync(() => {
      orderServiceMock.getAllActiveCouriers.and.returnValue(of([]));
      const filterOptionsSpy = spyOn(component, 'filterOptions');
      fixture.detectChanges();

      component.getActiveCouriers();
      tick();

      expect(filterOptionsSpy).not.toHaveBeenCalled();
    }));

    it('should handle forkJoin with both requests completing', fakeAsync(() => {
      const customTariffs: ActiveTariffInfo[] = [
        {
          id: 3,
          tariffNameEn: 'Custom Tariff',
          tariffNameUk: 'Кастомний тариф',
          descriptionMessageEn: 'Custom description',
          descriptionMessageUk: 'Кастомний опис'
        }
      ];
      const customCouriers = [{ courierId: 1, nameEn: 'UBS Courier' }];

      orderServiceMock.getActiveTariffsInfo.and.returnValue(of(customTariffs));
      orderServiceMock.getAllActiveCouriers.and.returnValue(of(customCouriers));
      fixture.detectChanges();

      component.getActiveCouriers();
      tick();

      expect(component.activeTariffs).toBe(customTariffs);
      expect(component.courierUBS).toEqual(customCouriers[0]);
    }));
  });

  describe('passDataToComponent', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should close dialog with correct data', () => {
      component.selectedLocationId = 5;
      (component as any).currentLanguage = 'uk';
      component.locations = {
        allActiveLocationsDtos: [
          {
            regionId: 1,
            nameUk: 'Область 1',
            nameEn: 'Region 1',
            locations: [{ locationId: 5, nameUk: 'Київ', nameEn: 'Kyiv' }]
          }
        ]
      } as any;
      component.activeTariffs = [{ id: 1, tariffNameUk: 'Тариф 1', tariffNameEn: 'Tariff 1' }] as any;

      component.passDataToComponent();

      expect(dialogMock.close).toHaveBeenCalledWith({
        locationId: 5,
        currentLanguage: 'uk',
        data: component.locations,
        activeTariffs: component.activeTariffs
      });
    });
  });
});
