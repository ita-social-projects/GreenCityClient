import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EditProfileModel, UserLocationDto } from '@global-user/models/edit-profile.model';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Injectable()
export class EditProfileFormBuilder {
  constructor(private builder: FormBuilder, private langService: LanguageService) {}
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

  getFormatedCity(editForm: UserLocationDto): string {
    const city = this.langService.getLangValue(editForm.cityUa, editForm.cityEn) as string;
    const country = this.langService.getLangValue(editForm.countryUa, editForm.countryEn) as string;
    return editForm.cityUa && editForm.cityEn ? `${city}, ${country}` : '';
  }

  getEditProfileForm(editForm: EditProfileModel) {
    return this.builder.group({
      name: [editForm.name, [Validators.maxLength(30), Validators.required]],
      city: [this.getFormatedCity(editForm.userLocationDto), Validators.maxLength(85)],
      credo: [editForm.userCredo, Validators.maxLength(170)],
      showLocation: [editForm.showLocation],
      showEcoPlace: [editForm.showEcoPlace],
      showShoppingList: [editForm.showShoppingList],
      socialNetworks: [editForm.socialNetworks]
    });
  }
}
