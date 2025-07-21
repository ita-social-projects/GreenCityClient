import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { InputGoogleAutocompleteComponent } from './input-google-autocomplete.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { of, Subject } from 'rxjs';
import { Language } from 'src/app/shared/i18n/Language';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GoogleScript } from '@assets/google-script/google-script';
import { GooglePrediction } from '@ubs/mocks/google-types';

describe('InputGoogleAutocompleteComponent', () => {
  let component: InputGoogleAutocompleteComponent;
  let fixture: ComponentFixture<InputGoogleAutocompleteComponent>;

  const languageServiceMock = jasmine.createSpyObj('LanguageService', ['getLangValue', 'getCurrentLanguage', 'getCurrentLangObs']);
  const googleScriptMapReadySubject = new Subject<boolean>();
  const googleScriptMock = {
    mapReady: googleScriptMapReadySubject
  };

  const previousGoogle = (window as any).google;

  const predictionList = [
    { description: 'Place 1', place_id: '1' } as google.maps.places.AutocompletePrediction,
    { description: 'Place 2', place_id: '2' } as google.maps.places.AutocompletePrediction
  ] as GooglePrediction[];

  let mockAutocompleteServiceInstance: jasmine.SpyObj<google.maps.places.AutocompleteService>;
  let mockGeocoderInstance: jasmine.SpyObj<google.maps.Geocoder>;

  let AutocompleteServiceConstructorSpy: jasmine.Spy;
  let GeocoderConstructorSpy: jasmine.Spy;

  class MockLatLng implements google.maps.LatLng {
    constructor(
      private latitude: number,
      private longitude: number
    ) {}

    lat(): number {
      return this.latitude;
    }
    lng(): number {
      return this.longitude;
    }
    equals(other: google.maps.LatLng | null): boolean {
      if (!other) {
        return false;
      }
      return this.lat() === other.lat() && this.lng() === other.lng();
    }
    toJSON(): google.maps.LatLngLiteral {
      return { lat: this.latitude, lng: this.longitude };
    }
    toUrlValue(precision?: number): string {
      return `${this.latitude},${this.longitude}`;
    }
    toString(): string {
      return `(${this.latitude}, ${this.longitude})`;
    }
  }

  class MockLatLngBounds implements google.maps.LatLngBounds {
    getCenter(): google.maps.LatLng {
      return new MockLatLng(0, 0);
    }
    getNorthEast(): google.maps.LatLng {
      return new MockLatLng(0, 0);
    }
    getSouthWest(): google.maps.LatLng {
      return new MockLatLng(0, 0);
    }
    contains(latLng: google.maps.LatLng): boolean {
      return true;
    }
    intersects(other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): boolean {
      return true;
    }
    isEmpty(): boolean {
      return false;
    }
    union(other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral): google.maps.LatLngBounds {
      return this;
    }
    extend(latLng: google.maps.LatLng): google.maps.LatLngBounds {
      return this;
    }
    equals(other: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral | null): boolean {
      return true;
    }
    toJSON(): google.maps.LatLngBoundsLiteral {
      return { north: 0, south: 0, east: 0, west: 0 };
    }
    toUrlValue(precision?: number): string {
      return '';
    }
    toString(): string {
      return '';
    }
    toSpan(): google.maps.LatLng {
      return new MockLatLng(0, 0);
    }
  }

  beforeEach(waitForAsync(async () => {
    languageServiceMock.getLangValue.and.returnValue('en');
    languageServiceMock.getCurrentLanguage.and.returnValue(Language.EN);
    languageServiceMock.getCurrentLangObs.and.returnValue(of(Language.EN));

    mockAutocompleteServiceInstance = jasmine.createSpyObj('AutocompleteService', ['getPlacePredictions']);
    mockGeocoderInstance = jasmine.createSpyObj('Geocoder', ['geocode']);

    mockAutocompleteServiceInstance.getPlacePredictions.and.callFake((request, callback) => {
      callback(predictionList, (window as any).google.maps.places.PlacesServiceStatus.OK);
      return Promise.resolve({ predictions: predictionList, status: (window as any).google.maps.places.PlacesServiceStatus.OK });
    });

    mockGeocoderInstance.geocode.and.callFake((params, callback) => {
      if (params.placeId === 'somePlaceId') {
        callback(
          [
            {
              address_components: [],
              geometry: {
                location: new MockLatLng(123, 456),
                location_type: (window as any).google.maps.GeocoderLocationType.ROOFTOP,
                viewport: new MockLatLngBounds()
              },
              formatted_address: 'Fake Geocoded Address',
              place_id: 'somePlaceId',
              types: ['street_address']
            }
          ],
          (window as any).google.maps.GeocoderStatus.OK
        );
      } else if (params.placeId === 'ukrainianPlaceId' || params.placeId === 'englishPlaceId') {
        callback(
          [
            {
              address_components: [],
              geometry: {
                location: new MockLatLng(111, 222),
                location_type: (window as any).google.maps.GeocoderLocationType.APPROXIMATE,
                viewport: new MockLatLngBounds()
              },
              formatted_address: 'Translated Address',
              place_id: params.placeId,
              types: ['street_address']
            }
          ],
          (window as any).google.maps.GeocoderStatus.OK
        );
      } else {
        callback([], (window as any).google.maps.GeocoderStatus.ZERO_RESULTS);
      }
      return Promise.resolve({ results: [], status: (window as any).google.maps.GeocoderStatus.ZERO_RESULTS });
    });

    AutocompleteServiceConstructorSpy = jasmine
      .createSpy('AutocompleteService constructor')
      .and.returnValue(mockAutocompleteServiceInstance);
    GeocoderConstructorSpy = jasmine.createSpy('Geocoder constructor').and.returnValue(mockGeocoderInstance);

    (window as any).google = {
      maps: {
        places: {
          AutocompleteService: AutocompleteServiceConstructorSpy,
          AutocompleteSessionToken: class {},
          PlacesServiceStatus: {
            OK: 'OK',
            ZERO_RESULTS: 'ZERO_RESULTS'
          }
        },
        Geocoder: GeocoderConstructorSpy,
        GeocoderStatus: {
          OK: 'OK',
          ZERO_RESULTS: 'ZERO_RESULTS'
        },
        GeocoderLocationType: {
          ROOFTOP: 'ROOFTOP',
          RANGE_INTERPOLATED: 'RANGE_INTERPOLATED',
          GEOMETRIC_CENTER: 'GEOMETRIC_CENTER',
          APPROXIMATE: 'APPROXIMATE'
        },
        LatLngBounds: MockLatLngBounds,
        LatLng: MockLatLng
      }
    };

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatAutocompleteModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [InputGoogleAutocompleteComponent],
      providers: [
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: GoogleScript, useValue: googleScriptMock }
      ]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(InputGoogleAutocompleteComponent);
    component = fixture.componentInstance;

    component.predictionList = predictionList;
    component.autocompleteService = mockAutocompleteServiceInstance;
    component.initPredictList();
    fixture.detectChanges();
  }));

  afterAll(() => {
    (window as any).google = previousGoogle;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize predictionList on input', fakeAsync(() => {
    mockAutocompleteServiceInstance.getPlacePredictions.calls.reset();
    component.predictionList = predictionList;

    component.inputValue.setValue('Place');
    fixture.detectChanges();

    expect(component.predictionList.length).toBe(2);
    tick(400);
  }));

  it('should filter unwanted results (country restriction)', fakeAsync(() => {
    component.autocompleteService = mockAutocompleteServiceInstance;

    mockAutocompleteServiceInstance.getPlacePredictions.calls.reset();
    mockAutocompleteServiceInstance.getPlacePredictions.and.callFake((request, callback) => {
      const customPredictionList = [
        { description: 'Place 1, Russia', place_id: '1' } as google.maps.places.AutocompletePrediction,
        { description: 'Place 2, Россия', place_id: '2' } as google.maps.places.AutocompletePrediction,
        { description: 'Place 3, Росія', place_id: '3' } as google.maps.places.AutocompletePrediction,
        { description: 'Place', place_id: '4' } as google.maps.places.AutocompletePrediction
      ];
      component.predictionList = customPredictionList;
      callback(customPredictionList, (window as any).google.maps.places.PlacesServiceStatus.OK);
      return Promise.resolve({ predictions: customPredictionList, status: (window as any).google.maps.places.PlacesServiceStatus.OK });
    });
    component.inputValue.setValue(', Place');
    fixture.detectChanges();
    tick(400);

    expect(component.predictionList.length).toBe(1);
    expect(component.predictionList[0].description).toBe('Place');
    expect(component.predictionList[0].place_id).toBe('4');
    expect(mockAutocompleteServiceInstance.getPlacePredictions).toHaveBeenCalled();
  }));

  it('should filter duplicates when current language is Ukrainian', fakeAsync(() => {
    languageServiceMock.getCurrentLanguage.and.returnValue(Language.UK);
    mockAutocompleteServiceInstance.getPlacePredictions.calls.reset();
    mockAutocompleteServiceInstance.getPlacePredictions.and.callFake((request, callback) => {
      const customPredictionList = [
        { description: 'вул. Центральна', place_id: '1' } as google.maps.places.AutocompletePrediction,
        { description: 'вулиця Центральна', place_id: '2' } as google.maps.places.AutocompletePrediction,
        { description: 'Проспект Свободи', place_id: '3' } as google.maps.places.AutocompletePrediction
      ];
      callback(customPredictionList, (window as any).google.maps.places.PlacesServiceStatus.OK);
      return Promise.resolve({ predictions: customPredictionList, status: (window as any).google.maps.places.PlacesServiceStatus.OK });
    });

    component.inputValue.setValue('some input');
    fixture.detectChanges();
    tick(400);

    expect(component.predictionList.length).toBe(2);
    expect(component.predictionList[0].description).toBe('вулиця Центральна');
    expect(component.predictionList[1].description).toBe('Проспект Свободи');
    expect(mockAutocompleteServiceInstance.getPlacePredictions).toHaveBeenCalled();
  }));

  it('should emit the input value on keyup', () => {
    spyOn(component.keyupEmitter, 'emit');
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    input.value = 'test value';
    const event = new KeyboardEvent('keyup');
    input.dispatchEvent(event);
    expect(component.keyupEmitter.emit).toHaveBeenCalledWith('test value');
  });

  it('should set inputValue and call onChange when writeValue is called', () => {
    spyOn<any>(component, 'onChange');
    component.writeValue('new value');
    expect(component.inputValue.value).toBe('new value');
    expect(component.onChange).toHaveBeenCalledWith('new value');
  });

  it('should assign onChange callback when registerOnChange is called', () => {
    const fn = () => {};
    component.registerOnChange(fn);
    expect(component.onChange).toBe(fn);
  });

  it('should assign onTouched callback when registerOnTouched is called', () => {
    const fn = () => {};
    component.registerOnTouched(fn);
    expect(component.onTouched).toBe(fn);
  });

  it('should disable the input control when setDisabledState is true', () => {
    component.setDisabledState(true);
    expect(component.inputValue.disabled).toBeTrue();
  });

  it('should enable the input control when setDisabledState is false', () => {
    component.inputValue.disable();
    component.setDisabledState(false);
    expect(component.inputValue.enabled).toBeTrue();
  });

  it('should mark as touched when markAsTouched is called for the first time', () => {
    spyOn(component, 'onTouched');
    component.touched = false;
    component.markAsTouched();
    expect(component.touched).toBeTrue();
    expect(component.onTouched).toHaveBeenCalled();
  });

  it('should not call onTouched again if already touched', () => {
    spyOn(component, 'onTouched');
    component.touched = true;
    component.markAsTouched();
    expect(component.onTouched).not.toHaveBeenCalled();
  });

  it('should clear predictionList when input is empty', fakeAsync(() => {
    component.inputValue.setValue('');
    fixture.detectChanges();
    tick(400);
    expect(component.predictionList.length).toBe(0);
  }));

  it('should handle null predictions gracefully', fakeAsync(() => {
    component.autocompleteService = mockAutocompleteServiceInstance;

    mockAutocompleteServiceInstance.getPlacePredictions.calls.reset();
    mockAutocompleteServiceInstance.getPlacePredictions.and.callFake((request, callback) => {
      callback(null, (window as any).google.maps.GeocoderStatus.ZERO_RESULTS);
      return Promise.resolve({ predictions: [], status: (window as any).google.maps.GeocoderStatus.ZERO_RESULTS });
    });
    component.inputValue.setValue('no results');
    fixture.detectChanges();
    tick(400);

    expect(component.predictionList.length).toBe(0);
  }));

  it('should reset input and emit null on onUserChange if city is not selected', fakeAsync(() => {
    component.isCitySelected = false;
    spyOn(component.inputValue, 'setValue');
    spyOn<any>(component, 'onChange');
    spyOn(component.predictionSelected, 'emit');
    spyOn(component.selectedPredictionCoordinates, 'emit');

    component.onUserChange();
    tick(100);

    expect(component.inputValue.setValue).toHaveBeenCalledWith('');
    expect(component.onChange).toHaveBeenCalledWith('');
    expect(component.predictionSelected.emit).toHaveBeenCalledWith(null);
    expect(component.selectedPredictionCoordinates.emit).toHaveBeenCalledWith({ longitude: null, latitude: null });
    expect(component.touched).toBeTrue();
  }));

  it('should not reset input or emit null on onUserChange if city is selected', fakeAsync(() => {
    component.isCitySelected = true;
    spyOn(component.inputValue, 'setValue');
    spyOn<any>(component, 'onChange');
    spyOn(component.predictionSelected, 'emit');
    spyOn(component.selectedPredictionCoordinates, 'emit');

    component.onUserChange();
    tick(100);

    expect(component.inputValue.setValue).not.toHaveBeenCalled();
    expect(component.onChange).not.toHaveBeenCalled();
    expect(component.predictionSelected.emit).not.toHaveBeenCalled();
    expect(component.selectedPredictionCoordinates.emit).not.toHaveBeenCalled();
  }));

  it('should unsubscribe on ngOnDestroy', () => {
    spyOn((component as any).destroy$, 'next');
    spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();
    expect((component as any).destroy$.next).toHaveBeenCalled();
    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });

  it('should call handlePredictions with correct arguments including requestPrefix', fakeAsync(() => {
    component.requestPrefix = 'Kyiv, ';
    spyOn(component, 'handlePredictions' as any).and.callThrough();

    component.autocompleteService = mockAutocompleteServiceInstance;
    mockAutocompleteServiceInstance.getPlacePredictions.calls.reset();
    mockAutocompleteServiceInstance.getPlacePredictions.and.callFake((request, callback) => {
      expect(request.input).toBe('Kyiv, some input');
      callback(predictionList, window.google.maps.places.PlacesServiceStatus.OK);
      return Promise.resolve({ predictions: predictionList, status: window.google.maps.places.PlacesServiceStatus.OK });
    });
    component.inputValue.setValue('some input');
    fixture.detectChanges();
    tick(400);

    expect(mockAutocompleteServiceInstance.getPlacePredictions).toHaveBeenCalled();
    expect((component as any).handlePredictions).toHaveBeenCalledWith(predictionList, 'Kyiv, ');
  }));

  it('should correct predictions based on chosenPlaceValues for complex prefixes', fakeAsync(() => {
    component.autocompleteService = mockAutocompleteServiceInstance;

    mockAutocompleteServiceInstance.getPlacePredictions.calls.reset();
    mockAutocompleteServiceInstance.getPlacePredictions.and.callFake((request, callback) => {
      const customPredictionList = [
        { description: 'Some Place, Lviv, Ukraine', place_id: '1' } as google.maps.places.AutocompletePrediction,
        { description: 'Another Place, city Kyiv, Ukraine', place_id: '2' } as google.maps.places.AutocompletePrediction,
        { description: 'Third Place, city Lviv, Ukraine', place_id: '3' } as google.maps.places.AutocompletePrediction
      ];
      component.predictionList = customPredictionList;
      callback(customPredictionList, window.google.maps.places.PlacesServiceStatus.OK);
      return Promise.resolve({ predictions: customPredictionList, status: window.google.maps.places.PlacesServiceStatus.OK });
    });

    component.requestPrefix = 'Ukraine, city Kyiv, ';
    component.inputValue.setValue('Third Place');
    fixture.detectChanges();
    tick(400);

    expect(component.predictionList.length).toBe(1);
    expect(component.predictionList[0].description).toBe('Another Place, city Kyiv, Ukraine');
  }));

  it('should apply requestSuffix to the input in getPlacePredictions', fakeAsync(() => {
    component.requestSuffix = ', Ukraine';
    mockAutocompleteServiceInstance.getPlacePredictions.calls.reset();
    mockAutocompleteServiceInstance.getPlacePredictions.and.callFake((request, callback) => {
      expect(request.input).toBe('some input, Ukraine');
      callback(predictionList, (window as any).google.maps.places.PlacesServiceStatus.OK);
      return Promise.resolve({ predictions: predictionList, status: (window as any).google.maps.places.PlacesServiceStatus.OK });
    });
    component.inputValue.setValue('some input');
    fixture.detectChanges();
    tick(400);

    expect(mockAutocompleteServiceInstance.getPlacePredictions).toHaveBeenCalled();
  }));

  it('should not filter duplicates if current language is English', fakeAsync(() => {
    languageServiceMock.getCurrentLanguage.and.returnValue(Language.EN);
    mockAutocompleteServiceInstance.getPlacePredictions.calls.reset();
    mockAutocompleteServiceInstance.getPlacePredictions.and.callFake((request, callback) => {
      const customPredictionList = [
        { description: 'Street Central', place_id: '1' } as google.maps.places.AutocompletePrediction,
        { description: 'Street Central', place_id: '2' } as google.maps.places.AutocompletePrediction,
        { description: 'Liberty Avenue', place_id: '3' } as google.maps.places.AutocompletePrediction
      ];
      callback(customPredictionList, (window as any).google.maps.places.PlacesServiceStatus.OK);
      return Promise.resolve({ predictions: customPredictionList, status: (window as any).google.maps.places.PlacesServiceStatus.OK });
    });

    component.inputValue.setValue('some input');
    fixture.detectChanges();
    tick(400);

    expect(component.predictionList.length).toBe(3);
    expect(component.predictionList[0].description).toBe('Street Central');
    expect(component.predictionList[1].description).toBe('Street Central');
    expect(component.predictionList[2].description).toBe('Liberty Avenue');
    expect(mockAutocompleteServiceInstance.getPlacePredictions).toHaveBeenCalled();
  }));
  
  it('should correctly validate region predictions', () => {
    const validPredictionsMock = [
      'Київська область, Україна',
      'Kyiv Oblast, Ukraine',
      'місто Київ, Україна',
      'city Kyiv, Ukraine',
      'Крим, Україна',
      'Crimea, Ukraine'
    ];

    const invalidPredictionsMock = ['Кхарківська, Україна', 'Керсонска, Україна', 'Khersonska, Ukraine'];

    validPredictionsMock.forEach((prediction) => {
      expect(component.regionValidation(prediction)).toBeTrue();
    });

    invalidPredictionsMock.forEach((prediction) => {
      expect(component.regionValidation(prediction)).toBeFalse();
    });
  });

});
