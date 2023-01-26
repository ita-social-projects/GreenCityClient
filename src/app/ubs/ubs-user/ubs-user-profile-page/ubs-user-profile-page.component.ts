import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Address, UserProfile, Location } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from 'src/app/ubs/ubs-user/services/client-profile.service';
import { UbsProfileDeletePopUpComponent } from './ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Locations } from 'src/assets/locations/locations';
import { PhoneNumberValidator } from 'src/app/shared/phone-validator/phone.validator';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GoogleScript } from 'src/assets/google-script/google-script';

@Component({
  selector: 'app-ubs-user-profile-page',
  templateUrl: './ubs-user-profile-page.component.html',
  styleUrls: ['./ubs-user-profile-page.component.scss']
})
export class UbsUserProfilePageComponent implements OnInit, AfterViewInit, OnDestroy {
  autocompleteService: google.maps.places.AutocompleteService;
  placeService: google.maps.places.PlacesService;
  streetPredictionList: google.maps.places.AutocompletePrediction[];
  cityPredictionList: google.maps.places.AutocompletePrediction[];
  private destroy: Subject<boolean> = new Subject<boolean>();
  userForm: FormGroup;
  userProfile: UserProfile;
  viberNotification = false;
  telegramNotification = false;
  defaultAddress: Address = {
    actual: true,
    city: '',
    cityEn: '',
    coordinates: {
      latitude: 1,
      longitude: 1
    },
    region: '',
    regionEn: '',
    district: '',
    districtEn: '',
    entranceNumber: '',
    houseCorpus: '',
    houseNumber: '',
    id: null,
    street: '',
    streetEn: ''
  };

  googleIcon = SignInIcons.picGoogle;
  isEditing = false;
  isFetching = false;
  telegramBotURL = 'https://telegram.me/TrayingAgainDoSomthBot?start=1a3a3f0f-6e79-4be6-987a-b6ed82b7b272';
  viberBotURL = 'viber://pa?chatURI=ubstestbot1&context=1a3a3f0f-6e79-4be6-987a-b6ed82b7b272';
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

