import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Address, UserProfile } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from 'src/app/ubs/ubs-user/services/client-profile.service';
import { UbsProfileDeletePopUpComponent } from './ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';

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
  phoneMask = '+{38\\0} (00) 000 00 00';
  private readonly regexp = /^([a-zа-яїєґі '-]){1,30}/iu;
  private readonly regexpEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  private readonly regexpWithDigits = /^([a-zа-яїєґі0-9 '-])+$/iu;

  constructor(public dialog: MatDialog, private clientProfileService: ClientProfileService, private snackBar: MatSnackBarComponent) {}

  ngOnInit() {
    this.getUserData();
  }

  composeFormData(data: UserProfile) {
    return {
      ...data,
      recipientPhone: data.recipientPhone?.slice(-9)
    };
  }

  getUserData() {
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

  userInit() {
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

  onEdit() {
    this.isEditing = true;
    this.isFetching = false;
  }

  onCancel() {
    this.userInit();
    this.isEditing = false;
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isFetching = true;
      this.isEditing = false;
      const submitData = {
        addressDto: [],
        recipientEmail: this.userForm.value.recipientEmail,
        recipientName: this.userForm.value.recipientName,
        recipientPhone: this.userForm.value.recipientPhone,
        recipientSurname: this.userForm.value.recipientSurname
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
        },
        (err: Error) => {
          this.isFetching = false;
          this.snackBar.openSnackBar('ubs-client-profile.error-message');
        }
      );
    } else {
      this.isEditing = true;
    }
  }

  openDeleteProfileDialog() {
    this.dialog.open(UbsProfileDeletePopUpComponent, {
      hasBackdrop: true
    });
  }

  openChangePasswordDialog() {
    this.dialog.open(UbsProfileChangePasswordPopUpComponent, {
      hasBackdrop: true
    });
  }

  formatedPhoneNumber(num: string) {
    const match = num?.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return ` +380 (${match[1]}) ${match[2]} ${match[3]} ${match[4]}`;
    }
  }

  getControl(control: string) {
    return this.userForm.get(control);
  }
}
