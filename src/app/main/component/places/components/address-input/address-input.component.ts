import { AfterViewInit, Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import LatLngLiteral = google.maps.LatLngLiteral;

interface Created {
  address: string;
  coords: undefined | LatLngLiteral;
}

@Component({
  selector: 'app-place-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor, AfterViewInit {
  address: Created = { address: '', coords: undefined };
  @ViewChild('inputElement') inputElement: ElementRef;
  touched = false;
  disabled = false;
  private _regionOptions: google.maps.places.AutocompleteOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };

  constructor(
    private translate: TranslateService,
    public localStorageService: LocalStorageService
  ) {}

  onTouched = () => {};

  onChange = (value: Created) => {};

  ngAfterViewInit() {
    this._initAutocomplete();
    this.setDisabledState = (disabled: boolean) => {
      this.disabled = disabled;
      this.inputElement.nativeElement.disabled = disabled;
    };
  }

  writeValue(value: Created): void {
    this.address = value;
    if (this.inputElement) {
      this.inputElement.nativeElement.value = value.address;
    }
  }

  registerOnChange(fn: (value: Created) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const quantity = control.value;
    if (quantity.address === '') {
      return {
        mustBePositive: {
          quantity
        }
      };
    }
  }

  setDisabledState(isDisabled: boolean) {}

  private _initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.inputElement.nativeElement, this._regionOptions);
    autocomplete.addListener('place_changed', () => {
      this.markAsTouched();
      const locationName = autocomplete.getPlace();
      if (locationName.formatted_address) {
        const lat = locationName.geometry.location.lat();
        const lng = locationName.geometry.location.lng();
        const coords = { lat, lng };
        this.address = { coords, address: locationName.formatted_address };
        this.onChange(this.address);
      }
    });
  }
}
