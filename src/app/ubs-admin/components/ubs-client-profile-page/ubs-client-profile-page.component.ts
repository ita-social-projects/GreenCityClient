import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ubs-client-profile-page',
  templateUrl: './ubs-client-profile-page.component.html',
  styleUrls: ['./ubs-client-profile-page.component.scss']
})
export class UbsClientProfilePageComponent implements OnInit {
  userForm: FormGroup;

  public languages: string[] = ['Українська', 'Російська', 'Англійська'];

  public user: { [key: string]: string } = {
    firstName: 'Іван',
    lastName: 'Нечуй-Левицький',
    id: '0',
    language: this.languages[0],
    email: 'ivan@gmail.com',
    phoneNumber: '+380991234567',
    city: ' Київ',
    street: 'Грушевського',
    houseNumber: '20',
    houseCorpus: '5',
    entranceNumber: '3',
    district: 'Печерський'
  };
  public editing = false;

  ngOnInit() {
    this.userForm = new FormGroup({
      firstName: new FormControl(this.user.firstName, Validators.required),
      lastName: new FormControl(this.user.lastName, Validators.required),
      language: new FormControl(this.languages[0]),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(this.user.phoneNumber, Validators.required),
      city: new FormControl(this.user.city, Validators.required),
      street: new FormControl(this.user.street, Validators.required),
      houseNumber: new FormControl(this.user.houseNumber, Validators.required),
      houseCorpus: new FormControl(this.user.houseCorpus, Validators.required),
      entranceNumber: new FormControl(this.user.entranceNumber, Validators.required),
      district: new FormControl(this.user.district, Validators.required)
    });
  }

  onEdit() {
    this.editing = true;
  }

  onCancel() {
    this.editing = false;
  }

  onSubmit() {
    this.user.firstName = this.userForm.value.firstName;
    this.user.lastName = this.userForm.value.lastName;
    this.user.language = this.userForm.value.language;
    this.user.email = this.userForm.value.email;
    this.user.phoneNumber = this.userForm.value.phoneNumber;
    this.user.city = this.userForm.value.city;
    this.user.street = this.userForm.value.street;
    this.user.houseNumber = this.userForm.value.houseNumber;
    this.user.houseCorpus = this.userForm.value.houseCorpus;
    this.user.entranceNumber = this.userForm.value.entranceNumber;
    this.user.district = this.userForm.value.district;
    this.editing = false;
  }
}