  constructor(
    public dialog: MatDialog,
    private clientProfileService: ClientProfileService,
    private snackBar: MatSnackBarComponent,
    private localStorageService: LocalStorageService,
    private locations: Locations,
    private googleScript: GoogleScript
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
        this.isFetching = false;
      },
      (err: Error) => {
        this.isFetching = false;
        this.snackBar.openSnackBar('ubs-client-profile.error-message');
      }
    );
  }

  userInit(): void {
    const addres = new FormArray([]);
    this.userProfile.addressDto.forEach((adres) => {
      const seperateAddress = new FormGroup({
        city: new FormControl(adres?.city, [Validators.required, Validators.pattern(Patterns.ubsCityPattern), Validators.maxLength(20)]),
        cityEn: new FormControl(adres?.cityEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsCityPattern),
          Validators.maxLength(20)
        ]),
        street: new FormControl(adres?.street, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(120)
        ]),
        streetEn: new FormControl(adres?.streetEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(120)
        ]),
        houseNumber: new FormControl(adres?.houseNumber, [
          Validators.required,
          Validators.pattern(Patterns.ubsHouseNumberPattern),
          Validators.maxLength(4)
        ]),
        houseCorpus: new FormControl(adres?.houseCorpus, [Validators.pattern(Patterns.ubsWithDigitPattern), Validators.maxLength(4)]),
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
        district: new FormControl(adres?.district, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        districtEn: new FormControl(adres?.districtEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(30)
        ]),
        isKyiv: new FormControl(adres?.city === 'Київ' ? true : false)
      });
      addres.push(seperateAddress);
    });
    this.userForm = new FormGroup({
      address: addres,
      recipientName: new FormControl(this.userProfile?.recipientName, [
        Validators.required,
        Validators.pattern(Patterns.ubsNameAndSernamePattern),
        Validators.maxLength(30)
      ]),
      recipientSurname: new FormControl(this.userProfile?.recipientSurname, [
        Validators.required,
        Validators.pattern(Patterns.ubsNameAndSernamePattern),
        Validators.maxLength(30)
      ]),
      recipientEmail: new FormControl(this.userProfile?.recipientEmail, [Validators.required, Validators.pattern(Patterns.ubsMailPattern)]),
      alternativeEmail: new FormControl(this.userProfile?.alternateEmail, [Validators.pattern(Patterns.ubsMailPattern)]),
      recipientPhone: new FormControl(`+380${this.userProfile?.recipientPhone}`, [
        Validators.required,
        Validators.minLength(12),
        PhoneNumberValidator('UA')
      ]),
      telegramIsChecked: new FormControl(this.userProfile.telegramIsChecked),
      viberIsChecked: new FormControl(this.userProfile.viberIsChecked)
    });
    this.isFetching = false;
  }

  private initGoogleAutocompleteServices(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  setRegionValue(formGroupName: number, event: Event): void {
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    const region = currentFormGroup.get('region');
    const regionEn = currentFormGroup.get('regionEn');

    this.getLangValue(region, regionEn).valueChanges.subscribe(() => {
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
      this.inputCity(`${region.value}, ${city.value}`, regionEn.value);
    }
    if (this.currentLanguage === 'en' && cityEn.value) {
      this.inputCity(`${regionEn.value},${cityEn.value}`, regionEn.value);
    }
  }

  inputCity(searchAddress: string, regionEnName: string): void {
    const request = {
      input: searchAddress,
      language: this.currentLanguage,
      types: ['(cities)'],
      region: 'ua',
      componentRestrictions: { country: 'ua' }
    };
    this.autocompleteService.getPlacePredictions(request, (cityPredictionList) => {
      if (regionEnName === 'Kyiv' && cityPredictionList) {
        this.cityPredictionList = cityPredictionList.filter((el) => el.place_id === 'ChIJBUVa4U7P1EAR_kYBF9IxSXY');
      } else {
        this.cityPredictionList = cityPredictionList;
      }
    });
  }

  onCitySelected(formGroupName: number, selectedCity: google.maps.places.AutocompletePrediction): void {
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());
    const cityEn = currentFormGroup.get('cityEn');
    const city = currentFormGroup.get('city');

    this.setValueOfCity(selectedCity, currentFormGroup, 'city');
    this.setValueOfCity(selectedCity, currentFormGroup, 'cityEn');

    this.getLangValue(city, cityEn).valueChanges.subscribe(() => {
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

  setValueOfCity(selectedCity: google.maps.places.AutocompletePrediction, item: AbstractControl, abstractControlName: string): void {
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
      this.inputAddress(`${city.value}, ${street.value}`, currentFormGroup);
    }
    if (this.currentLanguage === 'en' && streetEn.value) {
      this.inputAddress(`${cityEn.value}, ${streetEn.value}`, currentFormGroup);
    }
  }

  inputAddress(searchAddress: string, item: AbstractControl): void {
    const isKyiv = item.get('isKyiv');

    const request = {
      input: searchAddress,
      language: this.currentLanguage,
      types: ['address'],
      componentRestrictions: { country: 'ua' }
    };
    this.autocompleteService.getPlacePredictions(request, (streetPredictions) => {
      if (!isKyiv.value && streetPredictions) {
        this.streetPredictionList = streetPredictions.filter(
          (el) => el.description.includes('Київська область') || el.description.includes('Kyiv Oblast')
        );
      } else {
        this.streetPredictionList = streetPredictions;
      }
    });
  }

  onStreetSelected(formGroupName: number, selectedStreet: google.maps.places.AutocompletePrediction): void {
    const currentFormGroup = this.userForm.controls.address.get(formGroupName.toString());

    this.setValueOfStreet(selectedStreet, currentFormGroup, 'street');
    this.setValueOfStreet(selectedStreet, currentFormGroup, 'streetEn');
  }

  setValueOfStreet(selectedStreet: google.maps.places.AutocompletePrediction, item: AbstractControl, abstractControlName: string): void {
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

  setDistrictAuto(placeDetails: google.maps.places.PlaceResult, abstractControl: AbstractControl, language: string): void {
    const searchItem = language === this.languages.en ? 'district' : 'район';
    const getDistrict = placeDetails.address_components.filter((item) => item.long_name.toLowerCase().includes(searchItem))[0];
    if (getDistrict) {
      const currentDistrict = getDistrict.long_name;
      abstractControl.setValue(currentDistrict);
    }
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

  onEdit(): void {
    this.isEditing = true;
    this.isFetching = false;
    this.regions = this.locations.getBigRegions(this.currentLanguage);
    this.districtsKyiv = this.locations.getRegionsKyiv(this.currentLanguage);
    this.districts = this.locations.getRegions(this.currentLanguage);
    this.initGoogleAutocompleteServices();
    setTimeout(() => this.focusOnFirst());
  }

  focusOnFirst(): void {
    document.getElementById('recipientName').focus();
  }

  onCancel(): void {
    this.userInit();
    this.isEditing = false;
  }

  checkedCheckbox(event) {
    if (event.source.id === 'telegramNotification') {
      this.telegramNotification = event.checked;
    }

    if (event.source.id === 'viberNotification') {
      this.viberNotification = event.checked;
    }
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
        telegramIsChecked: this.telegramNotification,
        viberIsChecked: this.viberNotification,
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
        submitData.addressDto.push(updatedAddres);
      });

      this.clientProfileService.postDataClientProfile(submitData).subscribe(
        (res: UserProfile) => {
          this.isFetching = false;
          this.userProfile = this.composeFormData(res);
          this.userProfile.recipientEmail = this.userForm.value.recipientEmail;
          this.userProfile.alternateEmail = this.userForm.value.alternateEmail;
          this.userProfile.telegramIsChecked = this.userForm.value.telegramIsChecked;
          this.userProfile.viberIsChecked = this.userForm.value.viberIsChecked;
        },
        (err: Error) => {
          this.isFetching = false;
          this.snackBar.openSnackBar('ubs-client-profile.error-message');
        }
      );
      this.alternativeEmailDisplay = false;
      this.redirectToMessengers();
    } else {
      this.isEditing = true;
    }
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

  openDeleteProfileDialog(): void {
    this.dialog.open(UbsProfileDeletePopUpComponent, {
      hasBackdrop: true
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
      address: {}
    };
    this.dialog.open(UBSAddAddressPopUpComponent, dialogConfig);
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

  public getErrorMessageKey(abstractControl: AbstractControl, emailTypeOfControl: boolean = false): string {
    if (abstractControl.errors.required) {
      return 'input-error.required';
    }

    if (abstractControl.errors.maxlength && !emailTypeOfControl) {
      return 'ubs-client-profile.error-message-if-edit-name-surname';
    }

    if (abstractControl.errors.maxlength && emailTypeOfControl) {
      return 'ubs-client-profile.error-message-if-edit-alternativeEmail';
    }

    if (abstractControl.errors.pattern) {
      return 'input-error.pattern';
    }

    if (abstractControl.errors.minlength) {
      return 'input-error.number-length';
    }

    if (abstractControl.errors.wrongNumber) {
      return 'input-error.number-wrong';
    }
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

  public getLangValue(uaValue, enValue): any {
    return this.currentLanguage === 'ua' ? uaValue : enValue;
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
