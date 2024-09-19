import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { PlaceService } from '@global-service/place/place.service';
import { EditProfileFormBuilder } from '@global-user/components/profile/edit-profile/edit-profile-form-builder';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Coordinates, EditProfileDto, EditProfileModel, UserLocationDto } from '@global-user/models/edit-profile.model';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent extends FormBaseComponent implements OnInit, OnDestroy {
  editProfileForm: FormGroup;
  private langChangeSub: Subscription;
  private currentLocation: UserLocationDto;
  coordinates: Coordinates = { latitude: null, longitude: null };
  previousPath = '/profile';
  socialNetworks: Array<{ id: number; url: string }>;
  socialNetworksToServer: string[] = [];
  namePattern: RegExp = Patterns.NamePattern;
  builder: EditProfileFormBuilder;
  placeService: PlaceService;
  private editProfileService: EditProfileService;
  private profileService: ProfileService;
  private snackBar: MatSnackBarComponent;
  private localStorageService: LocalStorageService;
  private translate: TranslateService;
  cityOptions: google.maps.places.AutocompletionRequest = {
    input: '',
    types: ['(cities)']
  };
  userInfo = {
    id: 0,
    avatarUrl: './assets/img/profileAvatarBig.png',
    status: 'online',
    rate: 658
  };
  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: 'user.edit-profile.profile-popup.title',
      popupSubtitle: 'user.edit-profile.profile-popup.subtitle',
      popupConfirm: 'user.edit-profile.profile-popup.confirm',
      popupCancel: 'user.edit-profile.profile-popup.cancel'
    }
  };

  get name() {
    return this.editProfileForm.get('name');
  }

  get city(): FormControl {
    return this.editProfileForm.get('city') as FormControl;
  }

  get credo() {
    return this.editProfileForm.get('credo');
  }

  constructor(
    private injector: Injector,
    public dialog: MatDialog,
    public router: Router
  ) {
    super(router, dialog);
    this.builder = injector.get(EditProfileFormBuilder);
    this.editProfileService = injector.get(EditProfileService);
    this.profileService = injector.get(ProfileService);
    this.snackBar = injector.get(MatSnackBarComponent);
    this.localStorageService = injector.get(LocalStorageService);
    this.translate = injector.get(TranslateService);
  }

  ngOnInit() {
    this.initForm();
    this.getInitialValue();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  getFormValues(): any {
    return {
      firstName: this.editProfileForm.value.name,
      latitude: this.coordinates.latitude,
      longitude: this.coordinates.longitude,
      userCredo: this.editProfileForm.value.credo === null ? '' : this.editProfileForm.value.credo,
      showLocation: this.editProfileForm.value.showLocation,
      showEcoPlace: this.editProfileForm.value.showEcoPlace,
      showShoppingList: this.editProfileForm.value.showShoppingList,
      socialNetworks: this.socialNetworksToServer
    };
  }

  onCitySelected(coordinates: Coordinates): void {
    this.coordinates = coordinates;
  }

  getFormInitialValues(data: EditProfileModel): void {
    this.initialValues = {
      firstName: data.name,
      get latitude() {
        return data.userLocationDto?.latitude || null;
      },
      get longitude() {
        return data.userLocationDto?.longitude || null;
      },
      get userCredo() {
        return data.userCredo ? data.userCredo : '';
      },
      showLocation: data.showLocation,
      showEcoPlace: data.showEcoPlace,
      showShoppingList: data.showShoppingList,
      socialNetworks: data.socialNetworks.map((network) => network.url)
    };
    this.editProfileForm.markAllAsTouched();
  }

  emitSocialLinks(val: string[]): void {
    this.socialNetworksToServer = val;
  }

  private initForm(): void {
    this.editProfileForm = this.builder.getProfileForm();
  }

  getInitialValue(): void {
    this.profileService
      .getUserInfo()
      .pipe(take(1), filter(Boolean))
      .subscribe((data: EditProfileModel) => {
        this.editProfileForm = this.builder.getEditProfileForm(data);
        this.currentLocation = data.userLocationDto;
        this.socialNetworks = data.socialNetworks;
        this.socialNetworksToServer = data.socialNetworks.map((sn) => sn.url);
        this.coordinates.latitude = data.userLocationDto?.latitude || null;
        this.coordinates.longitude = data.userLocationDto?.longitude || null;
        this.getFormInitialValues(data);
      });
  }

  onSubmit(): void {
    this.areChangesSaved = true;
    this.sendFormData(this.editProfileForm);
  }

  sendFormData(form: FormGroup): void {
    const body: EditProfileDto = {
      coordinates: { longitude: this.coordinates.longitude, latitude: this.coordinates.latitude },
      name: form.value.name,
      userCredo: form.value.credo,
      showLocation: !!form.value.showLocation,
      showEcoPlace: !!form.value.showEcoPlace,
      showShoppingList: !!form.value.showShoppingList,
      socialNetworks: this.socialNetworksToServer,
      emailPreferences: this.builder.getSelectedEmailPreferences(form)
    };

    this.editProfileService.postDataUserProfile(JSON.stringify(body)).subscribe({
      next: (): void => {
        this.router.navigate(['profile', this.profileService.userId]);
        this.snackBar.openSnackBar('changesSaved');
        this.localStorageService.setFirstName(form.value.name);
      },
      error: (): void => {
        this.snackBar.openSnackBar('errorUpdateProfile');
      }
    });
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
    if (this.city.pristine) {
      this.city.setValue(this.builder.getFormatedCity(this.currentLocation));
    }
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe((lang) => this.bindLang(lang));
  }

  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
  }
}
