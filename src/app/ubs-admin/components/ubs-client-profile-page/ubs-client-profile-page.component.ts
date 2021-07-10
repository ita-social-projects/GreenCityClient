import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { SignInIcons } from 'src/app/main/image-pathes/sign-in-icons';
import { UserProfile } from '../../models/ubs-admin.interface';

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
  private readonly regexp = /^([a-zA-ZА-Яа-яЄЇҐа-їєґ '-])+$/iu;
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
    recipientSurname: 'Левицький'
  };

  constructor(public dialog: MatDialog, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.userInit();
  }

  getUserId() {
    this.userId = this.localStorageService.getUserId();
  }

  userInit() {
    this.userForm = new FormGroup({
      firstname: new FormControl(this.userProfile.recipientName, [Validators.required, Validators.pattern(this.regexp)]),
      surname: new FormControl(this.userProfile.recipientSurname, [Validators.required, Validators.pattern(this.regexp)]),
      email: new FormControl(this.userProfile.recipientEmail, [Validators.required, Validators.pattern(this.emailRegex)]),
      phoneNumber: new FormControl(`+380${this.userProfile.recipientPhone}`, [Validators.required, Validators.pattern('[+ 0-9 ]{13}')]),
      city: new FormControl(this.userProfile.addressDto.city, [
        Validators.required,
        Validators.pattern(this.regexp),
        Validators.maxLength(20)
      ]),
      street: new FormControl(this.userProfile.addressDto.street, [
        Validators.required,
        Validators.pattern(this.regexp),
        Validators.maxLength(20)
      ]),
      houseNumber: new FormControl(this.userProfile.addressDto.houseNumber, Validators.required),
      houseCorpus: new FormControl(this.userProfile.addressDto.houseCorpus, Validators.required),
      entranceNumber: new FormControl(this.userProfile.addressDto.entranceNumber, Validators.required),
      district: new FormControl(this.userProfile.addressDto.district, [
        Validators.required,
        Validators.pattern(this.regexp),
        Validators.maxLength(20)
      ])
    });
    this.fetching = false;
  }

  public onEdit() {
    this.editing = true;
    this.fetching = false;
  }

  public onCancel() {
    this.userInit();
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
      this.editing = false;
      this.fetching = false;
    } else {
      this.editing = true;
    }
  }
}
