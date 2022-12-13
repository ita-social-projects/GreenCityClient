import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { FilterLocationListByLangPipe } from 'src/app/shared/filter-location-list-by-lang/filter-location-list-by-lang.pipe';
import { OrderService } from '../../../services/order.service';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup.component';
import { Router } from '@angular/router';

describe('UbsOrderLocationPopupComponent', () => {
  let component: UbsOrderLocationPopupComponent;
  let fixture: ComponentFixture<UbsOrderLocationPopupComponent>;
  const dialogMock = jasmine.createSpyObj('dialogRef', ['close']);
  const orderServiceMock = jasmine.createSpyObj('orderService', ['getLocations']);
  const routerMock = jasmine.createSpyObj('router', ['navigate']);
  const fakeData = {
    allActiveLocationsDtos: [
      {
        locations: [
          {
            locationId: 2,
            nameEn: 'fake location en',
            nameUk: 'fake location ua'
          }
        ],
        nameEn: 'fake name en',
        nameUk: 'fake name ua',
        regionId: 1
      }
    ],
    tariffsForLocationDto: null,
    orderIsPresent: true
  };
  orderServiceMock.getLocations.and.returnValue(of(fakeData));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsOrderLocationPopupComponent, FilterLocationListByLangPipe],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: fakeData },
        { provide: Router, useValue: routerMock }
      ],
      imports: [HttpClientTestingModule, MatDialogModule, MatAutocompleteModule, TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsOrderLocationPopupComponent);
    component = fixture.componentInstance;
    component.data = fakeData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should invoke method getLocations()', () => {
    const spy = spyOn(component, 'getLocations').and.callFake(() => {});
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('method saveLocation should call by click save button', fakeAsync(() => {
    const spy = spyOn(component, 'saveLocation');
    const btn = fixture.debugElement.query(By.css('.primary-global-button'));
    btn.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('method passDataToComponent should invoke this.dialogRef.close({})', () => {
    component.passDataToComponent();
    expect(dialogMock.close).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy$ = new Subject<boolean>();
    spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect((component as any).destroy$.complete).toHaveBeenCalledTimes(1);
  });

  describe('displayFn', () => {
    it('makes expected calls', () => {
      const city = {
        locationId: 3,
        locationName: 'fakeName'
      };
      const res = component.displayFn(city);
      expect(res).toBe('fakeName');
    });

    it('makes expected calls if city is null', () => {
      const city = null;
      const res = component.displayFn(city);
      expect(res).toBe('');
    });
  });

  it('method _filter should return filtered data', () => {
    const cities = [
      {
        locationId: 1,
        locationName: `city, region`
      }
    ];
    component.cities = cities;
    const city = (component as any)._filter('CITY');
    expect(component.currentLocation).toBeNull();
    expect(city).toEqual(cities);
  });

  it('method getLocations should set cities for "en"', () => {
    const cities = [
      {
        locationId: 2,
        locationName: `fake location en, fake name en`
      }
    ];
    (component as any).currentLanguage = 'en';
    component.getLocations();
    expect(component.isFetching).toBeFalsy();
    expect(component.cities).toEqual(cities);
  });

  it('method getLocations should set cities for "ua"', () => {
    const cities = [
      {
        locationId: 2,
        locationName: `fake location ua, fake name ua`
      }
    ];
    (component as any).currentLanguage = 'ua';
    component.getLocations();
    expect(component.isFetching).toBeFalsy();
    expect(component.cities).toEqual(cities);
  });

  it('expected result in changeLocation', () => {
    component.changeLocation(3, 'fakeCity, fakeRegion');
    expect(component.selectedLocationId).toBe(3);
    expect(component.currentLocation).toBe('fakeCity');
  });
});
