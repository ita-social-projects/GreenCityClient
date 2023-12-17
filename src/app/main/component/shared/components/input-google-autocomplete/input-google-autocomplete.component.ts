import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Coordinates } from '@global-user/models/edit-profile.model';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { GoogleAutoService, GooglePrediction } from 'src/app/ubs/mocks/google-types';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-input-google-autocomplete',
  templateUrl: './input-google-autocomplete.component.html',
  styleUrls: ['./input-google-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputGoogleAutocompleteComponent
    }
  ]
})
export class InputGoogleAutocompleteComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input('autoCompRequest') autoCompRequestProps?: google.maps.places.AutocompletionRequest;
  @Output() predictionSelectedEvent = new EventEmitter<Coordinates>();

  predictionList: GooglePrediction[];
  autocompleteService: GoogleAutoService;
  inputValue: string;
  disabled: boolean = false;
  touched: boolean = false;
  placeId: string;
  inputUpdate = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.initPredictList();

    this.languageService
      .getCurrentLangObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.placeId) {
          new google.maps.Geocoder()
            .geocode({ placeId: this.placeId, language: this.languageService.getLangValue('uk', 'en') as string })
            .then((response) => {
              this.inputValue = response.results[0].formatted_address;
            });
        }
      });
  }

  onUserChange() {
    this.inputValue = '';
    this.predictionSelectedEvent.emit({ longitude: null, latitude: null });
  }

  onChange = (val) => {};

  onTouched = () => {};

  writeValue(value: any): void {
    this.inputValue = value;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  initPredictList(): void {
    this.inputUpdate.pipe(takeUntil(this.destroy$), filter(Boolean), debounceTime(400)).subscribe((input) => {
      const regex = new RegExp(Patterns.countriesRestriction);
      const request = {
        input: input,
        language: this.languageService.getLangValue('uk', 'en') as string,
        ...this.autoCompRequestProps
      };
      this.autocompleteService.getPlacePredictions(request, (cityPredictionList) => {
        this.predictionList = cityPredictionList?.filter((city) => !regex.test(city.description)) ?? [];
      });
    });
  }

  onPredictionSelected(prediction: GooglePrediction): void {
    this.markAsTouched();
    this.onChange(prediction.description);
    this.placeId = prediction.place_id;
    new google.maps.Geocoder().geocode({ placeId: prediction.place_id }).then((response) => {
      const location = response.results[0].geometry.location;
      this.predictionSelectedEvent.emit({ longitude: location.lng(), latitude: location.lat() });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
