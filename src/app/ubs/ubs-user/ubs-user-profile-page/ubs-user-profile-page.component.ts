import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Address, UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from 'src/app/ubs/ubs-user/services/client-profile.service';
import { UbsProfileDeletePopUpComponent } from './ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Locations } from 'src/assets/locations/locations';
import { PhoneNumberValidator } from 'src/app/shared/phone-validator/phone.validator';
import { LatLngBoundsLiteral } from '@agm/core';

@Component({
  selector: 'app-ubs-user-profile-page',
  templateUrl: './ubs-user-profile-page.component.html',
  styleUrls: ['./ubs-user-profile-page.component.scss']
})
export class UbsUserProfilePageComponent implements OnInit {
  autocompleteService: google.maps.places.AutocompleteService;
  placeService: google.maps.places.PlacesService;
  inputStreetElement: any;
  streetPredictionList: any;
  userForm: FormGroup;
  addres = new FormArray([]);
  userProfile: any;
  defaultAddress: any = {
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
  alternativeEmailDisplay = false;
  phoneMask = Masks.phoneMask;
  maxAddressLength = 4;
  currentLanguage: string;
  cities = [];
  regions = [];
  districts = [];
  cityBounds: LatLngBoundsLiteral;
  constructor(
    public dialog: MatDialog,
    private clientProfileService: ClientProfileService,
    private snackBar: MatSnackBarComponent,
    private localStorageService: LocalStorageService,
    private locations: Locations
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.getUserData();
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
        console.log(this.userProfile);
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
          Validators.maxLength(50)
        ]),
        streetEn: new FormControl(adres?.streetEn, [
          Validators.required,
          Validators.pattern(Patterns.ubsWithDigitPattern),
          Validators.maxLength(50)
        ]),
        houseNumber: new FormControl(adres?.houseNumber, [
          Validators.required,
          Validators.pattern(Patterns.ubsHouseNumberPattern),
          Validators.maxLength(5)
        ]),
        houseCorpus: new FormControl(adres?.houseCorpus, [Validators.pattern(Patterns.ubsWithDigitPattern), Validators.maxLength(5)]),
        entranceNumber: new FormControl(adres?.entranceNumber, [Validators.pattern(Patterns.ubsEntrNumPattern), Validators.maxLength(4)]),
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
        ])
      });
      this.addres.push(seperateAddress);
    });
    this.userForm = new FormGroup({
      address: this.addres,
      recipientName: new FormControl(this.userProfile?.recipientName, [
        Validators.required,
        Validators.pattern(Patterns.ubsCityPattern),
        Validators.maxLength(30)
      ]),
      recipientSurname: new FormControl(this.userProfile?.recipientSurname, [
        Validators.required,
        Validators.pattern(Patterns.ubsCityPattern),
        Validators.maxLength(30)
      ]),
      recipientEmail: new FormControl(this.userProfile?.recipientEmail, [Validators.required, Validators.pattern(Patterns.ubsMailPattern)]),
      alternativeEmail: new FormControl(this.userProfile?.alternateEmail, [Validators.pattern(Patterns.ubsMailPattern)]),
      recipientPhone: new FormControl(`+380${this.userProfile?.recipientPhone}`, [
        Validators.required,
        Validators.minLength(12),
        PhoneNumberValidator('UA')
      ])
    });
    this.isFetching = false;
  }

  onEdit(): void {
    this.isEditing = true;
    this.isFetching = false;
    this.regions = this.locations.getBigRegions(this.currentLanguage);
    this.cities = this.locations.getCity(this.currentLanguage);
    this.districts = this.locations.getRegionsKyiv(this.currentLanguage);
    // console.log(this.addres.value)
    // console.log(this.userForm.get('address.0.street').setValue('Гатне'));
    // console.log(this.getControl('address'));

    setTimeout(() => this.focusOnFirst());
  }

  focusOnFirst(): void {
    document.getElementById('recipientName').focus();
    this.initGoogleAutocompleteServices();
  }

  private initGoogleAutocompleteServices(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
  }

  setPredictStreets(region: string, city: string, street: string): void {
    const regionIndex = parseInt(region, 10);
    const regionParam = regionIndex < 10 ? region.slice(3) : region.slice(4);
    const cityIndex = parseInt(city, 10);
    const cityParam = cityIndex < 10 ? city.slice(3) : city.slice(4);
    const searchAddress = `${regionParam}, ${cityParam}, ${street}`;
    console.log(cityParam);
    this.cityBounds = this.locations.getCityCoordinates(cityIndex);
    console.log(this.cityBounds);

    this.inputAddress(searchAddress);
  }

  inputAddress(searchAddress: string): void {
    const request = {
      input: searchAddress,
      bounds: this.cityBounds,
      strictBounds: true,
      types: ['address'],
      componentRestrictions: { country: 'ua' }
    };
    this.autocompleteService.getPlacePredictions(request, (streetPredictions) => {
      this.streetPredictionList = streetPredictions;
      console.log(this.streetPredictionList[0].structured_formatting.main_text);
    });

    // this.street.setValue()
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
}
