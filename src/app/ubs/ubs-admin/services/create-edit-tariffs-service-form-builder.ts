import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';

@Injectable({
  providedIn: 'root'
})
export class CreateEditTariffsServicesFormBuilder {
  namePattern = Patterns.NamePattern;

  constructor(private fb: FormBuilder) {}

  createTariffService() {
    return this.fb.group({
      name: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      nameEng: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      capacity: new FormControl('', [Validators.required, Validators.pattern(Patterns.ubsServicePrice)]),
      price: new FormControl('', [Validators.required, Validators.pattern(Patterns.ubsServicePrice)]),
      commission: new FormControl('', [Validators.required, Validators.pattern(Patterns.ubsServicePrice)]),
      description: new FormControl('', [Validators.required]),
      descriptionEng: new FormControl('', [Validators.required])
    });
  }
}
