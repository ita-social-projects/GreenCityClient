import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl } from '@angular/forms';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogConfig as MatDialogConfig,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Address, UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from 'src/app/ubs/ubs-user/services/client-profile.service';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { ConfirmationDialogComponent } from '../../ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { PhoneNumberValidator } from 'src/app/shared/phone-validator/phone.validator';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { LocationService } from '@global-service/location/location.service';
import { SearchAddress } from '../../ubs/models/ubs.interface';
import { GoogleAutoService, GooglePlaceResult, GooglePlaceService, GooglePrediction } from '../../mocks/google-types';
import { Language } from 'src/app/main/i18n/Language';
import { RequiredFromDropdownValidator } from '../requiredFromDropDown.validator';
import { NotificationPlatform } from '../../ubs/notification-platform.enum';

@Component({
  selector: 'app-ubs-user-profile-page',
  templateUrl: './ubs-user-profile-page.component.html',
  styleUrls: ['./ubs-user-profile-page.component.scss']
})
export class UbsUserProfilePageComponent implements OnInit, AfterViewInit, OnDestroy {
  autocompleteService: GoogleAutoService;
  placeService: GooglePlaceService;
  streetPredictionList: GooglePrediction[];
  cityPredictionList: GooglePrediction[];
  housePredictionList: GooglePrediction[];

  private destroy: Subject<boolean> = new Subject<boolean>();
  userForm: UntypedFormGroup;
  userProfile: UserProfile;
  public resetFieldImg = './assets/img/ubs-tariff/bigClose.svg';
  dataDeleteAddress = {
    title: 'ubs-client-profile.delete-address',
    confirm: 'ubs-client-profile.payment.yes',
    cancel: 'ubs-client-profile.payment.no'
  };
  dataDeleteProfile = {
    title: 'ubs-client-profile.delete-title',
    text: 'ubs-client-profile.delete-message',
    confirm: 'ubs-client-profile.btn.delete-profile-save',
    cancel: 'ubs-client-profile.btn.delete-profile-cancel'
  };
  googleIcon = SignInIcons.picGoogle;
  isEditing = false;
  isFetching = false;
  telegramBotURL: string;
  viberBotURL: string;
  alternativeEmailDisplay = false;
  phoneMask = Masks.phoneMask;
  maxAddressLength = 4;
  currentLanguage: string;
  regionBounds;
  errorMessages = [];
  errorValueObj = {
    region: false,
    city: false,
    street: false
  };
  regionOptions = {
    types: ['administrative_area_level_1'],
    componentRestrictions: { country: 'UA' }
  };

  constructor(
    public dialog: MatDialog,
    private clientProfileService: ClientProfileService,
    private snackBar: MatSnackBarComponent,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private googleScript: GoogleScript,
    public orderService: OrderService,
    public dialogRef: MatDialogRef<UbsUserProfilePageComponent>,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.getUserData();
  }

