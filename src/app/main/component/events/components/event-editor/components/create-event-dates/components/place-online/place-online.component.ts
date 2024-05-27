import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dateFormValidator } from './validators/dateFormValidator';
import { DefaultCoordinates } from '../../../../../../models/event-consts';
import { Subscription } from 'rxjs';
import { GeocoderService } from '@global-service/geocoder/geocoder.service';
import { FormBridgeService } from '../../../../../../services/form-bridge.service';
import { Patterns } from '../../../../../../../../../../assets/patterns/patterns';
import { FormEmitter, PlaceOnline, PlaceOnlineGroup } from '../../../../../../models/events.interface';

@Component({
  selector: 'app-place-online',
  templateUrl: './place-online.component.html',
  styleUrls: ['./place-online.component.scss'],
  providers: []
})
export class PlaceOnlineComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild('placesRef') placesRef: ElementRef;

  public isPlaceSelected = false;
  public isOnline = false;
  public isPlaceDisabled = false;
  public isLinkDisabled: boolean;
  public isMapDisabled: boolean;
  public appliedForAllLocations = false;
  @Input() formDisabled: boolean;
  @Input() formInput: PlaceOnline;
  @Input() dayNumber: number;
  public mapMarkerCoords: google.maps.LatLngLiteral = { lng: null, lat: null };

  public appliedForAllLink = false;
  // FORM
  public formGroup: FormGroup<PlaceOnlineGroup> = this.fb.nonNullable.group(
    {
      coordinates: new FormControl({ lat: DefaultCoordinates.LATITUDE, lng: DefaultCoordinates.LONGITUDE }),
      onlineLink: new FormControl(''),
      place: new FormControl(''),
      appliedLinkForAll: [false],
      appliedPlaceForAll: [false]
    },
    { validators: dateFormValidator() }
  );
  public mapOptions: google.maps.MapOptions = {
    center: this.coordinates.value,
    zoom: 8,
    gestureHandling: 'greedy',
    minZoom: 4,
    maxZoom: 20
  };
  @Output() destroy = new EventEmitter<any>();
  @Output() formEmitter: EventEmitter<FormEmitter<PlaceOnline>> = new EventEmitter<FormEmitter<PlaceOnline>>();
  @Input() sharedKey: number;

  private _autocomplete: google.maps.places.Autocomplete;
  private _regionOptions: google.maps.places.AutocompleteOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };
  private _subscriptions: Subscription[] = [];
  private _lastLocation: { coordinates: google.maps.LatLngLiteral; place: string } = {
    coordinates: null,
    place: ''
  };
  private _key = Symbol('placeKey');

  constructor(
    private geocoderService: GeocoderService,
    private bridge: FormBridgeService,
    private fb: FormBuilder
  ) {}

  get coordinates() {
    return this.formGroup.controls.coordinates;
  }

  get link() {
    return this.formGroup.controls.onlineLink;
  }

  get place() {
    return this.formGroup.controls.place;
  }

  toggleForAllLink() {
    this.appliedForAllLink = !this.appliedForAllLink;
    if (!this.appliedForAllLink) {
      this.bridge.setLinkForAll('');
      return;
    }
    this.bridge.setLinkForAll(this.link.value);
    this.formGroup.patchValue({ appliedLinkForAll: this.appliedForAllLink });
    this.formGroup.updateValueAndValidity();
  }

  toggleForAllLocations(): void {
    this.appliedForAllLocations = !this.appliedForAllLocations;
    console.log(this.appliedForAllLocations);
    if (!this.appliedForAllLocations) {
      this.bridge.setLocationForAll({ place: '', coords: null });
      return;
    }
    this.bridge.setLocationForAll({ place: this.place.value, coords: this.coordinates.value });
    this.formGroup.patchValue({ appliedPlaceForAll: this.appliedForAllLocations });
    this.formGroup.updateValueAndValidity();
  }

  ngOnInit(): void {
    // FORM BLOCK START
    this._subscribeToFormStatus();
    if (this.dayNumber > 0) {
      this._subscribeToLocationChanges();
      this._subscribeToLinkChanges();
    }
    if (this.formInput) {
      this._initializeForm(this.formInput);
    } else {
      this._emitForm(undefined, false);
    }

    // FORM BLOCK END
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.destroy.emit(this._key);
  }

  public toggleOnline(): void {
    this.isOnline = !this.isOnline;
    if (this.isOnline) {
      this.link.setValidators([Validators.required, Validators.pattern(Patterns.linkPattern)]);
      this.link.updateValueAndValidity();
    } else {
      this.link.clearValidators();
      this.formGroup.patchValue({ onlineLink: '' });
    }
  }

  public toggleLocation(): void {
    this.isPlaceSelected = !this.isPlaceSelected;

    if (this._lastLocation.place) {
      this.formGroup.patchValue({
        coordinates: this._lastLocation.coordinates,
        place: this._lastLocation.place
      });
      setTimeout(() => {
        this.updateMap(this.coordinates.value);
      }, 0);
    } else {
      this._setCurrentLocation();
    }

    if (this.isPlaceSelected) {
      this.formGroup.controls.place.setValidators(Validators.required);
      setTimeout(() => {
        this._setPlaceAutocomplete();
      }, 0);
    } else {
      this.formGroup.controls.place.clearValidators();
      if (this.appliedForAllLocations) {
        this.toggleForAllLocations();
      }
      this._autocomplete.unbindAll();
      this.formGroup.patchValue({
        coordinates: null,
        place: ''
      });
    }
  }

  public mapClick(event: google.maps.MapMouseEvent): void {
    const coords = event.latLng.toJSON();
    this.updateMapAndLocation(coords);
  }

  private _initializeForm(form: PlaceOnline) {
    this.formGroup.setValue(form);
    const { place, onlineLink, coordinates } = form;
    if (place) {
      this._lastLocation = { coordinates, place };
      if (this.dayNumber === 0) {
        this.toggleLocation();
        if (form.appliedPlaceForAll) {
          this.toggleForAllLocations();
        }
      } else {
        if (!this.appliedForAllLocations) {
          this.toggleLocation();
        }
      }
    }
    if (onlineLink) {
      if (this.dayNumber === 0) {
        this.toggleOnline();
        if (form.appliedLinkForAll) {
          this.toggleForAllLink();
        }
      } else {
        if (!this.appliedForAllLink) {
          this.toggleOnline();
        }
      }
    }
    if (this.formDisabled) {
      this.formGroup.disable();
    }
  }

  private _subscribeToLinkChanges() {
    const s = this.bridge.$linkUpdate().subscribe((value) => {
      if (value) {
        this.appliedForAllLink = true;
        this.isLinkDisabled = true;
        this.isOnline = true;
        this.link.disable();
        this.formGroup.patchValue({ onlineLink: value });
      } else {
        this.appliedForAllLink = false;
        this.isLinkDisabled = false;
        this.isOnline = false;
        this.link.enable();
        this.formGroup.patchValue({ onlineLink: '' });
      }
    });
    this._subscriptions.push(s);
  }

  private _subscribeToLocationChanges() {
    const sub = this.bridge.$locationUpdate().subscribe((update) => {
      if (update.place) {
        this.appliedForAllLocations = true;
        this.isMapDisabled = true;
        this.isPlaceSelected = true;
        this.isPlaceDisabled = true;
        this.place.disable();
        this.formGroup.patchValue({ coordinates: update.coords, place: update.place });
      } else {
        this.appliedForAllLocations = false;
        this.isMapDisabled = false;
        this.isPlaceDisabled = false;
        this.isPlaceSelected = false;
        this.place.enable();
        this.formGroup.patchValue({ coordinates: update.coords, place: update.place });
      }
      console.log(update);
    });
    this._subscriptions.push(sub);
  }

  private _emitForm(form: PlaceOnline, valid: boolean) {
    this.formEmitter.emit({ key: this._key, valid, form, sharedKey: this.sharedKey, formKey: 'placeOnline' });
  }

  private _subscribeToFormStatus() {
    const sub = this.formGroup.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this._emitForm(this.formGroup.getRawValue(), true);
      } else {
        this._emitForm(undefined, false);
      }
    });

    const sub1 = this.link.statusChanges.subscribe((status) => {
      if (this.appliedForAllLink) {
        if (status === 'VALID') {
          {
            this.bridge.setLinkForAll(this.link.value);
          }
        }
      }
    });

    this._subscriptions.push(sub);
    this._subscriptions.push(sub1);
  }

  private _setPlaceAutocomplete(): void {
    this._autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this._regionOptions);
    this._autocomplete.addListener('place_changed', () => {
      const locationName = this._autocomplete.getPlace();
      if (locationName.formatted_address) {
        const lat = locationName.geometry.location.lat();
        const lng = locationName.geometry.location.lng();
        const coords = { lat, lng };
        this.updateMapAndLocation(coords);
        this.formGroup.patchValue({
          place: locationName.formatted_address,
          coordinates: { lat: coords.lat, lng: coords.lng }
        });
      }
    });
  }

  private _setCurrentLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => this.handleGeolocationSuccess(position),
      (error) => this.handleGeolocationError(error)
    );
  }

  private handleGeolocationSuccess(position: GeolocationPosition) {
    if (!position.coords) {
      return;
    }
    const latLngLiteral: google.maps.LatLngLiteral = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    this.updateMapAndLocation(latLngLiteral);
  }

  private handleGeolocationError(error: GeolocationPositionError) {
    console.error(error);
  }

  private updateMap(latLngLiteral: google.maps.LatLngLiteral) {
    this.mapMarkerCoords = latLngLiteral;
    this.map.panTo(latLngLiteral);
    this.map.center = latLngLiteral;
  }

  private updateMapAndLocation(latLngLiteral: google.maps.LatLngLiteral) {
    this.mapMarkerCoords = latLngLiteral;
    this.map.panTo(latLngLiteral);
    this.map.center = latLngLiteral;
    this.geocoderService.changeAddress(latLngLiteral).subscribe((result: google.maps.GeocoderResult) => {
      const address = result.formatted_address;
      this.formGroup.patchValue({
        coordinates: latLngLiteral,
        place: address
      });
      this._lastLocation = { coordinates: latLngLiteral, place: address };
      if (this.appliedForAllLocations) {
        this.bridge.setLocationForAll({ place: address, coords: latLngLiteral });
      }
    });
  }
}
