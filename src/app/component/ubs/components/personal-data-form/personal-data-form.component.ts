import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss']
})
export class PersonalDataFormComponent implements OnInit {
  personalDataForm: FormGroup;

  phoneMask = '+{38}(000) 000 00 00';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.personalDataForm = this.fb.group({
      personalData: this.fb.group({
        name: [null, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-zА-Яа-яїієё\.\'\-\\]+$/)
        ]],
        surname: [null, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-zА-Яа-яїієё\.\'\-\\]+$/)
        ]],
        email: [null, [
          Validators.required,
          Validators.email
        ]],
        phone: [null, [
          Validators.required,
          Validators.minLength(18)
        ]]
      }),
      adress: this.fb.group({
        city: [null, Validators.required],
        district: [null, Validators.required],
        street: [null, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
          Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9\'\,\-\ \\]+$/)
        ]],
        building: [null, [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4),
          Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9]+$/)
        ]],
        block: [null, [
          Validators.maxLength(2),
          Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9]+$/)
        ]],
        entrance: [null, [
          Validators.maxLength(2),
          Validators.pattern(/^-?(0|[1-9]\d*)?$/)
        ]],
        comment: [null, Validators.maxLength(170)]
      })
    });
  }

  submit(): void {
    console.log(this.personalDataForm.value);
  }

}
