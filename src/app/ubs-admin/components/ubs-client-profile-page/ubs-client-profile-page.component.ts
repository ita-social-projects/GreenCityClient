import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { Address, UserProfile } from '../../models/ubs-admin.interface';
import { ClientProfileService } from '../../services/client-profile.service';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { UbsProfileDeletePopUpComponent } from './ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-ubs-client-profile-page',
  templateUrl: './ubs-client-profile-page.component.html',
  styleUrls: ['./ubs-client-profile-page.component.scss']
})
export class UbsClientProfilePageComponent implements OnInit {
  userForm: FormGroup;
  userProfile: UserProfile;
  defaultAddress: Address = {
    actual: true,
    city: '',
    coordinates: {
      latitude: 1,
      longitude: 1
    },
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
  phoneMask = '+{38} 000 000 00 00';
  private readonly regexp = /^([a-zA-ZА-Яа-яЄЇҐа-їєґ '-])+$/iu;
  private readonly regexpEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  private readonly regexpWithDigits = /^([a-zA-ZА-Яа-яЄЇҐа-їєґ0-9 '-])+$/iu;

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
        if (!this.userProfile.addressDto || Object.keys(this.userProfile.addressDto).length === 0) {
          this.userProfile.addressDto = this.defaultAddress;
        }
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
    this.userForm = new FormGroup({
      address: new FormGroup({
        city: new FormControl(this.userProfile.addressDto.city, [Validators.pattern(this.regexp), Validators.maxLength(20)]),
        street: new FormControl(this.userProfile.addressDto.street, [Validators.pattern(this.regexpWithDigits), Validators.maxLength(20)]),
        houseNumber: new FormControl(this.userProfile.addressDto.houseNumber, [
          Validators.pattern(this.regexpWithDigits),
          Validators.maxLength(4)
        ]),
        houseCorpus: new FormControl(this.userProfile.addressDto.houseCorpus, [
          Validators.pattern(this.regexpWithDigits),
          Validators.maxLength(4)
        ]),
        entranceNumber: new FormControl(this.userProfile.addressDto.entranceNumber, [
          Validators.pattern(this.regexpWithDigits),
          Validators.maxLength(4)
        ]),
        district: new FormControl(this.userProfile.addressDto.district, [
          Validators.pattern(this.regexpWithDigits),
          Validators.maxLength(20)
        ])
      }),
      recipientName: new FormControl(this.userProfile.recipientName, [Validators.required, Validators.pattern(this.regexp)]),
      recipientSurname: new FormControl(this.userProfile.recipientSurname, [Validators.required, Validators.pattern(this.regexp)]),
      recipientEmail: new FormControl(this.userProfile.recipientEmail, [Validators.required, Validators.pattern(this.regexpEmail)]),
      recipientPhone: new FormControl(`+38 0${this.userProfile.recipientPhone}`, [Validators.required, Validators.minLength(12)])
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
        addressDto: {
          ...this.userForm.value.address,
          id: this.userProfile.addressDto.id,
          actual: this.userProfile.addressDto.actual,
          coordinates: this.userProfile.addressDto.coordinates
        },
        recipientEmail: this.userForm.value.recipientEmail,
        recipientName: this.userForm.value.recipientName,
        recipientPhone: this.userForm.value.recipientPhone,
        recipientSurname: this.userForm.value.recipientSurname
      };
      this.clientProfileService.postDataClientProfile(submitData).subscribe(
        (res: UserProfile) => {
          this.isFetching = false;
          this.userProfile = this.composeFormData(res);
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
}
