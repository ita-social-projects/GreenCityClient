import { UbsFormService } from '../../services/ubs-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalData } from '../../models/personalData.model';

@Component({
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss']
})
export class PersonalDataFormComponent implements OnInit {
  personalDataForm: FormGroup;
  personalData: PersonalData;
  region = '';
  longitude: number;
  latitude: number;
  phoneMask = '+{38} (000) 000 00 00';
  nextDisabled = true;
  districtDisabled = true;

  constructor(
    private fb: FormBuilder,
    private ubsFormService: UbsFormService
  ) { }

  ngOnInit(): void {
    this.personalDataForm = this.fb.group({
      firstName: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё\.\'\-\\]+$/)
      ]],
      lastName: [null, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё\.\'\-\\]+$/)
      ]],
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      phoneNumber: ['+38 0', [
        Validators.required,
        Validators.minLength(19)
      ]],
      city: ['Київ', Validators.required],
      district: [null, Validators.required],
      streetAndBuilding: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9\'\,\-\ \\]+$/)
      ]],
      houseCorpus: [null, [
        Validators.maxLength(2),
        Validators.pattern(/^[A-Za-zА-Яа-яїієё0-9]+$/)
      ]],
      entranceNumber: [null, [
        Validators.maxLength(2),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      addressComment: [null, Validators.maxLength(170)]
    });

    this.ubsFormService.getPersonalData().subscribe((data: PersonalData[]) => {
      this.personalData = data[data.length - 1];

      this.initForm();

      this.region = this.personalData.district;
      this.personalDataForm.get('district').setValue(this.region);
      this.nextDisabled = this.personalDataForm.get('streetAndBuilding').value.length ? false : true;

      console.log(this.personalData);
    });
  }

  initForm(): void {
    this.personalDataForm.setValue({
      firstName: this.personalData.firstName,
      lastName: this.personalData.lastName,
      email: this.personalData.email,
      phoneNumber: this.personalData.phoneNumber,
      city: this.personalData.city,
      district: this.personalData.district,
      streetAndBuilding: this.personalData.street + ', ' + this.personalData.houseNumber,
      houseCorpus: this.personalData.houseCorpus,
      entranceNumber: this.personalData.entranceNumber,
      addressComment: this.personalData.addressComment,
    });
  }

  onLocationSelected(event): void {
    this.longitude = event.longitude;
    this.latitude = event.latitude;
  }

  onAutocompleteSelected(event): void {
    console.log(event);
    const streetName = event.name.split(' ').filter(char => char !== 'вулиця' && char !== 'вул.').join(' ');
    this.personalDataForm.get('streetAndBuilding').setValue(streetName);
    this.region = event.address_components[2].long_name.split(' ')[1] === 'район'
      ? event.address_components[2].long_name.split(' ')[0] : null;
    this.personalDataForm.get('district').setValue(this.region);
    this.nextDisabled = false;
    this.districtDisabled = event.address_components[2].long_name.split(' ')[1] === 'район' ? true : false;
  }

  onDistrictSelected(event): void {
    console.log(event);
    this.region = event.address_components[0].long_name.split(' ')[0];
    this.personalDataForm.get('district').setValue(this.region);
    this.districtDisabled = true;
    this.nextDisabled = false;
  }

  onChange(): void {
    this.region = null;
    this.personalDataForm.get('district').setValue(this.region);
    this.districtDisabled = false;
    this.nextDisabled = true;
  }

  submit(): void {
    const personalData: PersonalData = {
      firstName: this.personalDataForm.get('firstName').value,
      lastName: this.personalDataForm.get('lastName').value,
      email: this.personalDataForm.get('email').value,
      phoneNumber: this.personalDataForm.get('phoneNumber').value,
      city: this.personalDataForm.get('city').value,
      district: this.personalDataForm.get('district').value,
      street: this.personalDataForm.get('streetAndBuilding').value.split(', ')[0],
      houseNumber: this.personalDataForm.get('streetAndBuilding').value.split(', ')[1],
      houseCorpus: this.personalDataForm.get('houseCorpus').value,
      entranceNumber: this.personalDataForm.get('entranceNumber').value,
      addressComment: this.personalDataForm.get('addressComment').value,
      id: this.personalData.id,
      latitude: this.latitude,
      longitude: this.longitude
    };
    console.log({personalData});
  }

}