  ngAfterViewInit(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLanguage = lang;
      this.googleScript.load(lang);
    });
  }

  composeFormData(data: UserProfile): UserProfile {
    return {
      ...data,
      recipientPhone: data.recipientPhone?.slice(-9)
    };
  }

  getUserData(): void {
    this.isFetching = true;
    this.clientProfileService.getDataClientProfile().subscribe(
      (res: UserProfile) => {
        this.userProfile = this.composeFormData(res);
        this.userInit();
        this.setUrlToBot();
        this.isFetching = false;
      },
      (err: Error) => {
        this.isFetching = false;
        this.snackBar.openSnackBar('ubs-client-profile.error-message');
      }
    );
  }

  setValidationInputError(addressControl: AbstractControl, nameUa: string, nameEn: string) {
    const formControl = addressControl.get(this.getLangValue(nameUa, nameEn));
    return formControl.errors?.required || formControl.errors?.requiredFromDropdown;
  }

  setRegionValue(i: number) {
    this.errorMessages[i].region = true;
    this.updateValidInputs('region', 'regionEn', i);
  }

  setUrlToBot(): void {
    this.telegramBotURL = this.userProfile.botList[0]?.link;
    this.viberBotURL = this.userProfile.botList[1]?.link;
  }

  onRegionSelected(event: any, index: number): void {
    this.errorMessages[index].region = false;

    const currentFormGroup = this.userForm.controls.address.get(index.toString());
    const region = currentFormGroup.get('region');
    const regionEn = currentFormGroup.get('regionEn');

    this.updateValidInputs('region', 'regionEn', index);

    currentFormGroup.get(this.getLangValue('region', 'regionEn')).valueChanges.subscribe(() => {
      currentFormGroup.get('cityEn').setValue('');
      currentFormGroup.get('city').setValue('');
      currentFormGroup.get('districtEn').setValue('');
      currentFormGroup.get('district').setValue('');
      currentFormGroup.get('street').setValue('');
      currentFormGroup.get('streetEn').setValue('');
      currentFormGroup.get('houseNumber').reset('');
      currentFormGroup.get('entranceNumber').reset('');
      currentFormGroup.get('houseCorpus').reset('');
      currentFormGroup.get('addressRegionDistrictList').reset([]);
      this.streetPredictionList = null;
      this.cityPredictionList = null;
      this.housePredictionList = null;
    });
    this.setTranslatedValueOfRegion(event, region, regionEn);
  }

  setTranslatedValueOfRegion(event: any, region: AbstractControl, regionEn: AbstractControl): void {
    this.setTranslation(event.place_id, region, Language.UK);
    this.setTranslation(event.place_id, regionEn, Language.EN);
  }

  setTranslation(id: string, abstractControl: any, lang: string): void {
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      placeId: id,
      language: lang
    };
    this.placeService.getDetails(request, (placeDetails) => {
      abstractControl.setValue(placeDetails.name);
      this.regionBounds = this.locationService.getPlaceBounds(placeDetails);
    });
  }

  userInit(): void {
    const addres = new UntypedFormArray([]);

    this.userProfile.addressDto.forEach((adres) => {
      const separateAddress = new UntypedFormGroup({
        city: new UntypedFormControl(adres?.city, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.minLength(1),
          Validators.maxLength(30)
        ]),
        cityEn: new UntypedFormControl(adres?.cityEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.minLength(1),
          Validators.maxLength(30)
        ]),
        street: new UntypedFormControl(adres?.street, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.minLength(1),
          Validators.maxLength(120)
        ]),
        streetEn: new UntypedFormControl(adres?.streetEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.minLength(1),
          Validators.maxLength(120)
        ]),
        houseNumber: new UntypedFormControl(adres?.houseNumber, [
          Validators.required,
          Validators.pattern(Patterns.ubsHousePattern),
          Validators.maxLength(10)
        ]),
        houseCorpus: new UntypedFormControl(adres?.houseCorpus, [Validators.pattern(Patterns.ubsCorpusPattern), Validators.maxLength(4)]),
        entranceNumber: new UntypedFormControl(adres?.entranceNumber, [
          Validators.pattern(Patterns.ubsEntrNumPattern),
          Validators.maxLength(2)
        ]),
        region: new UntypedFormControl(adres?.region, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        regionEn: new UntypedFormControl(adres?.regionEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        district: new UntypedFormControl(this.convertDistrictName(adres?.district), [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        districtEn: new UntypedFormControl(this.convertDistrictName(adres?.districtEn.split(`'`).join('')), [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        searchAddress: new UntypedFormControl(null),
        isHouseSelected: new UntypedFormControl(adres?.houseNumber ? true : false),
        addressRegionDistrictList: new UntypedFormControl(this.locationService.appendDistrictLabel(adres?.addressRegionDistrictList)),
        placeId: new UntypedFormControl(null),
        id: new UntypedFormControl(adres?.id),
        actual: new UntypedFormControl(adres?.actual)
      });

      addres.push(separateAddress);
    });

    this.userForm = new UntypedFormGroup({
      address: addres,
      recipientName: new UntypedFormControl(this.userProfile?.recipientName, [
        Validators.required,
        Validators.pattern(Patterns.NamePattern),
        Validators.maxLength(30)
      ]),
      recipientSurname: new UntypedFormControl(this.userProfile?.recipientSurname, [
        Validators.required,
        Validators.pattern(Patterns.NamePattern),
        Validators.maxLength(30)
      ]),
      recipientEmail: new UntypedFormControl(this.userProfile?.recipientEmail, [
        Validators.required,
        Validators.pattern(Patterns.ubsMailPattern)
      ]),
      alternativeEmail: new UntypedFormControl(this.userProfile?.alternateEmail, [Validators.pattern(Patterns.ubsMailPattern)]),
      recipientPhone: new UntypedFormControl(`+380${this.userProfile?.recipientPhone}`, [
        Validators.required,
        Validators.minLength(12),
        PhoneNumberValidator('UA')
      ]),
      telegramIsNotify: new UntypedFormControl(this.userProfile.telegramIsNotify),
      viberIsNotify: new UntypedFormControl(this.userProfile.viberIsNotify)
    });

    this.isFetching = false;
    this.errorMessages = new Array(this.userForm.get('address').value.length).fill(this.errorValueObj);
  }

  private initGoogleAutocompleteServices(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  public deleteAddress(address) {
    this.orderService
      .deleteAddress(address.value)
      .pipe(takeUntil(this.destroy))
      .subscribe((list: { addressList: Address[] }) => {
        this.userProfile.addressDto = list.addressList;
        this.getUserData();
      });
  }

  public resetValue(): void {
    this.userForm.get('alternateEmail').setValue(null);
  }

  emptyPredictLists(): void {
    this.cityPredictionList = null;
    this.streetPredictionList = null;
  }

  setPredictCities(formGroupName: number): void {
    this.errorMessages[formGroupName].city = true;
    this.updateValidInputs('city', 'cityEn', formGroupName);

    this.cityPredictionList = null;
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    const regionEn = currentFormGroup.get('regionEn');
    const cityEn = currentFormGroup.get('cityEn');
    const region = currentFormGroup.get('region');
    const city = currentFormGroup.get('city');

    if (this.currentLanguage === Language.UA && city.value) {
      this.inputCity(`${region.value}, ${city.value}`, regionEn.value, Language.UK);
    }
    if (this.currentLanguage === Language.EN && cityEn.value) {
      this.inputCity(`${regionEn.value},${cityEn.value}`, regionEn.value, Language.EN);
    }
  }

  inputCity(searchAddress: string, regionEnName: string, lang: string): void {
    const request = {
      input: searchAddress,
      bounds: this.regionBounds,
      types: ['(cities)'],
      componentRestrictions: { country: 'ua' }
    };
    this.autocompleteService.getPlacePredictions(request, (cityPredictionList) => {
      if (regionEnName === 'Kyiv') {
        this.cityPredictionList = cityPredictionList?.filter((el) => el.place_id === 'ChIJBUVa4U7P1EAR_kYBF9IxSXY');
      } else {
        this.cityPredictionList = cityPredictionList;
      }
    });
  }

  isSubmitBtnDisabled() {
    const isFormError = this.errorMessages.some((obj) => Object.values(obj).some((value) => value === true));
    return !this.userForm.valid || this.userForm.pristine || isFormError;
  }

  onCitySelected(formGroupName: number, selectedCity: GooglePrediction): void {
    this.errorMessages[formGroupName].city = false;
    this.updateValidInputs('city', 'cityEn', formGroupName);

    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());

    this.setValueOfCity(selectedCity, currentFormGroup, 'city');
    this.setValueOfCity(selectedCity, currentFormGroup, 'cityEn');

    currentFormGroup.get(this.getLangValue('city', 'cityEn')).valueChanges.subscribe(() => {
      currentFormGroup.get('districtEn').setValue('');
      currentFormGroup.get('district').setValue('');
      currentFormGroup.get('street').setValue('');
      currentFormGroup.get('streetEn').setValue('');
      currentFormGroup.get('houseNumber').reset('');
      currentFormGroup.get('entranceNumber').reset('');
      currentFormGroup.get('houseCorpus').reset('');
      this.streetPredictionList = null;
    });
  }

  setValueOfCity(selectedCity: GooglePrediction, item: AbstractControl, abstractControlName: string): void {
    const abstractControl = item.get(abstractControlName);

    const request = {
      placeId: selectedCity.place_id,
      language: abstractControlName === 'city' ? Language.UK : Language.EN
    };
    this.placeService.getDetails(request, (placeDetails) => {
      abstractControl.setValue(placeDetails.name);
      abstractControl.markAsDirty();

      if (abstractControlName === 'city') {
        this.getDistrictsForCity(item);
      }
    });
  }

  getDistrictsForCity(formGroup: AbstractControl): void {
    const region = formGroup.get('region').value;
    const city = formGroup.get('city').value;

    this.orderService
      .findAllDistricts(region, city)
      .pipe(takeUntil(this.destroy))
      .subscribe((districts) => {
        formGroup.get('addressRegionDistrictList').setValue(districts);
      });
  }

  setPredictStreets(formGroupName: number): void {
    this.errorMessages[formGroupName].street = true;
    this.updateValidInputs('street', 'streetEn', formGroupName);

    this.streetPredictionList = null;
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    const { city, cityEn, street, streetEn } = currentFormGroup.value;

    if (this.currentLanguage === Language.UA && street) {
      this.inputAddress(`${city}, ${street}`, currentFormGroup, Language.UK);
    }
    if (this.currentLanguage === Language.EN && streetEn) {
      this.inputAddress(`${cityEn}, ${streetEn}`, currentFormGroup, Language.EN);
    }
  }

  inputAddress(searchAddress: string, item: AbstractControl, lang: string): void {
    const { city, cityEn } = item.value;

    const request = this.locationService.getRequest(searchAddress, lang, 'address');
    this.autocompleteService.getPlacePredictions(request, (streetPredictions) => {
      this.streetPredictionList = streetPredictions?.filter(
        (el) => el.structured_formatting.secondary_text.includes(city) || el.structured_formatting.secondary_text.includes(cityEn)
      );
    });
  }

  onStreetSelected(formGroupName: number, selectedStreet: GooglePrediction): void {
    this.errorMessages[formGroupName].street = false;
    this.updateValidInputs('street', 'streetEn', formGroupName);

    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    currentFormGroup.get('houseNumber').setValue('');

    this.setValueOfStreet(selectedStreet, currentFormGroup, 'street');
    this.setValueOfStreet(selectedStreet, currentFormGroup, 'streetEn');
  }

  setValueOfStreet(selectedStreet: GooglePrediction, item: AbstractControl, abstractControlName: string): void {
    const abstractControl = item.get(abstractControlName);

    const request = {
      placeId: selectedStreet.place_id,
      language: abstractControlName === 'street' ? Language.UK : Language.EN
    };
    this.placeService.getDetails(request, (placeDetails) => {
      abstractControl.setValue(placeDetails.name);
      if (request.language === Language.EN) {
        this.setDistrictAuto(placeDetails, request.language, item);
      }
      if (request.language === Language.UK) {
        this.setDistrictAuto(placeDetails, request.language, item);
      }
    });
  }

  setDistrictAuto(placeDetails: GooglePlaceResult, language: string, item: AbstractControl): void {
    const currentDistrict = this.locationService.getDistrictAuto(placeDetails, language);
    const districtEn = item.get('districtEn');
    const district = item.get('district');

    const abstractControl = language === Language.UK ? district : districtEn;
    abstractControl.setValue(currentDistrict);
    abstractControl.markAsDirty();
  }

  onDistrictSelected(formGroupName: number): void {
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    const district = currentFormGroup.get('district');
    const districtEn = currentFormGroup.get('districtEn');
    const districtList = currentFormGroup.get('addressRegionDistrictList').value;

    this.locationService.setDistrictValues(district, districtEn, districtList);
  }

  private convertDistrictName(district: string): string {
    return this.locationService.convFirstLetterToCapital(district);
  }

  onEdit(): void {
    this.isEditing = true;
    this.isFetching = false;
    this.initGoogleAutocompleteServices();
    setTimeout(() => this.focusOnFirst());
  }

  setPredictHouseNumbers(item: AbstractControl): void {
    this.housePredictionList = null;
    item.get('isHouseSelected').setValue(false);
    const cityName = item.get('cityEn').value;
    const streetName = item.get('streetEn').value;
    const houseNumber = item.get('houseNumber').value;
    const houseValue = houseNumber.toLowerCase();
    if (cityName && streetName && houseValue) {
      item.get('houseNumber').setValue(houseValue);
      const searchAddress = this.locationService.getSearchAddress(cityName, streetName, houseValue);
      this.setHousesList(searchAddress, this.getLangValue(Language.UK, Language.EN));
    }
  }

  setHousesList(searchAddress: SearchAddress, lang: string): void {
    this.locationService
      .getFullAddressList(searchAddress, this.autocompleteService, lang)
      .pipe(takeUntil(this.destroy))
      .subscribe((list: GooglePrediction[]) => {
        this.housePredictionList = list;
      });
  }

  onHouseSelected(item: AbstractControl, address: GooglePrediction): void {
    item.get('searchAddress').setValue(address.description);
    item.get('placeId').setValue(address.place_id);
    item.get('isHouseSelected').setValue(true);
    this.housePredictionList = null;
  }

  checkHouseInput(item: AbstractControl): void {
    if (!item.get('isHouseSelected').value) {
      item.get('houseNumber').setValue('');
    }
  }

  public setActualAddress(addressId): void {
    this.orderService.setActualAddress(addressId).pipe(takeUntil(this.destroy)).subscribe();
  }

  focusOnFirst(): void {
    document.getElementById('recipientName').focus();
  }

  onCancel(): void {
    this.userInit();
    this.isEditing = false;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isFetching = true;
      this.isEditing = false;
      const submitData = {
        addressDto: [],
        recipientEmail: this.userForm.value.recipientEmail,
        alternateEmail: this.userForm.value.alternateEmail,
        recipientName: this.userForm.value.recipientName,
        recipientPhone: this.userForm.value.recipientPhone,
        recipientSurname: this.userForm.value.recipientSurname,
        telegramIsNotify: this.userProfile.telegramIsNotify,
        viberIsNotify: this.userProfile.viberIsNotify,
        hasPassword: this.userProfile.hasPassword
      };

      if (!submitData.alternateEmail?.length) {
        delete submitData.alternateEmail;
      }
      this.userProfile.addressDto.forEach((address, i) => {
        const updatedAddres = {
          ...this.userForm.value.address[i],
          id: this.userProfile.addressDto[i].id,
          actual: this.userProfile.addressDto[i].actual,
          coordinates: this.userProfile.addressDto[i].coordinates
        };
        if (!updatedAddres.houseCorpus) {
          delete updatedAddres.houseCorpus;
        }
        if (!updatedAddres.entranceNumber) {
          delete updatedAddres.entranceNumber;
        }
        delete updatedAddres.searchAddress;
        delete updatedAddres.isHouseSelected;
        submitData.addressDto.push(updatedAddres);
      });

      this.clientProfileService
        .postDataClientProfile(submitData)
        .pipe(take(1))
        .subscribe(
          (res: UserProfile) => {
            this.isFetching = false;
            this.userProfile = this.composeFormData(res);
            this.userProfile.recipientEmail = this.userForm.value.recipientEmail;
            this.userProfile.alternateEmail = this.userForm.value.alternateEmail;
          },
          (err: Error) => {
            this.isFetching = false;
            this.snackBar.openSnackBar('ubs-client-profile.error-message');
          }
        );
      this.alternativeEmailDisplay = false;
    } else {
      this.isEditing = true;
    }
    this.snackBar.openSnackBar('savedChangesToUserProfile');
  }

  goToTelegramUrl() {
    (window as any).open(this.telegramBotURL, '_blank');
  }

  goToViberUrl() {
    (window as any).open(this.viberBotURL, '_blank');
  }

  openDeleteProfileDialog(): void {
    this.dialog.open(ConfirmationDialogComponent, {
      data: this.dataDeleteProfile,
      hasBackdrop: true
    });
  }

  public openDeleteAddressDialog(address): void {
    const matDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: this.dataDeleteAddress,
      hasBackdrop: true
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.deleteAddress(address);
        }
      });
  }

  openChangePasswordDialog(): void {
    this.dialog.open(UbsProfileChangePasswordPopUpComponent, {
      hasBackdrop: true,
      data: {
        hasPassword: this.userProfile.hasPassword
      }
    });
  }

  openAddAdressDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    dialogConfig.data = {
      edit: false,
      addFromProfile: true,
      address: {}
    };
    const dialogRef = this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        if (res) {
          this.getUserData();
        }
      });
  }

  formatedPhoneNumber(num: string): string | void {
    const match = num?.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return ` +380 (${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
    }
  }

  getControl(control: string) {
    return this.userForm.get(control);
  }

  toggleAlternativeEmail() {
    const control = new UntypedFormControl(this.userProfile?.alternateEmail, [
      Validators.pattern(Patterns.ubsMailPattern),
      Validators.minLength(3),
      Validators.maxLength(66),
      Validators.email
    ]);
    this.alternativeEmailDisplay = !this.alternativeEmailDisplay;

    this.alternativeEmailDisplay ? this.userForm.addControl('alternateEmail', control) : this.userForm.removeControl('alternateEmail');
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public getLangControl(uaControl: AbstractControl, enControl: AbstractControl): AbstractControl {
    return this.langService.getLangValue(uaControl, enControl) as AbstractControl;
  }

  updateValidInputs(control: string, controlEn: string, index: number): void {
    const currentControlName = this.langService.getLangValue(control, controlEn);
    const currentControl = this.userForm.controls.address.get(index.toString()).get(currentControlName as string);

    currentControl.setValidators([
      Validators.required,
      RequiredFromDropdownValidator.requiredFromDropdown(this.errorMessages[index][control])
    ]);
    currentControl.updateValueAndValidity();
    this.userForm.updateValueAndValidity();
  }

  onSwitchChanged(id: string): void {
    switch (id) {
      case NotificationPlatform.telegramNotification:
        this.userProfile.telegramIsNotify = !this.userProfile.telegramIsNotify;
        if (this.userProfile.telegramIsNotify) {
          this.goToTelegramUrl();
        }
        break;

      case NotificationPlatform.viberNotification:
        this.userProfile.viberIsNotify = !this.userProfile.viberIsNotify;
        if (this.userProfile.viberIsNotify) {
          this.goToViberUrl();
        }
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
