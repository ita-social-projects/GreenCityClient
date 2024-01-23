import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { InputGoogleAutocompleteComponent } from './input-google-autocomplete.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { of } from 'rxjs';
import { Language } from 'src/app/main/i18n/Language';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

class MockLanguageService {
  getCurrentLangObs() {
    return of(Language.EN);
  }

  getLangValue(lang1: string, lang2: string) {
    return lang2;
  }
}

describe('InputGoogleAutocompleteComponent', () => {
  let component: InputGoogleAutocompleteComponent;
  let fixture: ComponentFixture<InputGoogleAutocompleteComponent>;

  const predictionList = [
    { description: 'Place 1', place_id: '1' },
    { description: 'Place 2', place_id: '2' }
  ];

  beforeEach(async(() => {
    (window as any).google = {
      maps: {
        places: {
          AutocompleteService: class {
            getPlacePredictions(request, callback) {
              return Promise.resolve(callback(predictionList, 'OK'));
            }
          }
        },
        Geocoder: class {
          geocode(params) {
            return Promise.resolve({
              results: [{ geometry: { location: { lat: () => 123, lng: () => 456 } } }]
            });
          }
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatAutocompleteModule, FormsModule],
      declarations: [InputGoogleAutocompleteComponent],
      providers: [
        { provide: LanguageService, useClass: MockLanguageService },
        { provide: HttpClient, useValue: HttpClientTestingModule }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputGoogleAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set input value through writeValue', fakeAsync(() => {
    const inputValue = 'Some Address';
    component.writeValue(inputValue);
    const inputElement = fixture.nativeElement.querySelector('input');
    fixture.detectChanges();
    flush();
    expect(component.inputValue).toEqual(inputValue);
    expect(inputElement.value).toEqual(inputValue);
  }));

  it('should emit predictionSelectedEvent on prediction selection', fakeAsync(() => {
    const prediction = { description: 'Some Place', place_id: 'somePlaceId' } as google.maps.places.AutocompletePrediction;

    const geocodeSpy = spyOn(google.maps.Geocoder.prototype, 'geocode').and.callThrough();

    const emitSpy = spyOn(component.predictionSelectedEvent, 'emit');

    component.onPredictionSelected(prediction);
    tick();

    expect(emitSpy).toHaveBeenCalledWith({ longitude: 456, latitude: 123 });
    expect(component.placeId).toBe('somePlaceId');
    expect(geocodeSpy).toHaveBeenCalledWith({ placeId: prediction.place_id });
  }));

  it('should initialise predictionList on input', fakeAsync(() => {
    const getPlacePredictionsSpy = spyOn(google.maps.places.AutocompleteService.prototype, 'getPlacePredictions').and.callThrough();
    component.inputUpdate.next('some input');
    fixture.detectChanges();
    tick(400);

    expect(component.predictionList.length).toBe(2);
    expect(getPlacePredictionsSpy).toHaveBeenCalled();
  }));

  it('should filter unwanted results', fakeAsync(() => {
    const getPlacePredictionsSpy = spyOn(google.maps.places.AutocompleteService.prototype, 'getPlacePredictions').and.callFake(
      (request, callback) => {
        const predList = [
          { description: 'Place 1, Россия', place_id: '1' } as google.maps.places.AutocompletePrediction,
          { description: 'Place 2, Russia', place_id: '2' } as google.maps.places.AutocompletePrediction,
          { description: 'Place 3, Росія', place_id: '3' } as google.maps.places.AutocompletePrediction,
          { description: 'Place 4', place_id: '4' } as google.maps.places.AutocompletePrediction
        ];

        const promise = Promise.resolve({
          predictions: predList,
          status: status as any
        });

        promise.then((response) => callback(response.predictions, response.status));
        return promise;
      }
    );
    component.initPredictList();
    component.inputUpdate.next('some input');
    fixture.detectChanges();
    tick(500);
    flush();
    console.log(component.predictionList);

    expect(component.predictionList.length).toBe(1);
    expect(component.predictionList[0].description).toBe('Place 4');
    expect(component.predictionList[0].place_id).toBe('4');
    expect(getPlacePredictionsSpy).toHaveBeenCalled();
  }));
});
