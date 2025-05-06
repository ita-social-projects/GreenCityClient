import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsPickUpServicePopUpComponent } from './ubs-pick-up-service-pop-up.component';
import { OrderService } from '@ubs/ubs/services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { CourierDto } from '@ubs/ubs/models/ubs.interface';
import { orderDetailsSelector, tariffIdIdSelector } from 'src/app/store/selectors/order.selectors';
import { GetCourierLocations, GetOrderDetails } from 'src/app/store/actions/order.actions';
import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: '<div></div>'
})
export class MockSpinnerComponent {}

describe('UbsPickUpServicePopUpComponent', () => {
  let component: UbsPickUpServicePopUpComponent;
  let fixture: ComponentFixture<UbsPickUpServicePopUpComponent>;

  const mockOrderService = {
    getAllActiveCouriers: jasmine.createSpy().and.returnValue(of([])),
    getLocations: jasmine.createSpy().and.returnValue(of({ allActiveLocationsDtos: [] })),
    getLocationName: jasmine.createSpy().and.callFake((city, region) => `${region.regionName} - ${city.name}`)
  };

  const mockLocalStorageService = {
    getCurrentLanguage: jasmine.createSpy().and.returnValue('en')
  };

  const mockStore = {
    dispatch: jasmine.createSpy(),
    select: jasmine.createSpy()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ReactiveFormsModule],
      declarations: [UbsPickUpServicePopUpComponent, MockSpinnerComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: Store, useValue: mockStore }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsPickUpServicePopUpComponent);
    component = fixture.componentInstance;
    component.myControl = new FormControl();
    // component.destroy$ = new Subject();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadLocations if courierUBS is found', () => {
    const couriers = [{ nameEn: 'UBS', courierId: 1 } as CourierDto];
    component.courierUBSName = 'UBS';
    spyOn(component, 'loadLocations');
    mockOrderService.getAllActiveCouriers.and.returnValue(of(couriers));

    component.getActiveCouriers();

    expect(component.courierUBS).toEqual(couriers[0]);
    expect(component.loadLocations).toHaveBeenCalled();
  });
  it('should not call loadLocations if courierUBS is not found', () => {
    const couriers = [{ nameEn: 'OtherCourier' }];
    component.courierUBSName = 'UBS';
    spyOn(component, 'loadLocations');
    mockOrderService.getAllActiveCouriers.and.returnValue(of(couriers));

    component.getActiveCouriers();

    expect(component.courierUBS).toBeUndefined();
    expect(component.loadLocations).not.toHaveBeenCalled();
  });

  it('should populate cities and set default city in loadLocations', () => {
    component.courierUBS = { courierId: 1 } as CourierDto;
    const mockResponse = {
      allActiveLocationsDtos: [
        {
          regionName: 'Region1',
          locations: [
            { locationId: 1, name: 'City1' },
            { locationId: 2, name: 'City2' }
          ]
        }
      ]
    };
    mockOrderService.getLocations.and.returnValue(of(mockResponse));
    spyOn(component, 'updateDataBasedOnLocation');
    spyOn(component, 'listenToLocationChanges');

    component.loadLocations();

    expect(component.cities.length).toBe(2);
    expect(component.myControl.value).toEqual({
      locationId: 2,
      locationName: 'Region1 - City2'
    });
    expect(component.updateDataBasedOnLocation).toHaveBeenCalledWith(2);
    expect(component.listenToLocationChanges).toHaveBeenCalled();
  });

  it('should listen to location changes and update based on new location', () => {
    spyOn(component, 'updateDataBasedOnLocation');
    component.listenToLocationChanges();

    const newCity = { locationId: 10 };
    component.myControl.setValue(newCity);

    expect(component.updateDataBasedOnLocation).toHaveBeenCalledWith(10);
  });

  it('should update bags and set isFetching to false', fakeAsync(() => {
    component.courierUBS = { courierId: 1 } as any;

    mockStore.select.and.callFake((selector) => {
      if (selector === tariffIdIdSelector) {
        return of(1, 2); // emits [1, 2] for pairwise
      }
      if (selector === orderDetailsSelector) {
        return of({ bags: [{ id: 1 }] }, { bags: [{ id: 1 }, { id: 2 }, { id: 3 }] }); // emits [prev, curr] for pairwise
      }
      return of();
    });

    component.updateDataBasedOnLocation(123);

    tick(); // flush all observables

    expect(component.bags).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(component.isFetching).toBeFalse();
  }));
});
