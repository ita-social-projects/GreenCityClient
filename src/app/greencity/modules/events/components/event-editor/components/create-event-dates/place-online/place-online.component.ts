import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { GoogleScript } from '@assets/google-script/google-script';
import { defaultCoordinates } from '@assets/mocks/events/mock-events';
import { Patterns } from '@assets/patterns/patterns';
import { combineLatest, filter, from, Subject, takeUntil, BehaviorSubject } from 'rxjs';
import { DateInformation, FormControllers, PlaceOnline } from 'src/app/greencity/modules/events/models/events.interface';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { debounceTime, switchMap, take } from 'rxjs/operators';

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
  showMap = false;
  private _autocomplete: google.maps.places.Autocomplete | null = null;
  private googleGeocoder: google.maps.Geocoder | null = null;
  private googlePlacesService: google.maps.places.PlacesService | null = null;
  private readonly defaultPosition = { coords: { lat: 49.84579567734425, lng: 24.025124653312258 } };

  private _regionOptions: google.maps.places.AutocompleteOptions = {
    types: ['address'],
    componentRestrictions: { country: 'UA' }
  };
  private _lastLocation: { coordinates: PlaceOnline; place: string } = {
    coordinates: null,
    place: ''
  };
  private $destroy: Subject<void> = new Subject();
  private readonly isPlaceSelected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private languageService: LanguageService,
    private readonly googleScript: GoogleScript,
    private readonly localStorageService: LocalStorageService,
    private readonly ngZone: NgZone,
    private readonly cdr: ChangeDetectorRef
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
    this.applyLocationToAllDays(
      isApplied ? this.coordinates.value : { ...defaultCoordinates, ...this.defaultPosition },
      isApplied ? this.place.value : '',
      isApplied
    );
    isApplied ? this.subscribeToPlaceChanges() : this.unsubscribeFromPlaceChanges();
    this.appliedPlaceForAll.setValue(isApplied);
  }

  ngOnInit(): void {
    this.formGroup = this.dayFormGroup as FormGroup;
    this.isOnline = !!this.link.value;
    this.isPlaceSelected = !!this.coordinates.value.latitude;
    this.isPlaceSelected$.next(this.isPlaceSelected);
    this.setMapOptions();

    if (this.dayNumber !== 0) {
      const firstDay = this.daysForm.value[0];
      this.applyInitialSettings(firstDay);
      this.subscribeToFormChanges();
    }

    combineLatest([this.localStorageService.languageBehaviourSubject.pipe(debounceTime(150)), this.isPlaceSelected$])
      .pipe(
        switchMap(([lang, placeSelected]) => {
          if (placeSelected) {
            this.ngZone.run(() => {
              this.showMap = false;
              this.cdr.detectChanges();
            });
            return from(this.googleScript.load(lang)).pipe(
              switchMap(() =>
                this.googleScript.mapReady.pipe(
                  filter((ready) => ready),
                  take(1)
                )
              )
            );
          } else {
            this.ngZone.run(() => {
              this.showMap = false;
              this.cleanupGoogleMapUtilities();
              this.cdr.detectChanges();
            });
            return from(Promise.resolve());
          }
        }),
        takeUntil(this.$destroy)
      )
      .subscribe({
        next: () => {
          if (this.isPlaceSelected$.value) {
            this.ngZone.run(() => {
              this.showMap = true;
              this.cdr.detectChanges();
              this.initializeGoogleMapUtilities();
            });
          }
        },
        error: (e) => {
          this.ngZone.run(() => {
            this.showMap = false;
            this.cleanupGoogleMapUtilities();
            this.cdr.detectChanges();
          });
        }
      });
  }

  private cleanupGoogleMapUtilities(): void {
    if (this._autocomplete) {
      this._autocomplete.unbindAll();
      this._autocomplete = null;
    }
    this.googleGeocoder = null;
    this.googlePlacesService = null;
  }

  private initializeGoogleMapUtilities(): void {
    if (typeof window?.google?.maps !== 'undefined' && this.map && this.isPlaceSelected$.value && this.showMap) {
      if (!this.googleGeocoder && this.map) {
        this.googleGeocoder = new google.maps.Geocoder();
      }

      if (this.map && this.map?.googleMap && !this.googlePlacesService) {
        this.googlePlacesService = new google.maps.places.PlacesService(this.map.googleMap);
      }

      if (typeof window?.google !== 'undefined' && this.map && this.googleGeocoder && this.placesRef && this.placesRef.nativeElement) {
        this.setPlace();
        this._setPlaceAutocomplete();
        this.updateMap({ lat: this.coordinates.value.latitude, lng: this.coordinates.value.longitude });
      }
    }
  }

  applyInitialSettings(firstDay: any): void {
    this.isOnline = this.isOnline ? this.isOnline : firstDay.appliedLinkForAll;
    this.isLinkDisabled = firstDay.appliedLinkForAll;

    this.isPlaceDisabled = firstDay.appliedPlaceForAll;
    this.isPlaceSelected = this.isPlaceSelected ? this.isPlaceSelected : firstDay.appliedPlaceForAll;
    this.isPlaceSelected$.next(this.isPlaceSelected);
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

    if (!this.subPlace) {
      this.subPlace = place.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((place: string) => {
        this.applyLocationToAllDays(coordinates.value, place, true);
      });
    }
  }

  private subscribeToLinkChanges(): void {
    const link = (this.daysForm.controls[0] as FormGroup).controls.onlineLink as FormControl;
    this.subLink = link.valueChanges.pipe(takeUntil(this.$destroy)).subscribe((link: string) => {
      this.applyLinkToAllDays(link, true);
    });
  }

  private unsubscribeFromPlaceChanges(): void {
    if (this.subPlace) {
      this.subPlace.unsubscribe();
      this.subPlace = null;
    }
  }

  private unsubscribeFromLinkChanges(): void {
    if (this.subLink) {
      this.subLink.unsubscribe();
      this.subLink = null;
    }
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
    this.isPlaceSelected$.next(this.isPlaceSelected);
    this.formGroup.controls.place.setValidators(Validators.required);

    if (this._lastLocation.place && this._lastLocation.coordinates) {
      this.formGroup.patchValue({
        coordinates: { ...this._lastLocation.coordinates },
        place: this._lastLocation.place
      });
    }

    this.formGroup.controls.place.updateValueAndValidity();
  }

  mapClick(event: google.maps.MapMouseEvent): void {
    if (this.isPlaceSelected && typeof window?.google !== 'undefined') {
      const coords = event.latLng.toJSON();
      this.updateMapAndLocation(coords);
    }
  }

  private _setPlaceAutocomplete(): void {
    if (this.placesRef && this.placesRef.nativeElement && typeof window?.google?.maps?.places !== 'undefined') {
      if (this._autocomplete) {
        this._autocomplete.unbindAll();
      }
      this._autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this._regionOptions);
      this._autocomplete.addListener('place_changed', () => {
        const locationName = this._autocomplete.getPlace();
        if (locationName.geometry && locationName.geometry.location) {
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
  }

  private updateMap(latLngLiteral: google.maps.LatLngLiteral) {
    if (this.map && this.map?.googleMap && latLngLiteral.lat && latLngLiteral.lng && typeof window?.google !== 'undefined') {
      this.mapMarkerCoords = latLngLiteral;
      this.map.panTo(latLngLiteral);
      this.map.center = latLngLiteral;
    }
  }

  private async updateMapAndLocation(latLngLiteral: google.maps.LatLngLiteral) {
    if (!this.googleGeocoder || !latLngLiteral || !this.map || window?.google?.maps === 'undefined') {
      return;
    }

    this.updateMap(latLngLiteral);

    await new Promise<void>((resolve) => {
      this.googleGeocoder.geocode({ location: latLngLiteral, language: 'uk' }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const address_components = results[0].address_components;
          this.coordinates.patchValue({
            formattedAddressUk: results[0].formatted_address,
            houseNumber: address_components.find((comp) => comp.types.includes('street_number'))?.long_name || '',
            streetUk: address_components.find((comp) => comp.types.includes('route'))?.long_name || '',
            cityUk: address_components.find((comp) => comp.types.includes('locality'))?.long_name || '',
            regionUk: address_components.find((comp) => comp.types.includes('administrative_area_level_1'))?.long_name || '',
            countryUk: address_components.find((comp) => comp.types.includes('country'))?.long_name || ''
          });
        }
        resolve();
      });
    });

    await new Promise<void>((resolve) => {
      this.googleGeocoder.geocode({ location: latLngLiteral, language: 'en' }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const address_components = results[0].address_components;
          this.coordinates.patchValue({
            ...this.coordinates.value,
            formattedAddressEn: results[0].formatted_address,
            streetEn: address_components.find((comp) => comp.types.includes('route'))?.long_name || '',
            cityEn: address_components.find((comp) => comp.types.includes('locality'))?.long_name || '',
            regionEn: address_components.find((comp) => comp.types.includes('administrative_area_level_1'))?.long_name || '',
            countryEn: address_components.find((comp) => comp.types.includes('country'))?.long_name || ''
          });
        }
        resolve();
      });
    });

    this.coordinates.patchValue({ ...this.coordinates.value, longitude: latLngLiteral.lng, latitude: latLngLiteral.lat });
    this.setPlace();
    this._lastLocation = { coordinates: this.coordinates.value, place: this.place.value };
  }

  private setPlace(): void {
    if (this.coordinates.value.latitude && this.coordinates.value.longitude) {
      this.place.setValue(
        this.languageService.getLangValue(this.coordinates.value.formattedAddressUk, this.coordinates.value.formattedAddressEn)
      );
    }
  }

  private setMapOptions(): void {
    const initialLat = this.coordinates.value.latitude || this.defaultPosition.coords.lat;
    const initialLng = this.coordinates.value.longitude || this.defaultPosition.coords.lng;

    this.mapOptions = {
      center: { lat: initialLat, lng: initialLng },
      zoom: 8,
      gestureHandling: 'greedy',
      minZoom: 4,
      maxZoom: 20
    };
  }
  ngOnDestroy(): void {
    this.cleanupGoogleMapUtilities();
    this.$destroy.next();
    this.$destroy.complete();
    this.isPlaceSelected$.complete();
  }
}
