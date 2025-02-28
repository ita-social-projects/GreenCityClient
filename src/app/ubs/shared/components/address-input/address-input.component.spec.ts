import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressInputComponent } from './address-input.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { LanguageService } from 'src/app/shared/i18n/language.service';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLanguage', 'getCurrentLangObs']);
  languageServiceMock.getLangValue.and.returnValue('fakeTag');
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');
  languageServiceMock.getCurrentLangObs.and.returnValue(of('ua'));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressInputComponent],
      imports: [HttpClientTestingModule, StoreModule.forRoot({}), TranslateModule.forRoot(), MatAutocompleteModule, ReactiveFormsModule],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the form correctly', () => {
    component.addressForm.setValue({
      region: 'Kyiv',
      city: 'Kyiv',
      street: 'Main Street',
      district: 'District 1',
      houseNumber: '123',
      houseCorpus: '',
      entranceNumber: '',
      placeId: 'place123',
      addressComment: ''
    });
    expect(component.addressForm.valid).toBeTrue();
  });

  it('should enable the city field when region is selected', () => {
    component.region.setValue('Kyiv');
    component['onRegionValueSet']('Kyiv');
    expect(component.city.disabled).toBeFalse();
  });

  it('should reset street and house info when city is reset', () => {
    component.city.setValue('Kyiv');
    component['onCityValueSet']('');
    expect(component.street.value).toBe('');
    expect(component.houseNumber.value).toBe('');
  });

  it('should update addressData when house number changes', () => {
    spyOn(component.addressData, 'setHouseNumber');
    component.houseNumber.setValue('42');
    component.onHouseNumberChange();
    expect(component.addressData.setHouseNumber).toHaveBeenCalledWith('42');
  });

  it('should call handleGeolocationSuccess when setCurrentLocation is triggered', () => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success) => {
      const mockPosition: GeolocationPosition = {
        coords: {
          latitude: 50.45,
          longitude: 30.52,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON: () => ({})
        },
        timestamp: Date.now()
      } as any;
      success(mockPosition);
    });

    spyOn<any>(component, 'handleGeolocationSuccess');
    component['setCurrentLocation']();
    expect(component['handleGeolocationSuccess']).toHaveBeenCalled();
  });
});
