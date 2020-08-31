import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditProfileModel } from '@user-models/edit-profile.model';

@Injectable()
export class EditProfileFormBuilder {

  constructor(
    private builder: FormBuilder,
  ) {
  }
  getProfileForm() {
    return this.builder.group({
      name: ['', [Validators.required, Validators.min(3), Validators.maxLength(30)]],
      city: ['', [Validators.required, Validators.minLength(3)]],
      title: ['', [Validators.required, Validators.min(3), Validators.maxLength(170)]],
      showLocation: [''],
      showEcoPlace: [''],
      showShoppingList: ['']
    });
  }

  getEditProfileForm(editForm: EditProfileModel) {
    return this.builder.group({
      name: [editForm.firstName, [Validators.required, Validators.min(3), Validators.maxLength(30)]],
      city: [editForm.city, [Validators.required, Validators.minLength(3)]],
      title: [editForm.userCredo, [Validators.required, Validators.min(3), Validators.maxLength(170)]],
      showLocation: [editForm.showLocation],
      showEcoPlace: [editForm.showEcoPlace],
      showShoppingList: [editForm.showShoppingList]
    });
  }
}
