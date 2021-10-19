import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CreateEditNewsFormBuilder {
  constructor(private fb: FormBuilder) {}

  getSetupForm() {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(170), this.noWhitespaceValidator]],
      source: [''],
      content: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(63206)]],
      tags: this.fb.array([]),
      image: ['']
    });
  }

  getEditForm(data) {
    return this.fb.group({
      title: [data.title, [Validators.required, Validators.maxLength(170), this.noWhitespaceValidator]],
      source: [data.source],
      content: [data.text || data.content, [Validators.required, Validators.minLength(20), Validators.maxLength(63206)]],
      tags: this.fb.array(data.tags),
      image: [data.imagePath]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhiteSpace = (control.value || '').trim().length === 0;
    const isValid = !isWhiteSpace;
    return isValid ? null : { whitespace: true };
  }
}
