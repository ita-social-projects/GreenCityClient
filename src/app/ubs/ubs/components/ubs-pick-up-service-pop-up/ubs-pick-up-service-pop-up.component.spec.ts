import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsPickUpServicePopUpComponent } from './ubs-pick-up-service-pop-up.component';
import { OrderService } from '@ubs/ubs/services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
