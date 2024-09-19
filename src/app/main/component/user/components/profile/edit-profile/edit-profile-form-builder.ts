import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditProfileModel, UserLocationDto } from '@global-user/models/edit-profile.model';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Injectable()
export class EditProfileFormBuilder {
  constructor(
    private builder: FormBuilder,
    private langService: LanguageService
  ) {}
  getProfileForm() {
    return this.builder.group({
      name: ['', Validators.maxLength(30)],
      city: ['', Validators.maxLength(85)],
      credo: ['', Validators.maxLength(170)],
      showLocation: [false],
      showEcoPlace: [false],
      showShoppingList: [false],
      socialNetworks: [''],
      emailPreferences: this.getEmailPreferencesFormGroup(null)
    });
  }

  private getEmailPreferencesFormGroup(preferences: string[] | null) {
    return this.builder.group({
      likes: [this.isPreferenceEnabled(preferences, 'LIKES')],
      comments: [this.isPreferenceEnabled(preferences, 'COMMENTS')],
      invites: [this.isPreferenceEnabled(preferences, 'INVITES')]
    });
  }

  getFormatedCity(editForm: UserLocationDto): string {
    if (editForm) {
      const city = this.langService.getLangValue(editForm?.cityUa, editForm?.cityEn);
      const country = this.langService.getLangValue(editForm?.countryUa, editForm?.countryEn);
      return editForm.cityUa && editForm.cityEn ? `${city}, ${country}` : '';
    }
    return '';
  }

  getSelectedEmailPreferences(form: FormGroup): string[] {
    const preferences = ['likes', 'comments', 'invites']
      .filter((key) => form.get(`emailPreferences.${key}`)?.value)
      .map((preference) => preference.toUpperCase());
    return ['SYSTEM', ...preferences];
  }

  getEditProfileForm(editForm: EditProfileModel) {
    return this.builder.group({
      name: [editForm.name, [Validators.maxLength(30), Validators.required]],
      city: [this.getFormatedCity(editForm.userLocationDto), Validators.maxLength(85)],
      credo: [editForm.userCredo, Validators.maxLength(170)],
      showLocation: [editForm.showLocation],
      showEcoPlace: [editForm.showEcoPlace],
      showShoppingList: [editForm.showShoppingList],
      socialNetworks: [editForm.socialNetworks],
      emailPreferences: this.getEmailPreferencesFormGroup(editForm.emailPreferences)
    });
  }
  private isPreferenceEnabled(preferences: string[] | null, type: string): boolean {
    return preferences ? preferences.includes(type) : false;
  }
}
