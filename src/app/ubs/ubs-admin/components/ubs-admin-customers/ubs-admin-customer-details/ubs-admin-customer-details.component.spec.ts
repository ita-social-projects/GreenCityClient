import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';

import { UbsAdminCustomerDetailsComponent } from './ubs-admin-customer-details.component';

describe('UbsAdminCustomerDetailsComponent', () => {
  let component: UbsAdminCustomerDetailsComponent;
  let fixture: ComponentFixture<UbsAdminCustomerDetailsComponent>;

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCustomer', 'removeCurrentCustomer']);
  let locationMock: Location;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [UbsAdminCustomerDetailsComponent],
      providers: [{ provide: LocalStorageService, useValue: localStorageServiceMock }, Location],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomerDetailsComponent);
    component = fixture.componentInstance;
    locationMock = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('goBack() should be called', () => {
    const spyLock = spyOn(locationMock, 'back');
    component.goBack();
    expect(spyLock).toHaveBeenCalled();
  });
});
