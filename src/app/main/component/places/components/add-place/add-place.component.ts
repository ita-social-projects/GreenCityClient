import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {
  public addPlaceForm: FormGroup;
  public workingHours = '';
  public adress = '';
  public type = '';
  public name = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.addPlaceForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/[0-9a-zа-я]/i)]],
      adress: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/[0-9a-zа-я]/i)]],
      workingHours: [
        '',
        [Validators.required, Validators.pattern(/^([0-9]|0[0-9]|1[0-9]|2[0-3])[.][0-5][0-9][-]([0-9]|0[0-9]|1[0-9]|2[0-3])[.][0-5][0-9]$/)]
      ]
    });
  }

  cancel(): void {
    this.initForm();
  }

  addPlace(): void {
    // код для обробки форми і додавання маркера
    this.initForm();
  }
}
