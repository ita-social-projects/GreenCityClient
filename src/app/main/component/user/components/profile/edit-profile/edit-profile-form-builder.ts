import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditProfileModel } from '@global-user/models/edit-profile.model';

@Injectable()
export class EditProfileFormBuilder {
  constructor(private builder: FormBuilder) {}
  getProfileForm() {
    return this.builder.group({
      name: ['', Validators.maxLength(30)],
      city: ['', Validators.maxLength(85)],
      credo: ['', Validators.maxLength(170)],
      showLocation: [''],
      showEcoPlace: [''],
      showShoppingList: [''],
      socialNetworks: ['']
    });
  }

  getEditProfileForm(editForm: EditProfileModel) {
    return this.builder.group({
      name: [editForm.name, [Validators.maxLength(30), Validators.required]],
      city: [editForm.city, Validators.maxLength(85)],
      credo: [editForm.userCredo, Validators.maxLength(170)],
      showLocation: [editForm.showLocation],
      showEcoPlace: [editForm.showEcoPlace],
      showShoppingList: [editForm.showShoppingList],
      socialNetworks: [editForm.socialNetworks]
    });
  }
}
