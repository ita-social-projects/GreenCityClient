import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { addressesSelector } from 'src/app/store/selectors/order.selectors';
import { GooglePrediction } from 'src/app/ubs/mocks/google-types';
import { Address, CourierLocations, DistrictEnum, DistrictsDtos } from 'src/app/ubs/ubs/models/ubs.interface';
import { CAddressData } from 'src/app/ubs/ubs/models/ubs.model';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { addressAlreadyExistsValidator } from 'src/app/ubs/ubs/validators/address-olready-exists-validator';
import { Patterns } from 'src/assets/patterns/patterns';

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
export class AddressInputComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() edit: boolean;
  @Input() address: Address;
  @Input() addFromProfile: boolean;
  @Input() isShowCommentInput = true;

  addressForm: FormGroup;
  currentLanguage: string;
  locations: CourierLocations;
  districtList: DistrictsDtos[];
  addressData: CAddressData;
  isTouched = false;

  private buildingPattern = Patterns.numericAndAlphabetic;
  private $destroy: Subject<void> = new Subject();

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

  onChange = (address) => {};
  onTouched = () => {};

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    public langService: LanguageService,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  validate(control: AbstractControl): ValidationErrors {
    return this.addressForm.valid || this.addressForm.pristine ? null : { incorrectAddress: true };
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

  ngOnInit(): void {
    this.addressData = new CAddressData(this.langService);
    this.locations = this.localStorageService.getLocations();
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.initForm();
    this.initListeners();

    if (this.edit) {
      if (this.address.addressRegionDistrictList?.length > 1) {
        this.districtList = this.address.addressRegionDistrictList.map((item) => ({
          nameUa: item.nameUa + DistrictEnum.UA,
          nameEn: item.nameEn + DistrictEnum.EN
        }));
      } else if (this.address.addressRegionDistrictList) {
        this.districtList = this.address.addressRegionDistrictList.map((item) => ({
          nameUa: item.nameUa,
          nameEn: item.nameEn
        }));
      }
    }
  }

  ngAfterViewInit(): void {
    if (!this.edit) {
      this.addFromProfile ? this.region.enable() : this.region.disable();
      this.region.enabled ? this.city.disable() : this.city.enable();
      this.street.disable();
      this.houseNumber.disable();
      this.houseCorpus.disable();
      this.entranceNumber.disable();
      this.district.disable();
    }

    this.cdr.detectChanges();
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
      .pipe(takeUntil(this.$destroy))
      .subscribe((addressData) => {
        const region = this.currentLanguage === 'ua' ? addressData.region : addressData.regionEn;
        const city = this.currentLanguage === 'ua' ? addressData.city : addressData.cityEn;
        const street = this.currentLanguage === 'ua' ? addressData.street : addressData.streetEn;
        this.region.setValue(region);
        this.city.setValue(city);
        this.street.setValue(street);

        this.onChange(this.addressData.getValues());
        this.cdr.detectChanges();
      });
  }

  initForm(): void {
    if (this.address?.id || this.locations?.regionDto) {
      this.setInitialValues();
    }

    const region = this.addressData.getRegion(this.langService.getCurrentLanguage());

    if (this.edit) {
      this.districtList = [this.addressData.getDistrict()];
    }

    this.addressForm = this.fb.group({
      region: [region ?? '', Validators.required],
      city: [this.addressData.getCity(this.langService.getCurrentLanguage()) ?? '', Validators.required],
      street: [this.addressData.getStreet() ?? '', Validators.required],
      district: [this.addressData.getDistrict() ?? '', Validators.required],
      houseNumber: [this.address?.houseNumber ?? '', [Validators.required, Validators.pattern(this.buildingPattern)]],
      houseCorpus: [this.address?.houseCorpus ?? '', [Validators.maxLength(4), Validators.pattern(this.buildingPattern)]],
      entranceNumber: [this.address?.entranceNumber ?? '', [Validators.maxLength(2), Validators.pattern(this.buildingPattern)]],
      placeId: [this.address?.placeId ?? '', Validators.required],
      addressComment: [this.address?.addressComment ?? '', []]
    });

    if (!this.edit) {
      region ? this.city.enable() : this.city.disable();
      this.street.disable();
      this.houseNumber.disable();
      this.district.disable();
    }

    this.initFormValidators();

    this.onChange(this.addressData.getValues());
  }

  setInitialValues() {
    this.edit
      ? this.addressData.initAddressData(this.address)
      : this.addressData.setRegionWithTranslation(this.locations.regionDto.nameUk, this.locations.regionDto.nameEn);
  }

  initFormValidators(): void {
    this.store.pipe(select(addressesSelector), takeUntil(this.$destroy)).subscribe((addresses) => {
      if (addresses?.length >= 0) {
        this.addressForm.setValidators(addressAlreadyExistsValidator(addresses, this.localStorageService.getCurrentLanguage()));
        this.addressForm.updateValueAndValidity();
      }
    });
  }

  onRegionSelected(region: any): void {
    if (region) {
      this.region.patchValue(region?.structured_formatting.main_text ?? '');
      this.addressData.setRegion(region);
      this.city.enable();
    } else {
      this.region.patchValue('');
      this.addressData.resetRegion();

      this.city.disable();
      this.street.disable();
      this.houseNumber.disable();
    }

    this.resetCity();
    this.resetStreet();
    this.resetDistricts();
    this.resetHouseInfo();

    this.OnChangeAndTouched();
  }

  onCitySelected(city: GooglePrediction): void {
    if (city) {
      this.city.patchValue(city?.structured_formatting.main_text ?? '');
      this.addressData.setCity(city);
      this.getDistrictsForCity();

      this.street.enable();
    } else {
      this.city.patchValue('');
      this.addressData.resetCity();

      this.street.disable();
      this.houseNumber.disable();
    }

    this.resetStreet();
    this.resetDistricts();
    this.resetHouseInfo();
    this.OnChangeAndTouched();
  }

  onStreetSelected(street: GooglePrediction): void {
    if (street) {
      this.street.patchValue(street.structured_formatting.main_text);
      this.addressData.setStreet(street);
      this.fetchDistrictAuto(street.place_id);

      this.houseNumber.enable();
      this.houseCorpus.enable();
      this.entranceNumber.enable();
    } else {
      this.street.patchValue('');
      this.addressData.resetStreet();

      this.houseNumber.disable();
      this.houseCorpus.disable();
      this.entranceNumber.disable();
    }
    this.resetHouseInfo();
    this.OnChangeAndTouched();
  }

  onDistrictSelected(): void {
    this.addressData.setDistrict(this.district.value);
    this.onChange(this.addressData.getValues());
  }

  onHouseNumberChange(): void {
    this.addressData.setHouseNumber(this.houseNumber.value);
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

  isErrorMessageShown(control: AbstractControl): boolean {
    return control.touched && control.invalid;
  }

  districtComparator(option: DistrictsDtos, value: DistrictsDtos): boolean {
    return option?.nameUa === value?.nameUa;
  }

  getCityPrefix(): string {
    const cityValue = this.langService.getLangValue('місто', 'city');
    return `${this.region.value}, ${cityValue}, `;
  }

  private getDistrictsForCity(): void {
    this.orderService
      .findAllDistricts(this.region.value, this.city.value)
      .pipe(take(1))
      .subscribe((districts) => {
        this.districtList = districts;
        this.district.enable();
      });
  }

  private fetchDistrictAuto(placeId: string): void {
    new google.maps.Geocoder().geocode({ placeId, language: this.currentLanguage }).then((response) => {
      const placeDetails = response.results[0];

      if (!placeDetails) {
        return;
      }

      const districtAuto = placeDetails.address_components.find((component) => component.types.includes('sublocality'));

      if (!districtAuto) {
        return;
      }

      const district = this.districtList.find(
        (d) => d.nameEn.startsWith(districtAuto.long_name?.split(`'`)[0]) || d.nameUa === districtAuto.long_name
      );
      this.district.setValue(district ?? '');
      this.onDistrictSelected();
    });
  }

  private resetHouseInfo(): void {
    this.houseNumber.reset();
    this.houseCorpus.reset();
    this.entranceNumber.reset();
  }

  private resetDistricts(): void {
    this.district.reset();
    this.district.disable();
    this.addressData.resetDistrict();
    this.districtList = [];
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
    this.onChange(this.addressData.getValues());
    this.markAsTouched();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
