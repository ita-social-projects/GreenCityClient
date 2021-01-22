import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss']
})
export class PersonalDataFormComponent implements OnInit {
  data = {
    id: null,
    firstName: 'Volodymyr',
    lastName: 'Lukashevych',
    phoneNumber: '+38(050) 073 32 27',
    email: 'endmail@gmail.com',
    city: 'lviv',
    street: 'zolota',
    district: 'pecherskiy',
    houseNumber: '3F',
    houseCorpus: '3',
    entranceNumber: '7',
    addressComment: 'Some comment for adress'
  };

  personalDataForm: FormGroup;

  phoneMask = '+{38}(000) 000 00 00';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.personalDataForm = this.fb.group({
      firstName: [this.data.firstName, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё\.\'\-\\]+$/)
      ]],
      lastName: [this.data.lastName, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё\.\'\-\\]+$/)
      ]],
      email: [this.data.email, [
        Validators.required,
        Validators.email
      ]],
      phoneNumber: [this.data.phoneNumber || '+38 0', [
        Validators.required,
        Validators.minLength(18)
      ]],
      city: [this.data.city, Validators.required],
      district: [this.data.district, Validators.required],
      street: [this.data.street, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9\'\,\-\ \\]+$/)
      ]],
      houseNumber: [this.data.houseNumber, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9]+$/)
      ]],
      houseCorpus: [this.data.houseCorpus, [
        Validators.maxLength(2),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9]+$/)
      ]],
      entranceNumber: [this.data.entranceNumber, [
        Validators.maxLength(2),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      addressComment: [this.data.addressComment, Validators.maxLength(170)]
    });
  }

  submit(): void {
    console.log({...this.personalDataForm.value, id: this.data.id});
  }

}
