import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Coordinates } from '@global-user/models/edit-profile.model';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
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
  @Input() isInvalid = false;
  @Input() requestPrefix = '';
  @Input() requestSuffix = '';
  @Input() autoCompRequest?: google.maps.places.AutocompletionRequest;
  @Input() isReturnCoordinates = false;
  @Input() isInitAutoTranslate = false;
  @Input() control: AbstractControl;

  @Output() selectedPredictionCoordinates = new EventEmitter<Coordinates>();
  @Output() predictionSelected = new EventEmitter<GooglePrediction | null>();

  disabled = false;
  touched = false;
  predictionList: GooglePrediction[];
  autocompleteService: GoogleAutoService;
  placeId: string;
  inputUpdate = new Subject<string>();
  inputValue: FormControl = new FormControl('');
  private destroy$ = new Subject<void>();

  onChange = (quantity) => {};
  onTouched = () => {};

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.initPredictList();

    if (this.isInitAutoTranslate) {
      this.initAutoTranslate();
    }
  }

  initAutoTranslate(): void {
    this.languageService
      .getCurrentLangObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.placeId) {
          new google.maps.Geocoder()
            .geocode({ placeId: this.placeId, language: this.languageService.getLangValue('uk', 'en') as string })
            .then((response) => {
              this.inputValue.setValue(response.results[0].formatted_address);
            });
        }
      });
  }

  onUserChange() {
    this.inputValue.setValue('');
    this.onChange('');
    this.markAsTouched();
    this.predictionSelected.emit(null);
    this.selectedPredictionCoordinates.emit({ longitude: null, latitude: null });
  }

  writeValue(value: any): void {
    this.inputValue.setValue(value, { emitEvent: false });
    this.onChange(value);
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.inputValue.disable() : this.inputValue.enable();
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  initPredictList(): void {
    this.inputValue.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(400)).subscribe((input: string) => {
      if (input) {
        const regex = new RegExp(Patterns.countriesRestriction);
        const request = {
          input: `${this.requestPrefix ?? ''}${input}${this.requestSuffix ?? ''}`,
          language: this.languageService.getLangValue('uk', 'en') as string,
          ...this.autoCompRequest
        };

        this.autocompleteService.getPlacePredictions(request, (cityPredictionList) => {
          this.predictionList = cityPredictionList?.filter((city) => !regex.test(city.description)) ?? [];
        });
      } else {
        this.predictionList = [];
      }
    });
  }

  onPredictionSelected(prediction: GooglePrediction): void {
    this.markAsTouched();
    this.onChange(prediction.description);

    if (this.isReturnCoordinates) {
      this.returnCoordinatesFromPrediction(prediction);
    }

    this.predictionSelected.emit(prediction);
  }
  returnCoordinatesFromPrediction(prediction: GooglePrediction) {
    this.placeId = prediction.place_id;
    new google.maps.Geocoder().geocode({ placeId: prediction.place_id }).then((response) => {
      const location = response.results[0].geometry.location;
      this.selectedPredictionCoordinates.emit({ longitude: location.lng(), latitude: location.lat() });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
