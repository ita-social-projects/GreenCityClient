import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditProfileModel } from '@user-models/edit-profile.model';

@Injectable()
export class EditProfileFormBuilder {
  private pattern = /^[a-zа-я!\-\,’ ]*$/gim;
  constructor(
    private builder: FormBuilder,
  ) {
  }
  getProfileForm() {
    return this.builder.group({
      name: ['', [Validators.minLength(3), Validators.maxLength(30)]],
      city: ['', [Validators.minLength(3), Validators.maxLength(85)]],
      credo: ['', [Validators.minLength(3), Validators.maxLength(170)]],
      showLocation: [''],
      showEcoPlace: [''],
      showShoppingList: ['']
    });
  }

  getEditProfileForm(editForm: EditProfileModel) {
    return this.builder.group({
      name: [editForm.firstName, [Validators.minLength(3), Validators.maxLength(30)]],
      city: [editForm.city, [Validators.minLength(3), Validators.maxLength(85)]],
      credo: [editForm.userCredo, [Validators.minLength(3), Validators.maxLength(170)]],
      showLocation: [editForm.showLocation],
      showEcoPlace: [editForm.showEcoPlace],
      showShoppingList: [editForm.showShoppingList]
    });
  }
}
