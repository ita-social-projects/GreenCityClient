import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { GoogleScript } from '@assets/google-script/google-script';
import { defaultCoordinates } from '@assets/mocks/events/mock-events';
import { Patterns } from '@assets/patterns/patterns';
import { Subject, takeUntil } from 'rxjs';
import { DateInformation, FormControllers, PlaceOnline } from 'src/app/greencity/modules/events/models/events.interface';
import { LanguageService } from 'src/app/shared/i18n/language.service';
@Component({
  selector: 'app-place-online',
  templateUrl: './place-online.component.html',
  styleUrls: ['./place-online.component.scss'],
  providers: []
})
export class PlaceOnlineComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild('placesRef') placesRef: ElementRef;

  isPlaceSelected: boolean;
  isOnline: boolean;
  isPlaceDisabled: boolean;
  isRenderingMap: boolean;
  isLinkDisabled: boolean;
  mapMarkerCoords: google.maps.LatLngLiteral;
  @Input() daysForm: FormArray;
  @Input() dayNumber: number;
  @Input() dayFormGroup: AbstractControl;
  @Input() formDisabled: boolean;
  formGroup: FormGroup<FormControllers<DateInformation>>;
  mapOptions: google.maps.MapOptions;
  private subLink;
  private subPlace;
  private subCoordinates;
  private _autocomplete: google.maps.places.Autocomplete;
  private _regionOptions: google.maps.places.AutocompleteOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };
  private _lastLocation: { coordinates: PlaceOnline; place: string } = {
    coordinates: null,
    place: ''
  };
  private $destroy: Subject<void> = new Subject();
  constructor(
    private languageService: LanguageService,
    private googleScript: GoogleScript
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

  get appliedLinkForAll() {
    return this.formGroup.controls.appliedLinkForAll;
  }

  get appliedPlaceForAll() {
    return this.formGroup.controls.appliedPlaceForAll;
  }

  toggleForAllLink() {
    const isApplied = !this.appliedLinkForAll.value;
    this.applyLinkToAllDays(isApplied ? this.link.value : '', isApplied);
    isApplied ? this.subscribeToLinkChanges() : this.unsubscribeFromLinkChanges();
    this.appliedLinkForAll.setValue(isApplied);
  }

  toggleForAllLocations(): void {
    const isApplied = !this.appliedPlaceForAll.value;
    this.applyLocationToAllDays(isApplied ? this.coordinates.value : defaultCoordinates, isApplied ? this.place.value : '', isApplied);
    isApplied ? this.subscribeToPlaceChanges() : this.unsubscribeFromPlaceChanges();
    this.appliedPlaceForAll.setValue(isApplied);
  }

  ngOnInit(): void {
    this.formGroup = this.dayFormGroup as FormGroup;
    this.isOnline = !!this.link.value;
    this.isPlaceSelected = !!this.coordinates.value.latitude;
    this.setMapOptions();
    this.mapMarkerCoords = { lat: this.coordinates.value.latitude, lng: this.coordinates.value.longitude };
    if (this.dayNumber !== 0) {
      const firstDay = this.daysForm.value[0];
      this.applyInitialSettings(firstDay);
      this.subscribeToFormChanges();
    }
    if (this.isPlaceSelected) {
      this.setPlace();
    }
    this.googleScript.$isRenderingMap.pipe(takeUntil(this.$destroy)).subscribe((value: boolean) => {
      setTimeout(() => {
        this.isRenderingMap = value;
        this.setMapOptions();
        this.setPlace();
      }, 1000);
    });
  }

  applyInitialSettings(firstDay: any): void {
    this.isOnline = this.isOnline ? this.isOnline : firstDay.appliedLinkForAll;
    this.isLinkDisabled = firstDay.appliedLinkForAll;

    this.isPlaceDisabled = firstDay.appliedPlaceForAll;
    this.isPlaceSelected = this.isPlaceSelected ? this.isPlaceSelected : firstDay.appliedPlaceForAll;
    this.place[firstDay.appliedPlaceForAll ? 'disable' : 'enable']();

    if (firstDay.appliedLinkForAll) {
      this.formGroup.patchValue({
        appliedLinkForAll: true,
        onlineLink: firstDay.onlineLink
      });
    }

    if (firstDay.appliedPlaceForAll) {
      this.formGroup.patchValue({
        appliedPlaceForAll: true,
        coordinates: firstDay.coordinates,
        place: firstDay.place
      });
    }
  }

  private subscribeToFormChanges(): void {
    this.appliedLinkForAll.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((data) => {
      this.isOnline = data;
      this.isLinkDisabled = data;
    });

    this.appliedPlaceForAll.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((data) => {
      this.isPlaceDisabled = data;
      this.isPlaceSelected = data;
      this.place[data ? 'disable' : 'enable']();
    });
  }

  private subscribeToPlaceChanges(): void {
    const place = (this.daysForm.controls[0] as FormGroup).controls.place as FormControl;
    const coordinates = (this.daysForm.controls[0] as FormGroup).controls.coordinates as FormGroup;
    this.subCoordinates = coordinates.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((data: PlaceOnline) => {
      if (!this.subPlace) {
        this.subPlace = place.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((place: string) => {
          this.applyLocationToAllDays(data, place, true);
        });
      }
    });
  }
  private subscribeToLinkChanges(): void {
    const link = (this.daysForm.controls[0] as FormGroup).controls.onlineLink as FormControl;
    this.subLink = link.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((link: string) => {
      this.applyLinkToAllDays(link, true);
    });
  }
  private unsubscribeFromPlaceChanges(): void {
    this.subCoordinates.unsubscribe();
    if (this.subPlace) {
      this.subPlace.unsubscribe();
      this.subPlace = null;
    }
  }
  private unsubscribeFromLinkChanges(): void {
    this.subLink.unsubscribe();
  }

  applyLocationToAllDays(coordinates: PlaceOnline, place: string, is: boolean): void {
    this.daysForm.controls.slice(1).forEach((control) => {
      control.patchValue({ coordinates, place, appliedPlaceForAll: is });
      control.updateValueAndValidity();
    });
  }

  applyLinkToAllDays(onlineLink: string, is: boolean): void {
    this.daysForm.controls.slice(1).forEach((control) => {
      control.patchValue({ onlineLink, appliedLinkForAll: is });
      control.updateValueAndValidity();
    });
  }

  toggleOnline(): void {
    this.isOnline = !this.isOnline;
    if (this.isOnline) {
      this.link.setValidators([Validators.required, Validators.pattern(Patterns.linkPattern)]);
      this.link.updateValueAndValidity();
    } else {
      this.link.clearValidators();
      this.formGroup.patchValue({ onlineLink: '' });
    }
  }

  toggleLocation(): void {
    this.isPlaceSelected = !this.isPlaceSelected;

    if (this._lastLocation.place) {
      this.formGroup.patchValue({
        coordinates: {
          ...this._lastLocation.coordinates
        },
        place: this._lastLocation.place
      });
      setTimeout(() => {
        this.updateMap({ lat: this.coordinates.value.latitude, lng: this.coordinates.value.longitude });
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
      if (this.appliedPlaceForAll.value) {
        this.toggleForAllLocations();
      }
      this._autocomplete.unbindAll();
      this.formGroup.patchValue({
        coordinates: defaultCoordinates,
        place: ''
      });
    }
  }

  mapClick(event: google.maps.MapMouseEvent): void {
    const coords = event.latLng.toJSON();
    this.updateMapAndLocation(coords);
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
          coordinates: { ...this.coordinates.value, latitude: coords.lat, longitude: coords.lng }
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

  private async updateMapAndLocation(latLngLiteral: google.maps.LatLngLiteral) {
    this.mapMarkerCoords = latLngLiteral;
    this.map.panTo(latLngLiteral);
    this.map.center = latLngLiteral;
    const geocoder = new google.maps.Geocoder();

    await geocoder.geocode({ location: latLngLiteral, language: 'ua' }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const address_components = results[0].address_components;
        this.coordinates.patchValue({
          formattedAddressUk: results[0].formatted_address,
          houseNumber: address_components[0]?.long_name,
          streetUk: address_components[2]?.long_name,
          cityUk: address_components[4]?.long_name,
          regionUk: address_components[6]?.long_name,
          countryUk: address_components[7]?.long_name
        });
      }
    });
    await geocoder.geocode({ location: latLngLiteral, language: 'en' }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const address_components = results[0].address_components;
        this.coordinates.patchValue({
          ...this.coordinates.value,
          formattedAddressEn: results[0].formatted_address,
          streetEn: address_components[2]?.long_name,
          cityEn: address_components[4]?.long_name,
          regionEn: address_components[6]?.long_name,
          countryEn: address_components[7]?.long_name
        });
      }
    });
    this.coordinates.patchValue({ ...this.coordinates.value, longitude: latLngLiteral.lng, latitude: latLngLiteral.lat });
    this.setPlace();
    this._lastLocation = { coordinates: this.coordinates.value, place: this.place.value };
  }

  private setPlace(): void {
    this.place.setValue(
      this.languageService.getLangValue(this.coordinates.value.formattedAddressUk, this.coordinates.value.formattedAddressEn)
    );
  }

  private setMapOptions(): void {
    this.mapOptions = {
      center: { lat: this.coordinates.value.latitude, lng: this.coordinates.value.longitude },
      zoom: 8,
      gestureHandling: 'greedy',
      minZoom: 4,
      maxZoom: 20
    };
  }
  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
