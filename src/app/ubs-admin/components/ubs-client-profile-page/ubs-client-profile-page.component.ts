import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { UserProfile } from '../../models/ubs-admin.interface';
import { ClientProfileService } from '../../services/client-profile.service';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { UbsProfileDeletePopUpComponent } from './ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';

@Component({
  selector: 'app-ubs-client-profile-page',
  templateUrl: './ubs-client-profile-page.component.html',
  styleUrls: ['./ubs-client-profile-page.component.scss']
})
export class UbsClientProfilePageComponent implements OnInit {
  userForm: FormGroup;
  public googleIcon = SignInIcons.picGoogle;
  public editing = false;
  public fetching = false;
  public userId: number;
  private readonly emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  public userProfile: UserProfile = {
    addressDto: {
      actual: true,
      city: 'Київ',
      coordinates: {
        latitude: 1,
        longitude: 1
      },
      district: 'Печерський',
      entranceNumber: '3a',
      houseCorpus: '5',
      houseNumber: '20',
      id: 913,
      street: 'Грушевського'
    },
    recipientEmail: 'ivan@gmail.com',
    recipientName: 'Іван',
    recipientPhone: '123456789',
    recipientSurname: 'Нечуй-Левицький'
  };

  constructor(
    public dialog: MatDialog,
    private clientProfileService: ClientProfileService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.getUserData();
    this.userInit();
  }

  getUserId() {
    this.userId = this.localStorageService.getUserId();
  }

  getUserData() {
    this.fetching = true;
    this.getUserId();
    this.clientProfileService.getDataClientProfile(this.userId).subscribe(
      (result: UserProfile) => {
        this.userProfile = result;
        this.fetching = false;
      },
      (error) => {
        console.log('no data!', error);
      }
    );
  }

  userInit() {
    this.userForm = new FormGroup({
      firstname: new FormControl(this.userProfile.recipientName, Validators.required),
      surname: new FormControl(this.userProfile.recipientSurname, Validators.required),
      email: new FormControl(this.userProfile.recipientEmail, [Validators.required, Validators.email, Validators.pattern(this.emailRegex)]),
      phoneNumber: new FormControl(`+380${this.userProfile.recipientPhone}`, [Validators.required, Validators.pattern('[+ 0-9 ]{13}')]),
      city: new FormControl(this.userProfile.addressDto.city, [Validators.required, Validators.maxLength(20)]),
      street: new FormControl(this.userProfile.addressDto.street, [Validators.required, Validators.maxLength(20)]),
      houseNumber: new FormControl(this.userProfile.addressDto.houseNumber, Validators.required),
      houseCorpus: new FormControl(this.userProfile.addressDto.houseCorpus, Validators.required),
      entranceNumber: new FormControl(this.userProfile.addressDto.entranceNumber, Validators.required),
      district: new FormControl(this.userProfile.addressDto.district, [Validators.required, Validators.maxLength(20)])
    });
    this.fetching = false;
  }

  public openDeleteProfileDialog() {
    const dialogRef = this.dialog.open(UbsProfileDeletePopUpComponent, {
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`delete profile Dialog result: ${result}`);
    });
  }

  public openChangePasswordDialog() {
    const dialogRef = this.dialog.open(UbsProfileChangePasswordPopUpComponent, {
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`change pass Dialog result: ${result}`);
    });
  }

  public onEdit() {
    this.editing = true;
    this.fetching = false;
  }

  public onCancel() {
    this.editing = false;
  }

  public onSubmit() {
    if (this.userForm.valid) {
      this.fetching = true;
      this.userProfile.recipientName = this.userForm.value.firstname;
      this.userProfile.recipientSurname = this.userForm.value.surname;
      this.userProfile.recipientEmail = this.userForm.value.email;
      this.userProfile.recipientPhone = this.userForm.value.phoneNumber.slice(4);
      this.userProfile.addressDto.city = this.userForm.value.city;
      this.userProfile.addressDto.street = this.userForm.value.street;
      this.userProfile.addressDto.houseNumber = this.userForm.value.houseNumber;
      this.userProfile.addressDto.houseCorpus = this.userForm.value.houseCorpus;
      this.userProfile.addressDto.entranceNumber = this.userForm.value.entranceNumber;
      this.userProfile.addressDto.district = this.userForm.value.district;
      this.clientProfileService.postDataClientProfile(this.userProfile).subscribe(
        (res) => {
          console.log('res', res);
          this.fetching = false;
        },
        (err) => {
          console.log('err', err);
        }
      );
      this.editing = false;
    } else {
      this.editing = true;
      console.log('form is invalid!');
    }
  }
}
