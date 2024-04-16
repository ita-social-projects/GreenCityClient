import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileFormBuilder } from '@global-user/components/profile/edit-profile/edit-profile-form-builder';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Coordinates, EditProfileDto, EditProfileModel, UserLocationDto } from '@global-user/models/edit-profile.model';
import { filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { Patterns } from 'src/assets/patterns/patterns';
import { FormControl, FormGroup } from '@angular/forms';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { PlaceService } from '@global-service/place/place.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent extends FormBaseComponent implements OnInit, OnDestroy {
  public editProfileForm: FormGroup;
  private langChangeSub: Subscription;
  private currentLocation: UserLocationDto;
  public coordinates: Coordinates = { latitude: null, longitude: null };
  public previousPath = '/profile';
  public socialNetworks: Array<{ id: number; url: string }>;
  public socialNetworksToServer: string[] = [];
  public namePattern = Patterns.NamePattern;
  public builder: EditProfileFormBuilder;
  public placeService: PlaceService;
  private editProfileService: EditProfileService;
  private profileService: ProfileService;
  private snackBar: MatSnackBarComponent;
  private localStorageService: LocalStorageService;
  private translate: TranslateService;
  public cityOptions = {
    types: ['(cities)']
  };
  public userInfo = {
    id: 0,
    avatarUrl: './assets/img/profileAvatarBig.png',
    status: 'online',
    rate: 658
  };
  public popupConfig = {
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
    public router: Router,
    private langService: LanguageService
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

  public getFormValues(): any {
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

  public getFormInitialValues(data: EditProfileModel): void {
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
      socialNetworks: data.socialNetworks.map((network) => {
        return network.url;
      })
    };
    this.editProfileForm.markAllAsTouched();
  }

  public emitSocialLinks(val: string[]) {
    this.socialNetworksToServer = val;
  }

  private initForm() {
    this.editProfileForm = this.builder.getProfileForm();
  }

  public getLangValue(uaValue, enValue): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public getInitialValue(): void {
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

  public onSubmit(): void {
    this.areChangesSaved = true;
    this.sendFormData(this.editProfileForm);
  }

  public sendFormData(form): void {
    const body: EditProfileDto = {
      coordinates: { longitude: this.coordinates.longitude, latitude: this.coordinates.latitude },
      name: form.value.name,
      userCredo: form.value.credo,
      showLocation: !!form.value.showLocation,
      showEcoPlace: !!form.value.showEcoPlace,
      showShoppingList: !!form.value.showShoppingList,
      socialNetworks: this.socialNetworksToServer
    };

    this.editProfileService.postDataUserProfile(JSON.stringify(body)).subscribe(() => {
      this.router.navigate(['profile', this.profileService.userId]);
      this.snackBar.openSnackBar('changesSaved');
      this.localStorageService.setFirstName(form.value.name);
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
