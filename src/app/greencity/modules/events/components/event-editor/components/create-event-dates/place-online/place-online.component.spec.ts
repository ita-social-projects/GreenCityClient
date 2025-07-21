import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlaceOnlineComponent } from './place-online.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleScript } from '@assets/google-script/google-script';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { defaultCoordinates } from '@assets/mocks/events/mock-events';
import { PlaceOnline } from 'src/app/greencity/modules/events/models/events.interface';
import { TranslateModule } from '@ngx-translate/core';

declare global {
  interface Window {
    google: any;
  }
}

describe('PlaceOnlineComponent', () => {
  let component: PlaceOnlineComponent;
  let fixture: ComponentFixture<PlaceOnlineComponent>;
  let languageServiceMock: jasmine.SpyObj<LanguageService>;
  let googleScriptMock: jasmine.SpyObj<GoogleScript>;
  let localStorageServiceMock: jasmine.SpyObj<LocalStorageService>;
  let formBuilder: FormBuilder;

  const createMockDaysForm = (numDays: number, initialValues: any[] = []) => {
    const fb = new FormBuilder();
    const formArray = fb.array<FormGroup>([]);
    for (let i = 0; i < numDays; i++) {
      formArray.push(
        fb.group({
          onlineLink: [initialValues[i]?.onlineLink || ''],
          coordinates: [initialValues[i]?.coordinates || { latitude: null, longitude: null }],
          place: [initialValues[i]?.place || ''],
          appliedLinkForAll: [initialValues[i]?.appliedLinkForAll || false],
          appliedPlaceForAll: [initialValues[i]?.appliedPlaceForAll || false]
        })
      );
    }
    return formArray;
  };

  beforeEach(async () => {
    languageServiceMock = jasmine.createSpyObj('LanguageService', ['getLangValue']);
    languageServiceMock.getLangValue.and.returnValue('mockValue');

    googleScriptMock = jasmine.createSpyObj('GoogleScript', ['load', 'mapReady']);
    googleScriptMock.load.and.returnValue(Promise.resolve());
    googleScriptMock.mapReady = of(true);

    localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['languageBehaviourSubject']);
    localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');

    await TestBed.configureTestingModule({
      declarations: [PlaceOnlineComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: GoogleScript, useValue: googleScriptMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    formBuilder = TestBed.inject(FormBuilder);
    fixture = TestBed.createComponent(PlaceOnlineComponent);
    component = fixture.componentInstance;

    component.dayNumber = 0;
    component.daysForm = createMockDaysForm(3, [
      { onlineLink: 'initialLink', coordinates: { latitude: 10, longitude: 20 }, place: 'initialPlace' },
      {},
      {}
    ]);
    component.dayFormGroup = component.daysForm.controls[0] as FormGroup;
    component.formDisabled = false;

    fixture.detectChanges();

    component.map = {
      googleMap: {} as any,
      center: { lat: 0, lng: 0 },
      panTo: jasmine.createSpy('panTo'),
      setCenter: jasmine.createSpy('setCenter')
    } as any;

    window.google = {
      maps: {
        Map: function () {},
        Geocoder: function () {
          return {
            geocode: (request: any, callback: (results: any[], status: any) => void) => {
              if (request.language === 'uk') {
                callback(
                  [
                    {
                      formatted_address: 'Українська адреса',
                      address_components: [
                        { types: ['street_number'], long_name: '1' },
                        { types: ['route'], long_name: 'Вулиця' },
                        { types: ['locality'], long_name: 'Місто' },
                        { types: ['administrative_area_level_1'], long_name: 'Область' },
                        { types: ['country'], long_name: 'Україна' }
                      ]
                    }
                  ],
                  'OK'
                );
              } else {
                callback(
                  [
                    {
                      formatted_address: 'English Address',
                      address_components: [
                        { types: ['street_number'], long_name: '1' },
                        { types: ['route'], long_name: 'Street' },
                        { types: ['locality'], long_name: 'City' },
                        { types: ['administrative_area_level_1'], long_name: 'Region' },
                        { types: ['country'], long_name: 'Ukraine' }
                      ]
                    }
                  ],
                  'OK'
                );
              }
            }
          };
        },
        places: {
          Autocomplete: function (input: any, options: any) {
            return {
              addListener: jasmine.createSpy('addListener').and.callFake((event, callback) => {
                if (event === 'place_changed') {
                  this.placeChangedCallback = callback;
                }
              }),
              getPlace: () => ({
                geometry: {
                  location: {
                    lat: () => 30,
                    lng: () => 40
                  }
                },
                formatted_address: 'Mocked Place Address'
              }),
              unbindAll: jasmine.createSpy('unbindAll')
            };
          },
          PlacesService: function (map: any) {
            return {};
          }
        },
        LatLngLiteral: function () {},
        GeocoderStatus: { OK: 'OK' }
      }
    };

    component.placesRef = {
      nativeElement: document.createElement('input')
    } as ElementRef;
  });

  afterEach(() => {
    delete window.google;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formGroup and properties on ngOnInit', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.isOnline).toBeTrue();
    expect(component.isPlaceSelected).toBeTrue();
    expect(component.mapOptions).toBeDefined();
  });

  it('should call applyInitialSettings and subscribeToFormChanges if dayNumber is not 0', () => {
    component.dayNumber = 1;
    spyOn(component, 'applyInitialSettings').and.callThrough();
    spyOn<any>(component, 'subscribeToFormChanges').and.callThrough();
    component.ngOnInit();
    expect(component.applyInitialSettings).toHaveBeenCalled();
    expect(component['subscribeToFormChanges']).toHaveBeenCalled();
  });

  it('should toggleForAllLink and apply link to all days', fakeAsync(() => {
    spyOn(component, 'applyLinkToAllDays');
    spyOn<any>(component, 'subscribeToLinkChanges');
    component.appliedLinkForAll.setValue(false);
    component.link.setValue('testLink');

    component.toggleForAllLink();
    tick(151);

    expect(component.appliedLinkForAll.value).toBeTrue();
    expect(component.applyLinkToAllDays).toHaveBeenCalledWith('testLink', true);
    expect(component['subscribeToLinkChanges']).toHaveBeenCalled();

    component.toggleForAllLink();
    tick(151);
    expect(component.appliedLinkForAll.value).toBeFalse();
    expect(component.applyLinkToAllDays).toHaveBeenCalledWith('', false);
    expect(component['subscribeToLinkChanges']).toHaveBeenCalledTimes(1);
  }));

  it('should toggleForAllLocations and apply location to all days', fakeAsync(() => {
    spyOn(component, 'applyLocationToAllDays');
    spyOn<any>(component, 'subscribeToPlaceChanges');
    component.appliedPlaceForAll.setValue(false);
    component.coordinates.setValue({ latitude: 100, longitude: 200 });
    component.place.setValue('newPlace');

    component.toggleForAllLocations();
    tick(151);

    expect(component.appliedPlaceForAll.value).toBeTrue();

    expect(component.applyLocationToAllDays).toHaveBeenCalledWith({ latitude: 100, longitude: 200 }, 'newPlace', true);
    expect(component['subscribeToPlaceChanges']).toHaveBeenCalled();

    component.toggleForAllLocations();
    tick(151);
    expect(component.appliedPlaceForAll.value).toBeFalse();
    expect(component.applyLocationToAllDays).toHaveBeenCalledWith({ ...defaultCoordinates, ...component['defaultPosition'] }, '', false);
    expect(component['subscribeToPlaceChanges']).toHaveBeenCalledTimes(1);
  }));

  it('should apply initial settings correctly', () => {
    const firstDayMock = {
      onlineLink: 'firstDayLink',
      coordinates: { latitude: 50, longitude: 60 },
      place: 'firstDayPlace',
      appliedLinkForAll: true,
      appliedPlaceForAll: true
    };
    component.isOnline = false;
    component.isPlaceSelected = false;

    component.applyInitialSettings(firstDayMock);

    expect(component.isOnline).toBeTrue();
    expect(component.isLinkDisabled).toBeTrue();
    expect(component.isPlaceDisabled).toBeTrue();
    expect(component.isPlaceSelected).toBeTrue();
    expect(component.place.disabled).toBeTrue();
    expect(component.formGroup.controls.appliedLinkForAll.value).toBeTrue();
    expect(component.formGroup.controls.onlineLink.value).toBe('firstDayLink');
    expect(component.formGroup.controls.appliedPlaceForAll.value).toBeTrue();
    expect(component.formGroup.controls.coordinates.value).toEqual(firstDayMock.coordinates);
    expect(component.formGroup.controls.place.value).toBe('firstDayPlace');
  });

  it('should subscribe to form changes for appliedLinkForAll', fakeAsync(() => {
    component.dayNumber = 1;
    component.ngOnInit();
    tick(151);
    fixture.detectChanges();

    component.appliedLinkForAll.setValue(true);
    tick();
    expect(component.isOnline).toBeTrue();
    expect(component.isLinkDisabled).toBeTrue();

    component.appliedLinkForAll.setValue(false);
    tick();
    expect(component.isOnline).toBeFalse();
    expect(component.isLinkDisabled).toBeFalse();
  }));

  it('should subscribe to form changes for appliedPlaceForAll', fakeAsync(() => {
    component.dayNumber = 1;
    component.ngOnInit();
    tick(151);
    fixture.detectChanges();

    component.appliedPlaceForAll.setValue(true);
    tick();
    expect(component.isPlaceDisabled).toBeTrue();
    expect(component.isPlaceSelected).toBeTrue();
    expect(component.place.disabled).toBeTrue();

    component.appliedPlaceForAll.setValue(false);
    tick();
    expect(component.isPlaceDisabled).toBeFalse();
    expect(component.isPlaceSelected).toBeFalse();
    expect(component.place.enabled).toBeTrue();
  }));

  it('should subscribe to place changes and apply location to all days', fakeAsync(() => {
    spyOn(component, 'applyLocationToAllDays');
    component.dayNumber = 0;
    component.ngOnInit();
    component.toggleForAllLocations();
    tick(151);

    (component.applyLocationToAllDays as jasmine.Spy).calls.reset();

    const firstDayPlaceControl = (component.daysForm.controls[0] as FormGroup).controls.place as FormControl;
    const firstDayCoordinatesControl = (component.daysForm.controls[0] as FormGroup).controls.coordinates as FormControl;

    firstDayCoordinatesControl.setValue({ latitude: 70, longitude: 80 });
    firstDayPlaceControl.setValue('Updated Place');
    tick();

    expect(component.applyLocationToAllDays).toHaveBeenCalledWith({ latitude: 70, longitude: 80 }, 'Updated Place', true);
  }));

  it('should subscribe to link changes and apply link to all days', fakeAsync(() => {
    spyOn(component, 'applyLinkToAllDays');
    component.dayNumber = 0;
    component.ngOnInit();
    component.toggleForAllLink();
    tick(151);

    (component.applyLinkToAllDays as jasmine.Spy).calls.reset();

    const firstDayLinkControl = (component.daysForm.controls[0] as FormGroup).controls.onlineLink as FormControl;
    firstDayLinkControl.setValue('Updated Link');
    tick();

    expect(component.applyLinkToAllDays).toHaveBeenCalledWith('Updated Link', true);
  }));

  it('should unsubscribe from place changes', () => {
    component.dayNumber = 0;
    component.ngOnInit();
    component.toggleForAllLocations();
    expect(component['subPlace']).toBeDefined();
    component['unsubscribeFromPlaceChanges']();
    expect(component['subPlace']).toBeNull();
  });

  it('should unsubscribe from link changes', () => {
    component.dayNumber = 0;
    component.ngOnInit();
    component.toggleForAllLink();
    expect(component['subLink']).toBeDefined();
    component['unsubscribeFromLinkChanges']();
    expect(component['subLink']).toBeNull();
  });

  it('should apply location to all days correctly', () => {
    const coords: PlaceOnline = { latitude: 10, longitude: 20 };
    const place = 'Test Place';
    component.applyLocationToAllDays(coords, place, true);

    component.daysForm.controls.slice(1).forEach((control) => {
      expect(control.value.coordinates).toEqual(coords);
      expect(control.value.place).toBe(place);
      expect(control.value.appliedPlaceForAll).toBeTrue();
      expect(control.valid).toBeTrue();
    });
  });

  it('should apply link to all days correctly', () => {
    const onlineLink = 'http://test.com';
    component.applyLinkToAllDays(onlineLink, true);

    component.daysForm.controls.slice(1).forEach((control) => {
      expect(control.value.onlineLink).toBe(onlineLink);
      expect(control.value.appliedLinkForAll).toBeTrue();
      expect(control.valid).toBeTrue();
    });
  });

  it('should toggleOnline correctly (activate link)', () => {
    component.isOnline = false;
    component.link.setValue('');
    spyOn(component.link, 'setValidators').and.callThrough();
    spyOn(component.link, 'updateValueAndValidity').and.callThrough();

    component.toggleOnline();

    expect(component.isOnline).toBeTrue();
    expect(component.link.hasValidator(Validators.required)).toBeTrue();
    expect(component.link.updateValueAndValidity).toHaveBeenCalled();
  });

  it('should toggleOnline correctly (deactivate link)', () => {
    component.isOnline = true;
    component.link.setValue('http://valid.com');
    component.link.setValidators([Validators.required]);
    spyOn(component.link, 'clearValidators').and.callThrough();
    spyOn(component.link, 'updateValueAndValidity').and.callThrough();

    component.toggleOnline();

    expect(component.isOnline).toBeFalse();
    expect(component.link.validator).toBeNull();
    expect(component.link.value).toBe('');
    expect(component.link.updateValueAndValidity).toHaveBeenCalled();
  });

  it('should toggleLocation correctly (activate place)', () => {
    component.isPlaceSelected = false;
    component.place.setValue('');
    component.coordinates.setValue({ latitude: null, longitude: null });
    component['_lastLocation'] = { coordinates: { latitude: 50, longitude: 60 }, place: 'Last Known Place' };

    spyOn(component.place, 'setValidators').and.callThrough();
    spyOn(component.place, 'updateValueAndValidity').and.callThrough();

    component.toggleLocation();

    expect(component.isPlaceSelected).toBeTrue();
    expect(component['isPlaceSelected$'].value).toBeTrue();
    expect(component.place.hasValidator(Validators.required)).toBeTrue();
    expect(component.place.updateValueAndValidity).toHaveBeenCalled();
    expect(component.coordinates.value).toEqual({ latitude: 50, longitude: 60 });
    expect(component.place.value).toBe('Last Known Place');
  });

  it('should update map and location on mapClick if place is selected', fakeAsync(() => {
    component.isPlaceSelected = true;
    spyOn<any>(component, 'updateMapAndLocation');
    const mockLatLng = { lat: 10, lng: 20 };
    component.mapClick({ latLng: { toJSON: () => mockLatLng } } as google.maps.MapMouseEvent);
    expect(component['updateMapAndLocation']).toHaveBeenCalledWith(mockLatLng);
  }));

  it('should not update map and location on mapClick if place is not selected', () => {
    component.isPlaceSelected = false;
    spyOn<any>(component, 'updateMapAndLocation');
    const mockLatLng = { lat: 10, lng: 20 };
    component.mapClick({ latLng: { toJSON: () => mockLatLng } } as google.maps.MapMouseEvent);
    expect(component['updateMapAndLocation']).not.toHaveBeenCalled();
  });

  it('should set up autocomplete and handle place_changed event', fakeAsync(() => {
    spyOn<any>(component, 'updateMapAndLocation');
    spyOn<any>(component, '_setPlaceAutocomplete').and.callThrough();
    component['isPlaceSelected$'].next(true);
    component.showMap = true;
    component['initializeGoogleMapUtilities']();
    tick(151);

    const autocompleteInstance = component['_autocomplete'];
    expect(autocompleteInstance).toBeDefined();
  }));

  it('should update map correctly', () => {
    const latLng = { lat: 10, lng: 20 };
    component['updateMap'](latLng);
    expect(component.mapMarkerCoords).toEqual(latLng);
    expect(component.map.panTo).toHaveBeenCalledWith(latLng);
    expect(component.map.center).toEqual(latLng);
  });

  it('should update map with default coords if lat/lng are missing', () => {
    const latLng = { lat: null, lng: 0 };
    component['updateMap'](latLng as any);
    expect(component.mapMarkerCoords).toEqual({ lat: 0, lng: 0 });
    expect(component.map.panTo).not.toHaveBeenCalled();
    expect(component.map.center).toEqual({ lat: 0, lng: 0 });
  });

  it('should update map and location with geocoding results', fakeAsync(async () => {
    const latLng = { lat: 10, lng: 20 };
    component['googleGeocoder'] = new window.google.maps.Geocoder();
    spyOn<any>(component, 'updateMap').and.callThrough();
    spyOn(component.coordinates, 'patchValue').and.callThrough();
    spyOn(component.place, 'setValue').and.callThrough();

    await component['updateMapAndLocation'](latLng);
    tick();

    expect(component['updateMap']).toHaveBeenCalledWith(latLng);
    expect(component.coordinates.patchValue).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formattedAddressUk: 'Українська адреса',
        houseNumber: '1',
        streetUk: 'Вулиця',
        cityUk: 'Місто',
        regionUk: 'Область',
        countryUk: 'Україна'
      })
    );
    expect(component.coordinates.patchValue).toHaveBeenCalledWith(
      jasmine.objectContaining({
        formattedAddressEn: 'English Address',
        streetEn: 'Street',
        cityEn: 'City',
        regionEn: 'Region',
        countryEn: 'Ukraine',
        longitude: 20,
        latitude: 10
      })
    );
    expect(component['_lastLocation'].coordinates).toEqual(component.coordinates.value);
    expect(component['_lastLocation'].place).toEqual(component.place.value);
  }));

  it('should set place input based on coordinates', () => {
    component.coordinates.patchValue({
      latitude: 10,
      longitude: 20,
      formattedAddressUk: 'Українська адреса',
      formattedAddressEn: 'English Address'
    });
    languageServiceMock.getLangValue.and.returnValue('Українська адреса');
    component['setPlace']();
    expect(component.place.value).toBe('Українська адреса');

    languageServiceMock.getLangValue.and.returnValue('English Address');
    component['setPlace']();
    expect(component.place.value).toBe('English Address');
  });

  it('should set map options based on initial coordinates or default', () => {
    component.coordinates.patchValue({ latitude: 100, longitude: 200 });
    component['setMapOptions']();
    expect(component.mapOptions.center).toEqual({ lat: 100, lng: 200 });

    component.coordinates.patchValue({ latitude: null, longitude: null });
    component['setMapOptions']();
    expect(component.mapOptions.center).toEqual(component['defaultPosition'].coords);
  });

  it('should cleanup Google Map utilities on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component['_autocomplete']).toBeNull();
    expect(component['googleGeocoder']).toBeNull();
    expect(component['googlePlacesService']).toBeNull();
  });

  it('should complete subjects on ngOnDestroy', () => {
    spyOn(component['$destroy'], 'next');
    spyOn(component['$destroy'], 'complete');
    spyOn(component['isPlaceSelected$'], 'complete');

    component.ngOnDestroy();

    expect(component['$destroy'].next).toHaveBeenCalled();
    expect(component['$destroy'].complete).toHaveBeenCalled();
    expect(component['isPlaceSelected$'].complete).toHaveBeenCalled();
  });

  it('should not call updateMapAndLocation if googleGeocoder is null', async () => {
    component['googleGeocoder'] = null;
    spyOn<any>(component, 'updateMap');
    await component['updateMapAndLocation']({ lat: 1, lng: 1 });
    expect(component['updateMap']).not.toHaveBeenCalled();
  });

  it('should not call updateMapAndLocation if latLngLiteral is null', async () => {
    component['googleGeocoder'] = new window.google.maps.Geocoder();
    spyOn<any>(component, 'updateMap');
    await component['updateMapAndLocation'](null);
    expect(component['updateMap']).not.toHaveBeenCalled();
  });
});
