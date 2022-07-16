import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Address, UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from 'src/app/ubs/ubs-user/services/client-profile.service';
import { UbsProfileDeletePopUpComponent } from './ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { UBSAddAddressPopUpComponent } from 'src/app/shared/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-ubs-user-profile-page',
  templateUrl: './ubs-user-profile-page.component.html',
  styleUrls: ['./ubs-user-profile-page.component.scss']
})
export class UbsUserProfilePageComponent implements OnInit {
  userForm: FormGroup;
  userProfile: UserProfile;
  defaultAddress: Address = {
    actual: true,
    city: '',
    coordinates: {
      latitude: 1,
      longitude: 1
    },
    region: '',
    district: '',
    entranceNumber: '',
    houseCorpus: '',
    houseNumber: '',
    id: null,
    street: ''
  };

  googleIcon = SignInIcons.picGoogle;
  isEditing = false;
  isFetching = false;
  alternativeEmailDisplay = false;
  phoneMask = Masks.phoneMask;
  currentLocation = {};
  maxAddressLength = 4;
  private readonly regexp = Patterns.ubsCityPattern;
  private readonly regexpEmail = Patterns.ubsMailPattern;
  private readonly regexpWithDigits = Patterns.ubsWithDigitPattern;

  constructor(public dialog: MatDialog, private clientProfileService: ClientProfileService, private snackBar: MatSnackBarComponent) {}

  ngOnInit(): void {
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
        city: new FormControl(adres?.city, [Validators.pattern(this.regexp), Validators.maxLength(20)]),
        street: new FormControl(adres?.street, [Validators.pattern(this.regexpWithDigits), Validators.maxLength(30)]),
        houseNumber: new FormControl(adres?.houseNumber, [Validators.pattern(this.regexpWithDigits), Validators.maxLength(4)]),
        houseCorpus: new FormControl(adres?.houseCorpus, [Validators.pattern(this.regexpWithDigits), Validators.maxLength(4)]),
        entranceNumber: new FormControl(adres?.entranceNumber, [Validators.pattern(this.regexpWithDigits), Validators.maxLength(4)]),
        region: new FormControl(adres?.region, [Validators.pattern(this.regexpWithDigits), Validators.maxLength(20)]),
        district: new FormControl(adres?.district, [Validators.pattern(this.regexpWithDigits), Validators.maxLength(20)])
      });
      addres.push(seperateAddress);
    });
    this.userForm = new FormGroup({
      address: addres,
      recipientName: new FormControl(this.userProfile?.recipientName, [
        Validators.required,
        Validators.pattern(this.regexp),
        Validators.maxLength(30)
      ]),
      recipientSurname: new FormControl(this.userProfile?.recipientSurname, [
        Validators.required,
        Validators.pattern(this.regexp),
        Validators.maxLength(30)
      ]),
      recipientEmail: new FormControl(this.userProfile?.recipientEmail, [Validators.required, Validators.pattern(this.regexpEmail)]),
      recipientPhone: new FormControl(`+380${this.userProfile?.recipientPhone}`, [Validators.required, Validators.minLength(12)])
    });
    this.isFetching = false;
  }

  onEdit(): void {
    this.isEditing = true;
    this.isFetching = false;
    setTimeout(() => this.focusOnFirst());
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
        hasPassword: this.userProfile.hasPassword
      };
      this.userProfile.addressDto.forEach((address, i) => {
        const updatedAddres = {
          ...this.userForm.value.address[i],
          id: this.userProfile.addressDto[i].id,
          actual: this.userProfile.addressDto[i].actual,
          coordinates: this.userProfile.addressDto[i].coordinates
        };
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
    this.currentLocation = this.userProfile.addressDto[0].city;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles';
    dialogConfig.data = {
      edit: false,
      currentLocation: this.currentLocation,
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

  toggleAlternativeEmail() {
    const control = new FormControl(this.userProfile?.alternateEmail, [
      Validators.pattern(this.regexpEmail),
      Validators.minLength(3),
      Validators.maxLength(66),
      Validators.email
    ]);
    this.alternativeEmailDisplay = !this.alternativeEmailDisplay;

    this.alternativeEmailDisplay ? this.userForm.addControl('alternateEmail', control) : this.userForm.removeControl('alternateEmail');
  }
}
