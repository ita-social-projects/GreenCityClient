import { AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Coordinates } from 'src/app/greencity/modules/user/models/edit-profile.model';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, filter, from, Subject } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { emptyOrValid } from '@ubs/shared/validators/empthy-or-valid.validator';
import { addressesSelector } from 'src/app/store/selectors/order.selectors';
import { GooglePrediction } from 'src/app/ubs/mocks/google-types';
import { Address, AddressData, CourierLocations, DistrictsDtos } from 'src/app/ubs/ubs/models/ubs.interface';
import { CAddressData } from 'src/app/ubs/ubs/models/ubs.model';
import { addressAlreadyExistsValidator } from '@ubs/ubs/validators/address-already-exists-validator';
import { Patterns } from 'src/assets/patterns/patterns';
import { AddressService } from '@global-service/address/address.service';
import { GoogleScript } from '@assets/google-script/google-script';
import { GoogleMap } from '@angular/google-maps';
import { Language } from '../../../../shared/i18n/Language';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AddressInputComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: AddressInputComponent
    }
  ]
})
export class AddressInputComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor, Validator {
  @Input() formAddressChangeId?: number;
  @Input() edit: boolean;
  @Input() address: Address;
  @Input() addFromProfile: boolean;
  @Input() addressesFromProfile?: AddressData[];
  @Input() isShowCommentInput = true;
  @Input() isFromAdminPage: boolean;
  @Input() isUneditableStatus: boolean;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  addressForm: FormGroup;
  currentLanguage: string;
  locations: CourierLocations;
  addressData: CAddressData;
  addressCoords: google.maps.LatLngLiteral;
  isTouched = false;
  isShowMap = false;
  districtsForKyiv: DistrictsDtos[];
  allowDistrictEdit = false;
  errorType: string | undefined;
  isMapLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  blockAutoComplete = false;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 50.4501, lng: 30.5234 },
    zoom: 8,
    minZoom: 4,
    maxZoom: 20
  };

  private readonly buildingPattern = Patterns.ubsHouseNumberPattern;
  private readonly numericPattern = Patterns.numeric;
  private readonly $destroy: Subject<void> = new Subject();
  private viewInitialized = false;
  private isValidating = false;
  private googlePlacesService: google.maps.places.PlacesService;
  private readonly showMapSelected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  autocompleteRegionRequest = {
    input: '',
    types: ['administrative_area_level_1'],
    componentRestrictions: { country: 'ua' }
  };

  autocompleteCityRequest = {
    input: '',
    types: ['(cities)'],
    componentRestrictions: { country: 'ua' }
  };

  autocompleteStreetRequest = {
    input: '',
    types: ['address'],
    componentRestrictions: { country: 'ua' }
  };

  get region(): FormControl {
    return this.addressForm.get('region') as FormControl;
  }

  get district(): FormControl {
    return this.addressForm.get('district') as FormControl;
  }

  get city(): FormControl {
    return this.addressForm.get('city') as FormControl;
  }

  get street(): FormControl {
    return this.addressForm.get('street') as FormControl;
  }

  get houseNumber(): FormControl {
    return this.addressForm.get('houseNumber') as FormControl;
  }

  get houseCorpus(): FormControl {
    return this.addressForm.get('houseCorpus') as FormControl;
  }

  get entranceNumber(): FormControl {
    return this.addressForm.get('entranceNumber') as FormControl;
  }

  get addressComment(): FormControl {
    return this.addressForm.get('addressComment') as FormControl;
  }

  get placeId(): FormControl {
    return this.addressForm.get('placeId') as FormControl;
  }

  get coordinates(): FormControl {
    return this.addressForm.get('coordinates') as FormControl;
  }

  private onValidatorChange?: () => void;
  onChange = (address) => {};
  onTouched = () => {};

  constructor(
    private readonly fb: FormBuilder,
    private readonly localStorageService: LocalStorageService,
    public langService: LanguageService,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly addressService: AddressService,
    private readonly ngZone: NgZone,
    private readonly googleScript: GoogleScript
  ) {}

  ngOnInit(): void {
    this.addressData = new CAddressData(this.langService);
    this.locations = this.localStorageService.getLocations();
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.showMapSelected$.next(this.isShowMap);
    this.initForm();
    this.initListeners();
    this.addressForm.statusChanges.pipe(takeUntil(this.$destroy)).subscribe(() => {
      this.onValidatorChange?.();
    });
  }

  ngAfterViewInit(): void {
    if (this.isUneditableStatus) {
      this.disableAllFields();
    }
    this.initializeFieldStates();
    this.viewInitialized = true;
    this.cdr.detectChanges();
  }

  ngOnChanges(): void {
    if (!this.viewInitialized) {
      return;
    }

    if (this.isUneditableStatus) {
      this.disableAllFields();
    } else {
      this.enableAllFields();
      this.initializeFieldStates();
    }
  }

  validate(control: AbstractControl): ValidationErrors {
    if (this.addressForm.pristine) {
      return null;
    }

    if (this.isValidating) {
      return { disableSubmit: true };
    }

    if (this.addressForm.valid && this.addressData.isValid()) {
      return null;
    }

    return { incorrectAddress: true };
  }

  registerOnValidatorChange(fn: () => void) {
    this.onValidatorChange = fn;
  }

  writeValue(obj: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.addressForm.disable() : this.addressForm.enable();
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched(): void {
    if (!this.isTouched) {
      this.onTouched();
      this.isTouched = true;
    }
  }

  private initializeFieldStates(): void {
    if (!this.edit) {
      this.region.value ? (this.isFromAdminPage ? this.city.disable() : this.city.enable()) : this.city.disable();
      this.street.disable();
      this.houseNumber.disable();
      this.houseCorpus.disable();
      this.entranceNumber.disable();
      this.district.disable();
    } else {
      this.updateDistrictEditState();
    }

    if (this.isFromAdminPage) {
      this.region.disable();
    }
  }

  private disableAllFields(): void {
    this.city.disable();
    this.street.disable();
    this.houseNumber.disable();
    this.houseCorpus.disable();
    this.entranceNumber.disable();
    this.district.disable();
  }

  private enableAllFields(): void {
    this.city.enable();
    this.street.enable();
    this.houseNumber.enable();
    this.houseCorpus.enable();
    this.entranceNumber.enable();
    this.district.enable();
  }

  initListeners(): void {
    this.addressData
      .getPlaceIdChange()
      .pipe(takeUntil(this.$destroy))
      .subscribe((placeId: string) => {
        this.placeId.setValue(placeId);
        this.onChange(this.addressData.getValues());
      });

    this.addressData
      .getAddressChange()
      .pipe(
        tap(() => {
          this.isValidating = true;
          this.onValidatorChange?.();
        }),
        debounceTime(1000),
        takeUntil(this.$destroy)
      )
      .subscribe(async (addressData) => {
        this.blockAutoComplete = true;

        const region = this.currentLanguage === 'uk' ? addressData.regionUk : addressData.regionEn;
        const city = this.currentLanguage === 'uk' ? addressData.cityUk : addressData.cityEn;
        const street = this.currentLanguage === 'uk' ? addressData.streetUk : addressData.streetEn;

        this.onRegionValueSet(region);
        this.onCityValueSet(city);
        this.onStreetValueSet(street);
        if (addressData.districtEn != 'Kyiv') {
          this.district.setValue(this.langService.getLangValue(addressData.districtUk, addressData.districtEn));
        }
        this.houseNumber.setValue(addressData.houseNumber);

        if (this.addressForm.valid) {
          const [placeId, coords, types] = await this.addressData.getPlaceIdByAddress();
          if (types.includes('street_address')) {
            this.placeId.setValue(placeId);
            this.coordinates.setValue({ lat: coords.lat(), lng: coords.lng() });
            this.onChange(this.addressData.getValues());
          } else {
            this.houseNumber.setErrors({ invalidHouseNumber: true });
          }
          this.isValidating = false;
          this.onValidatorChange?.();
          this.cdr.markForCheck();
        }

        this.delayAutocomplete();
      });

    combineLatest([
      this.localStorageService.languageBehaviourSubject.pipe(debounceTime(150)),
      this.showMapSelected$.pipe(debounceTime(250))
    ])
      .pipe(
        switchMap(([lang, showMapSelected]) => {
          if (showMapSelected) {
            this.ngZone.run(() => {
              this.isMapLoaded$.next(false);
              this.cleanupGoogleMapUtilities();
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
              this.cleanupGoogleMapUtilities();
              this.isMapLoaded$.next(false);
              this.cdr.detectChanges();
            });
            return from(Promise.resolve());
          }
        }),
        takeUntil(this.$destroy)
      )
      .subscribe({
        next: () => {
          if (this.showMapSelected$.value) {
            this.ngZone.run(() => {
              this.isMapLoaded$.next(true);
              this.cdr.detectChanges();
              this.initializeGoogleMapUtilities();
            });
          }
        },
        error: () => {
          this.ngZone.run(() => {
            this.isMapLoaded$.next(false);
            this.cleanupGoogleMapUtilities();
            this.cdr.detectChanges();
          });
        }
      });
  }

  private cleanupGoogleMapUtilities(): void {
    this.googlePlacesService = null;
    this.map = null;
  }

  private initializeGoogleMapUtilities(): void {
    if (
      typeof window?.google !== 'undefined' &&
      typeof window?.google?.maps !== 'undefined' &&
      this.map?.googleMap &&
      this.showMapSelected$.value
    ) {
      if (!this.googlePlacesService && this?.map) {
        this.googlePlacesService = new google.maps.places.PlacesService(this.map.googleMap);
      }
    }
  }

  initForm(): void {
    if (this.address?.id || this.locations?.regionDto || this.edit) {
      this.setInitialValues();
    }

    const region = this.addressData.getRegion();

    this.addressForm = this.fb.group({
      region: [region ?? '', Validators.required],
      city: [this.addressData.getCity() ?? '', Validators.required],
      street: [this.addressData.getStreet() ?? '', Validators.required],
      district: [this.addressData.getDistrict() ?? '', Validators.required],
      houseNumber: [
        this.address?.houseNumber ?? '',
        [Validators.required, Validators.maxLength(10), Validators.pattern(this.buildingPattern)]
      ],
      houseCorpus: [this.address?.houseCorpus ?? '', emptyOrValid([Validators.maxLength(4), Validators.pattern(this.buildingPattern)])],
      entranceNumber: [
        this.address?.entranceNumber ?? '',
        emptyOrValid([Validators.maxLength(3), Validators.pattern(this.numericPattern)])
      ],
      placeId: [this.address?.placeId ?? ''],
      addressComment: [this.address?.addressComment ?? '', Validators.maxLength(255)],
      coordinates: [this.address?.coordinates ?? { lat: undefined, lng: undefined }]
    });

    if (!this.edit) {
      region ? this.city.enable() : this.city.disable();
      this.street.disable();
      this.houseNumber.disable();
      this.district.disable();
    }

    this.initFormValidators();
  }

  setInitialValues() {
    this.edit || this.isFromAdminPage
      ? this.addressData.initAddressData(this.address)
      : this.addressData.setRegionWithTranslation(this.locations.regionDto.nameUk, this.locations.regionDto.nameEn);
  }

  initFormValidators(): void {
    this.store.pipe(select(addressesSelector), takeUntil(this.$destroy)).subscribe((addresses) => {
      if (addresses?.length >= 0) {
        this.addressForm.setValidators(
          addressAlreadyExistsValidator(addresses, this.localStorageService.getCurrentLanguage(), this.formAddressChangeId)
        );
        if (this.addressesFromProfile) {
          this.addressForm.addValidators(
            addressAlreadyExistsValidator(
              this.addressesFromProfile,
              this.localStorageService.getCurrentLanguage(),
              this.formAddressChangeId
            )
          );
        }
        this.addressForm.updateValueAndValidity();
      }
    });
  }

  onUseUserLocation(isUseUserLocation: boolean) {
    if (!this.isUneditableStatus) {
      this.isShowMap = isUseUserLocation;
      this.showMapSelected$.next(isUseUserLocation);

      if (isUseUserLocation) {
        this.setCurrentLocation();
      } else {
        this.resetCity();
        this.resetStreet();
        this.resetDistricts();
        this.resetHouseInfo();
      }
    }
  }

  async onRegionSelected(region: GooglePrediction): Promise<void> {
    if (region) {
      this.blockAutoComplete = true;
    }

    this.resetCity();
    this.resetStreet();
    this.resetDistricts();
    this.resetHouseInfo();

    this.onRegionValueSet(region?.structured_formatting.main_text ?? '');
    this.delayAutocomplete();
  }

  async onCitySelected(city: GooglePrediction): Promise<void> {
    if (city) {
      this.blockAutoComplete = true;
      this.city.patchValue(city?.structured_formatting.main_text ?? '');

      const response = await this.addressData.getPlaceByPlaceId(city.place_id, this.currentLanguage === 'uk' ? 'uk' : 'en');
      const langKey = this.currentLanguage === 'uk' ? 'placeUk' : 'placeEn';
      await this.addressData.setCity({ [langKey]: response });
    }
    this.addressForm.get('region').disable();
    this.updateDistrictEditState();
    this.resetStreet();
    this.resetDistricts();
    this.resetHouseInfo();

    this.onCityValueSet(city?.structured_formatting.main_text ?? '');
    this.delayAutocomplete();
  }

  keyupCity(keyupText: string): void {
    if (keyupText) {
      this.addressForm.get('region').disable();
    } else {
      this.onCityValueSet(keyupText);
      this.resetStreet();
      this.resetDistricts();
      this.resetHouseInfo();
      this.addressForm.get('region').enable();
    }
    this.errorType = 'requiredFromDropdown';
  }

  keyupStreet(keyupText: string): void {
    if (!keyupText) {
      this.onStreetValueSet(keyupText);
      this.resetHouseInfo();
      this.resetDistricts();
    }
    this.errorType = 'requiredFromDropdown';
  }

  async onStreetSelected(street: GooglePrediction): Promise<void> {
    if (street) {
      this.blockAutoComplete = true;

      const placeEn = await this.addressData.getPlaceByPlaceId(street.place_id, Language.EN);
      const placeUk = await this.addressData.getPlaceByPlaceId(street.place_id, Language.UK);

      await this.addressData.setCity({ placeUk, placeEn });
      await this.addressData.setStreet({ placeUk, placeEn });

      this.allowDistrictEdit && this.district.enable();
      this.district.markAsTouched();
    } else {
      this.addressData.resetStreet();
      this.district.reset();
    }

    this.resetHouseInfo();

    this.onStreetValueSet(street?.structured_formatting.main_text ?? '');
    this.delayAutocomplete();
  }

  onCoordinatesSelected(coordinates: Coordinates) {
    this.addressData.setCoordinates({ lat: coordinates.latitude, lng: coordinates.longitude });
    this.OnChangeAndTouched();
  }

  getDistricts() {
    this.addressService
      .getKyivDistricts()
      .pipe(take(1))
      .subscribe((districts) => {
        this.districtsForKyiv = districts;
      });
  }

  updateDistrictEditState() {
    if (this.hasDistricts()) {
      this.getDistricts();
      this.allowDistrictEdit = true;
    } else {
      this.allowDistrictEdit = false;
      this.district.disable();
    }
  }

  onHouseNumberChange(): void {
    this.addressData.setHouseNumber(this.houseNumber.value);
    this.OnChangeAndTouched();

    if (!this.district.value) {
      this.addressData.setDistrictFromCity();
    }
  }

  onDistrictChange(district: string, districtEn: string): void {
    this.allowDistrictEdit && this.addressData.setCustomDistrict(district, districtEn);
    console.log(district, districtEn);
    this.OnChangeAndTouched();
  }

  onHouseCorpusChange(): void {
    this.addressData.setHouseCorpus(this.houseCorpus.value);
    this.OnChangeAndTouched();
  }

  onEntranceNumberChange(): void {
    this.addressData.setEntranceNumber(this.entranceNumber.value);
    this.OnChangeAndTouched();
  }

  onCommentChange(): void {
    this.addressData.setAddressComment(this.addressComment.value);
    this.OnChangeAndTouched();
  }

  hasDistricts(): boolean {
    const citiesWithDistricts = ['Kyiv', 'Київ'];
    return citiesWithDistricts.includes(this.city.value);
  }

  onMapClick($event: google.maps.MapMouseEvent) {
    if (typeof window?.google?.maps === 'undefined' || !this.isMapLoaded$.value || !this.map?.googleMap) {
      return;
    }
    this.addressCoords = $event.latLng.toJSON();

    this.addressData.setCoordinates(this.addressCoords, { fetch: true });
  }

  isErrorMessageShown(control: AbstractControl): boolean {
    return control.touched && control.invalid;
  }

  districtComparator(option: DistrictsDtos, value: DistrictsDtos): boolean {
    return option?.nameUk === value?.nameUk;
  }

  getCityPrefix(): string {
    const cityValue = this.langService.getLangValue('місто', 'city');

    return `${this.region.value}, ${cityValue}, `;
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  private onRegionValueSet(value: string): void {
    if (value) {
      this.region.patchValue(value);
      this.city.enable();
    } else {
      this.region.patchValue('');
      this.addressData.resetRegion();

      this.city.disable();
      this.street.disable();
      this.houseNumber.disable();
    }

    this.OnChangeAndTouched();
  }

  private onCityValueSet(value: string) {
    if (value) {
      this.city.patchValue(value);

      this.street.enable();
    } else {
      this.city.patchValue('');
      this.addressData.resetCity();

      this.street.disable();
      this.houseNumber.disable();
    }

    this.OnChangeAndTouched();
  }

  private onStreetValueSet(value: string): void {
    if (value) {
      this.street.patchValue(value);

      this.houseNumber.enable();
      this.houseCorpus.enable();
      this.entranceNumber.enable();
    } else {
      this.street.patchValue('');

      this.houseNumber.disable();
      this.houseCorpus.disable();
      this.entranceNumber.disable();
    }

    this.OnChangeAndTouched();
  }

  private resetHouseInfo(): void {
    this.houseNumber.reset();
    this.houseNumber.disable();
    this.houseCorpus.reset();
    this.houseCorpus.disable();
    this.entranceNumber.reset();
    this.entranceNumber.disable();
    this.addressData.resetHouseInfo();
  }

  private resetDistricts(): void {
    this.district.reset();
    this.addressData.resetDistrict();
    this.district.disable();
  }

  private resetStreet(): void {
    this.street.reset();
    this.addressData.resetStreet();
  }

  private resetCity(): void {
    this.city.reset();
    this.addressData.resetCity();
  }

  private OnChangeAndTouched(): void {
    if (this.isFromAdminPage) {
      this.region.disable();
    }
    this.onChange(this.addressData.getValues());
    this.markAsTouched();
  }

  // Set users current location
  private setCurrentLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => this.handleGeolocationSuccess(position),
      (error) => {
        this.handleGeolocationSuccess({ coords: { latitude: 0, longitude: 0 }, timestamp: null } as GeolocationPosition);
        console.error(error);
      }
    );
  }

  private handleGeolocationSuccess(position: GeolocationPosition): void {
    this.addressCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
    this.addressData.setCoordinates(this.addressCoords);
  }

  private delayAutocomplete() {
    setTimeout(() => {
      this.blockAutoComplete = false;
    }, 600);
  }
}
