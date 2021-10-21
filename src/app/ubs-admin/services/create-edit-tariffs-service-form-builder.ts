import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreateEditTariffsServicesFormBuilder {
  namePattern = /^[А-Яа-яїЇіІєЄёЁ ]+$/;
  enPattern = /^[a-zA-Z ]+$/;

  constructor(private fb: FormBuilder) {}

  createTariffService() {
    return this.fb.group({
      name: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      capacity: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      commission: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      description: new FormControl('', [Validators.required]),
      nameEn: new FormControl('', [Validators.required, Validators.pattern(this.enPattern)]),
      descriptionEn: new FormControl('', [Validators.required, Validators.pattern(this.enPattern)])
    });
  }
}
