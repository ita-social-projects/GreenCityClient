import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsPickUpServicePopUpComponent } from './ubs-pick-up-service-pop-up.component';
import { OrderService } from '@ubs/ubs/services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Component } from '@angular/core';
import { GetOrderDetails } from '../../../../store/actions/order.actions';
import { OrderDetails } from '@ubs/ubs/models/ubs.interface';
import { Language } from '../../../../shared/i18n/Language';

@Component({
  selector: 'app-spinner',
  template: '<div></div>'
})
export class MockSpinnerComponent {}

describe('UbsPickUpServicePopUpComponent', () => {
  let component: UbsPickUpServicePopUpComponent;
  let fixture: ComponentFixture<UbsPickUpServicePopUpComponent>;
  let storeSpy: jasmine.SpyObj<Store>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  const mockTariffs = [
    { id: 10, tariffNameEn: 'Tariff1', tariffNameUk: 'Тариф1' },
    { id: 11, tariffNameEn: 'Tariff2', tariffNameUk: 'Тариф2' }
  ];
  const mockOrderDetails: OrderDetails = { bags: [{ id: 1, nameEn: 'Bag 1', quantity: 1 }], points: 100 } as OrderDetails;

  beforeEach(waitForAsync(() => {
    orderServiceSpy = jasmine.createSpyObj('OrderService', ['getActiveTariffsInfo', 'getLocationName', 'getTariffName']);
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'getTariffId']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    orderServiceSpy.getActiveTariffsInfo.and.returnValue(of(mockTariffs));
    orderServiceSpy.getLocationName.and.callFake((city, region) => `${region} - ${city}`);
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    localStorageServiceSpy.getTariffId.and.returnValue(mockTariffs[0].id);
    storeSpy.select.and.returnValue(of(mockOrderDetails));

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ReactiveFormsModule],
      declarations: [UbsPickUpServicePopUpComponent, MockSpinnerComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: Store, useValue: storeSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsPickUpServicePopUpComponent);
    component = fixture.componentInstance;
    component.myControl = new FormControl();
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should set currentLanguage on init', () => {
    component.ngOnInit();
    expect(localStorageServiceSpy.getCurrentLanguage).toHaveBeenCalled();
    expect(component.currentLanguage).toBe('en');
  });

  it('should call getActiveTariffs and set myControl value', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(orderServiceSpy.getActiveTariffsInfo).toHaveBeenCalled();
    expect(component.tariffs).toEqual(mockTariffs);
    expect(component.myControl.value).toEqual(mockTariffs[0]);
  }));

  it('should dispatch GetOrderDetails on myControl value change', fakeAsync(() => {
    component.ngOnInit();
    tick();
    const tariff = mockTariffs[1];
    component.myControl.setValue(tariff);
    tick();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(GetOrderDetails({ tariffId: tariff.id }));
  }));

  it('should set bags from orderDetailsSelector', fakeAsync(() => {
    component.ngOnInit();
    tick();
    component.myControl.setValue(mockTariffs[0]);
    tick();
    expect(component.bags).toEqual(mockOrderDetails.bags);
  }));
});
