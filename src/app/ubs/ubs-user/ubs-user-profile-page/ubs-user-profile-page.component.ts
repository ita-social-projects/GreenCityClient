import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Address, UserProfile, Location } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from 'src/app/ubs/ubs-user/services/client-profile.service';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Locations } from 'src/assets/locations/locations';
import { PhoneNumberValidator } from 'src/app/shared/phone-validator/phone.validator';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { LocationService } from '@global-service/location/location.service';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { ConfirmationDialogComponent } from '../../ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SearchAddress } from '../../ubs/models/ubs.interface';
import { GoogleAutoService, GooglePlaceResult, GooglePlaceService, GooglePrediction } from '../../mocks/google-types';

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
  userForm: FormGroup;
  public resetFieldImg = './assets/img/ubs-tariff/bigClose.svg';
  userProfile: UserProfile;
  viberNotification = false;
  telegramNotification = false;

  googleIcon = SignInIcons.picGoogle;
  isEditing = false;
  isFetching = false;
  telegramBotURL: string;
  viberBotURL: string;
  alternativeEmailDisplay = false;
  phoneMask = Masks.phoneMask;
  maxAddressLength = 4;
  currentLanguage: string;
  regions: Location[];
  districts: Location[];
  districtsKyiv: Location[];
  languages = {
    en: 'en',
    uk: 'uk'
  };
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

  constructor(
    public dialog: MatDialog,
    private clientProfileService: ClientProfileService,
    private snackBar: MatSnackBarComponent,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private locations: Locations,
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

  setUrlToBot(): void {
    this.telegramBotURL = this.userProfile.botList[0]?.link;
    this.viberBotURL = this.userProfile.botList[1]?.link;
  }

  userInit(): void {
    const addres = new FormArray([]);
    this.userProfile.addressDto.forEach((adres) => {
      const seperateAddress = new FormGroup({
        city: new FormControl(adres?.city, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.minLength(1),
          Validators.maxLength(30)
        ]),
        cityEn: new FormControl(adres?.cityEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.minLength(1),
          Validators.maxLength(30)
        ]),
        street: new FormControl(adres?.street, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.minLength(1),
          Validators.maxLength(120)
        ]),
        streetEn: new FormControl(adres?.streetEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.minLength(1),
          Validators.maxLength(120)
        ]),
        houseNumber: new FormControl(adres?.houseNumber, [
          Validators.required,
          Validators.pattern(Patterns.ubsHousePattern),
          Validators.maxLength(4)
        ]),
        houseCorpus: new FormControl(adres?.houseCorpus, [Validators.pattern(Patterns.ubsCorpusPattern), Validators.maxLength(4)]),
        entranceNumber: new FormControl(adres?.entranceNumber, [Validators.pattern(Patterns.ubsEntrNumPattern), Validators.maxLength(2)]),
        region: new FormControl(adres?.region, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        regionEn: new FormControl(adres?.regionEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        district: new FormControl(this.convertDistrictName(adres?.district), [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        districtEn: new FormControl(this.convertDistrictName(adres?.districtEn), [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        isKyiv: new FormControl(adres?.city === 'Київ' ? true : false),
        searchAddress: new FormControl(null),
        isHouseSelected: new FormControl(adres?.houseNumber ? true : false),
        placeId: new FormControl(null),
        id: new FormControl(adres?.id),
        actual: new FormControl(adres?.actual)
      });
      addres.push(seperateAddress);
    });
    this.userForm = new FormGroup({
      address: addres,
      recipientName: new FormControl(this.userProfile?.recipientName, [
        Validators.required,
        Validators.pattern(Patterns.NameInfoPattern),
        Validators.maxLength(30)
      ]),
      recipientSurname: new FormControl(this.userProfile?.recipientSurname, [
        Validators.required,
        Validators.pattern(Patterns.NameInfoPattern),
        Validators.maxLength(30)
      ]),
      recipientEmail: new FormControl(this.userProfile?.recipientEmail, [Validators.required, Validators.pattern(Patterns.ubsMailPattern)]),
      alternativeEmail: new FormControl(this.userProfile?.alternateEmail, [Validators.pattern(Patterns.ubsMailPattern)]),
      recipientPhone: new FormControl(`+380${this.userProfile?.recipientPhone}`, [
        Validators.required,
        Validators.minLength(12),
        PhoneNumberValidator('UA')
      ]),
      telegramIsNotify: new FormControl(this.userProfile.telegramIsNotify),
      viberIsNotify: new FormControl(this.userProfile.viberIsNotify)
    });
    this.isFetching = false;
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

  setRegionValue(formGroupName: number, event: Event): void {
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    const region = currentFormGroup.get('region');
    const regionEn = currentFormGroup.get('regionEn');

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
      this.streetPredictionList = null;
      this.cityPredictionList = null;
      this.housePredictionList = null;
    });

    const elem = this.regions.find((el) => el.name === (event.target as HTMLSelectElement).value.slice(3));
    const selectedRegionUa = this.locations.getBigRegions('ua').find((el) => el.key === elem.key);
    const selectedRegionEn = this.locations.getBigRegions('en').find((el) => el.key === elem.key);
    region.setValue(selectedRegionUa.name);
    regionEn.setValue(selectedRegionEn.name);
  }

  emptyPredictLists(): void {
    this.cityPredictionList = null;
    this.streetPredictionList = null;
  }

  setPredictCities(formGroupName: number): void {
    this.cityPredictionList = null;
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    const regionEn = currentFormGroup.get('regionEn');
    const cityEn = currentFormGroup.get('cityEn');
    const region = currentFormGroup.get('region');
    const city = currentFormGroup.get('city');

    if (this.currentLanguage === 'ua' && city.value) {
      this.inputCity(`${region.value}, ${city.value}`, regionEn.value, this.languages.uk);
    }
    if (this.currentLanguage === 'en' && cityEn.value) {
      this.inputCity(`${regionEn.value},${cityEn.value}`, regionEn.value, this.languages.en);
    }
  }

  inputCity(searchAddress: string, regionEnName: string, lang: string): void {
    const request = this.locationService.getRequest(searchAddress, lang, '(cities)');

    this.autocompleteService.getPlacePredictions(request, (cityPredictionList) => {
      if (regionEnName === 'Kyiv') {
        this.cityPredictionList = cityPredictionList?.filter((el) => el.place_id === 'ChIJBUVa4U7P1EAR_kYBF9IxSXY');
      } else {
        this.cityPredictionList = cityPredictionList;
      }
    });
  }

  onCitySelected(formGroupName: number, selectedCity: GooglePrediction): void {
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
    const isKyiv = item.get('isKyiv');

    const request = {
      placeId: selectedCity.place_id,
      language: abstractControlName === 'city' ? this.languages.uk : this.languages.en
    };
    this.placeService.getDetails(request, (placeDetails) => {
      abstractControl.setValue(placeDetails.name);
      if (abstractControlName === 'city') {
        isKyiv.setValue(abstractControl.value === 'Київ' ? true : false);
      }
    });
  }

  setPredictStreets(formGroupName: number): void {
    this.streetPredictionList = null;
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    const city = currentFormGroup.get('city');
    const cityEn = currentFormGroup.get('cityEn');
    const street = currentFormGroup.get('street');
    const streetEn = currentFormGroup.get('streetEn');

    if (this.currentLanguage === 'ua' && street.value) {
      this.inputAddress(`${city.value}, ${street.value}`, currentFormGroup, this.languages.uk);
    }
    if (this.currentLanguage === 'en' && streetEn.value) {
      this.inputAddress(`${cityEn.value}, ${streetEn.value}`, currentFormGroup, this.languages.en);
    }
  }

  inputAddress(searchAddress: string, item: AbstractControl, lang: string): void {
    const isKyiv = item.get('isKyiv');
    const city = item.get('city');
    const cityEn = item.get('cityEn');

    const request = this.locationService.getRequest(searchAddress, lang, 'address');

    this.autocompleteService.getPlacePredictions(request, (streetPredictions) => {
      if (!isKyiv.value) {
        this.streetPredictionList = streetPredictions?.filter(
          (el) =>
            (el.structured_formatting.secondary_text.includes('Київська область') ||
              el.structured_formatting.secondary_text.includes('Kyiv Oblast')) &&
            (el.structured_formatting.secondary_text.includes(city.value) || el.structured_formatting.secondary_text.includes(cityEn.value))
        );
      } else {
        this.streetPredictionList = streetPredictions?.filter(
          (el) =>
            el.structured_formatting.secondary_text.includes(city.value) || el.structured_formatting.secondary_text.includes(cityEn.value)
        );
      }
    });
  }

  onStreetSelected(formGroupName: number, selectedStreet: GooglePrediction): void {
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    currentFormGroup.get('houseNumber').setValue('');

    this.setValueOfStreet(selectedStreet, currentFormGroup, 'street');
    this.setValueOfStreet(selectedStreet, currentFormGroup, 'streetEn');
  }

  setValueOfStreet(selectedStreet: GooglePrediction, item: AbstractControl, abstractControlName: string): void {
    const abstractControl = item.get(abstractControlName);
    const isKyiv = item.get('isKyiv');

    const request = {
      placeId: selectedStreet.place_id,
      language: abstractControlName === 'street' ? this.languages.uk : this.languages.en
    };
    this.placeService.getDetails(request, (placeDetails) => {
      abstractControl.setValue(placeDetails.name);

      if (request.language === this.languages.en && isKyiv.value) {
        const districtEn = item.get('districtEn');
        this.setDistrictAuto(placeDetails, districtEn, request.language);
      }
      if (request.language === this.languages.uk && isKyiv.value) {
        const district = item.get('district');
        this.setDistrictAuto(placeDetails, district, request.language);
      }
    });
  }

  setDistrictAuto(placeDetails: GooglePlaceResult, abstractControl: AbstractControl, language: string): void {
    const currentDistrict = this.locationService.getDistrictAuto(placeDetails, language);
    abstractControl.setValue(currentDistrict);
  }

  onDistrictSelected(formGroupName: number, event: Event): void {
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    const isKyiv = currentFormGroup.get('isKyiv');
    const districtKey = (event.target as HTMLSelectElement).value.slice(0, 1);

    isKyiv.value ? this.setKyivDistrict(districtKey, currentFormGroup) : this.setDistrict(districtKey, currentFormGroup);
  }

  setKyivDistrict(districtKey: string, item: AbstractControl): void {
    const key = Number(districtKey) + 1;
    const selectedDistrict = this.locations.getRegionsKyiv('ua').find((el) => el.key === key);
    const selectedDistricEn = this.locations.getRegionsKyiv('en').find((el) => el.key === key);

    item.get('district').setValue(selectedDistrict.name);
    item.get('districtEn').setValue(selectedDistricEn.name);
  }

  setDistrict(districtKey: string, item: AbstractControl): void {
    const key = Number(districtKey) + 1;
    const selectedDistrict = this.locations.getRegions('ua').find((el) => el.key === key);
    const selectedDistricEn = this.locations.getRegions('en').find((el) => el.key === key);

    item.get('district').setValue(selectedDistrict.name);
    item.get('districtEn').setValue(selectedDistricEn.name);
  }

  private convertDistrictName(district: string): string {
    return this.locationService.convFirstLetterToCapital(district);
  }

  onEdit(): void {
    this.isEditing = true;
    this.isFetching = false;
    this.regions = this.locations.getBigRegions(this.currentLanguage);
    this.districtsKyiv = this.locations.getRegionsKyiv(this.currentLanguage);
    this.districts = this.locations.getRegions(this.currentLanguage);
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
      this.setHousesList(searchAddress, this.getLangValue(this.languages.uk, this.languages.en));
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

  focusOnFirst(): void {
    document.getElementById('recipientName').focus();
  }

  onCancel(): void {
    this.userInit();
    this.isEditing = false;
  }

  public resetValue(): void {
    this.userForm.get('alternateEmail').setValue(null);
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
            this.localStorageService.setFirstName(this.userForm.value.recipientName);
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

  redirectToMessengers() {
    if (this.telegramNotification) {
      this.goToTelegramUrl();
    }
    if (this.viberNotification) {
      this.goToViberUrl();
    }
  }

  goToTelegramUrl() {
    (window as any).open(this.telegramBotURL, '_blank');
  }

  goToViberUrl() {
    (window as any).open(this.viberBotURL, '_blank');
  }

  setActualAddress(addressId): void {
    this.orderService.setActualAddress(addressId).pipe(takeUntil(this.destroy)).subscribe();
  }

  openChangePasswordDialog(): void {
    this.dialog.open(UbsProfileChangePasswordPopUpComponent, {
      hasBackdrop: true,
      data: {
        hasPassword: this.userProfile.hasPassword
      }
    });
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

  openAddAdressDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    dialogConfig.data = {
      edit: false,
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
    const control = new FormControl(this.userProfile?.alternateEmail, [
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

  onSwitchChanged(id: string, checked: boolean) {
    if (id === 'telegramNotification') {
      this.telegramNotification = checked;
      this.userProfile.telegramIsNotify = !this.userProfile.telegramIsNotify;
    }

    if (id === 'viberNotification') {
      this.viberNotification = checked;
      this.userProfile.viberIsNotify = !this.userProfile.viberIsNotify;
    }

    if (this.userProfile.viberIsNotify || this.userProfile.telegramIsNotify) {
      this.redirectToMessengers();
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
