import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditProfileModel } from '@user-models/edit-profile.model';

@Injectable()
export class EditProfileFormBuilder {
  private pattern = /^[a-zа-я][a-zа-я(!\-,’)]*$/gi;

  constructor( private builder: FormBuilder ) {
  }
  getProfileForm() {
    return this.builder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(85), Validators.pattern(this.pattern)]],
      credo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(170)]],
      showLocation: [''],
      showEcoPlace: [''],
      showShoppingList: ['']
    });
  }

  getEditProfileForm(editForm: EditProfileModel) {
    return this.builder.group({
      name: [editForm.firstName, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      city: [editForm.city, [Validators.required, Validators.minLength(3), Validators.maxLength(85), Validators.pattern(this.pattern)]],
      credo: [editForm.userCredo, [Validators.required, Validators.minLength(3), Validators.maxLength(170)]],
      showLocation: [editForm.showLocation],
      showEcoPlace: [editForm.showEcoPlace],
      showShoppingList: [editForm.showShoppingList]
    });
  }
}
