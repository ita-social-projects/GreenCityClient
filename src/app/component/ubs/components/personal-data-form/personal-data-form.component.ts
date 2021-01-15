import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.scss']
})
export class PersonalDataFormComponent implements OnInit {
  personalDataForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.personalDataForm = this.fb.group({});
  }

}
