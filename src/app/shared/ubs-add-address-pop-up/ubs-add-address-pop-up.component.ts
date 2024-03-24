import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { Address, CourierLocations, DistrictsDtos, DistrictEnum } from 'src/app/ubs/ubs/models/ubs.interface';
import { Patterns } from 'src/assets/patterns/patterns';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { GooglePrediction } from 'src/app/ubs/mocks/google-types';
import { select, Store } from '@ngrx/store';
import { CreateAddress, DeleteAddress, UpdateAddress } from 'src/app/store/actions/order.actions';
import { CAddressData } from 'src/app/ubs/ubs/models/ubs.model';
import { addressAlreadyExistsValidator } from 'src/app/ubs/ubs/validators/address-olready-exists-validator';
import { addressesSelector } from 'src/app/store/selectors/order.selectors';

@Component({
  selector: 'app-ubs-add-address-pop-up',
  templateUrl: './ubs-add-address-pop-up.component.html',
  styleUrls: ['./ubs-add-address-pop-up.component.scss']
})
export class UBSAddAddressPopUpComponent implements OnInit, OnDestroy {
  addAddressForm: FormGroup;
  currentLanguage: string;
  locations: CourierLocations;
  districtList: DistrictsDtos[];
  addressData: CAddressData;

  private buildingPattern = Patterns.numericAndAlphabetic;
  private $destroy: Subject<void> = new Subject();

  autocompleteRegionRequest = {
    types: ['administrative_area_level_1'],
    componentRestrictions: { country: 'ua' }
  };

  autocompleteCityRequest = {
    types: ['(cities)'],
    componentRestrictions: { country: 'ua' }
  };

  autocompleteStreetRequest = {
    types: ['address'],
    componentRestrictions: { country: 'ua' }
  };

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<UBSAddAddressPopUpComponent>,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private store: Store,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      edit: boolean;
      address: Address;
      addFromProfile?: boolean;
    }
  ) {}

  get region() {
    return this.addAddressForm.get('region');
  }

  get district() {
    return this.addAddressForm.get('district');
  }

  get city() {
    return this.addAddressForm.get('city');
  }

  get street() {
    return this.addAddressForm.get('street');
  }

  get houseNumber() {
    return this.addAddressForm.get('houseNumber');
  }

  get houseCorpus() {
    return this.addAddressForm.get('houseCorpus');
  }

  get entranceNumber() {
    return this.addAddressForm.get('entranceNumber');
  }

  get addressComment() {
    return this.addAddressForm.get('addressComment');
  }

  ngOnInit(): void {
    this.addressData = new CAddressData(this.langService);
    this.locations = this.localStorageService.getLocations();
    this.currentLanguage = this.localStorageService.getCurrentLanguage();

    this.initForm();

    if (!this.data.addFromProfile) {
      this.region.disable();
    }

    if (this.data.edit) {
      if (this.data.address.addressRegionDistrictList.length > 1) {
        this.districtList = this.data.address.addressRegionDistrictList.map((item) => ({
          nameUa: item.nameUa + DistrictEnum.UA,
          nameEn: item.nameEn + DistrictEnum.EN
        }));
      } else {
        this.districtList = this.data.address.addressRegionDistrictList.map((item) => ({
          nameUa: item.nameUa,
          nameEn: item.nameEn
        }));
      }
    } else {
      this.district.disable();
    }
  }

  initForm(): void {
    this.data.edit
      ? this.addressData.initAddressData(this.data.address)
      : this.addressData.setRegionWithTranslation(this.locations.regionDto.nameUk, this.locations.regionDto.nameEn);

    const region = this.addressData.getRegion(this.langService.getCurrentLanguage());

    if (this.data.edit) {
      this.districtList = [this.addressData.getDistrict()];
    }

    this.addAddressForm = this.fb.group({
      region: [region ?? '', Validators.required],
      city: [this.addressData.getCity(this.langService.getCurrentLanguage()) ?? '', Validators.required],
      street: [this.addressData.getStreet() ?? '', Validators.required],
      district: [this.addressData.getDistrict() ?? '', Validators.required],
      houseNumber: [this.data.address.houseNumber ?? '', [Validators.required, Validators.pattern(this.buildingPattern)]],
      houseCorpus: [this.data.address.houseCorpus ?? '', [Validators.maxLength(4), Validators.pattern(this.buildingPattern)]],
      entranceNumber: [this.data.address.entranceNumber ?? '', [Validators.maxLength(2), Validators.pattern(this.buildingPattern)]],
      addressComment: [this.data.address.addressComment ?? '', Validators.maxLength(255)]
    });

    if (!this.data.edit) {
      region ? this.city.enable() : this.city.disable();
      this.street.disable();
      this.houseNumber.disable();
      this.district.disable();
    }

    this.initFormListeners();
    this.initFormValidators();
  }

  initFormListeners(): void {
    this.houseNumber.valueChanges.pipe(takeUntil(this.$destroy), debounceTime(400)).subscribe((value) => {
      this.addressData.setHouseNumber(value);
    });

    this.houseCorpus.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(() => {
      this.addressData.setHouseCorpus(this.houseCorpus.value);
    });

    this.entranceNumber.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(() => {
      this.addressData.setEntranceNumber(this.entranceNumber.value);
    });

    this.district.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(() => {
      this.addressData.setDistrict(this.district.value);
    });

    this.addressComment.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(() => {
      this.addressData.setAddressComment(this.addressComment.value);
    });
  }

  initFormValidators(): void {
    this.store.pipe(select(addressesSelector), take(1)).subscribe((addresses) => {
      this.addAddressForm.setValidators(addressAlreadyExistsValidator(addresses, this.localStorageService.getCurrentLanguage()));
      this.addAddressForm.updateValueAndValidity();
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

    this.city.patchValue('');
    this.street.patchValue('');
    this.resetDistricts();
    this.resetHouseInfo();
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

    this.street.patchValue('');
    this.resetDistricts();
    this.resetHouseInfo();
  }

  onStreetSelected(street: GooglePrediction): void {
    if (street) {
      this.street.patchValue(street.structured_formatting.main_text);
      this.addressData.setStreet(street);
      this.fetchDistrictAuto(street.place_id);

      this.houseNumber.enable();
    } else {
      this.street.patchValue('');
      this.addressData.resetStreet();

      this.houseNumber.disable();
    }
    this.resetHouseInfo();
  }

  isErrorMessageShown(control: AbstractControl): boolean {
    return control.touched && control.invalid;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteAddress(): void {
    this.store.dispatch(DeleteAddress({ address: this.data.address }));
    this.dialogRef.close('Deleted');
  }

  addAdress(): void {
    this.data.edit
      ? this.store.dispatch(UpdateAddress({ address: { ...this.data.address, ...this.addressData.getValues() } }))
      : this.store.dispatch(CreateAddress({ address: this.addressData.getValues() }));
    this.dialogRef.close('Added');
  }

  getLangValue(uaValue, enValue): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  districtComparator(option: DistrictsDtos, value: DistrictsDtos): boolean {
    return option?.nameUa === value?.nameUa;
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
        (d) => d.nameEn.startsWith(districtAuto.long_name?.split("'")[0]) || d.nameUa === districtAuto.long_name
      );
      this.district.setValue(district ?? '');
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

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
