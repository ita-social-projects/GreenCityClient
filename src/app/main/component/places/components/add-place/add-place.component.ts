import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {
  public addPlaceForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.addPlaceForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      adress: ['', Validators.required],
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
