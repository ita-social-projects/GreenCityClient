import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Component, NgZone, OnInit, OnDestroy, DoCheck, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileFormBuilder } from '@global-user/components/profile/edit-profile/edit-profile-form-builder';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { EditProfileDto } from '@global-user/models/edit-profile.model';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent extends FormBaseComponent implements OnInit, OnDestroy, DoCheck {
  public editProfileForm = null;
  options: any;
  cityName: string;
  private langChangeSub: Subscription;
  public userInfo = {
    id: 0,
    avatarUrl: './assets/img/profileAvatarBig.png',
    name: {
      first: 'Brandier',
      last: 'Webb'
    },
    location: 'Lviv',
    status: 'online',
    rate: 658,
    userCredo: 'My Credo is to make small steps that leads to huge impact. Let’s change the world together.'
  };
  public previousPath = '/profile';
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
  public socialNetworks: Array<{ id: number; url: string }>;
  public socialNetworksToServer: string[] = [];
  public checkLocation = false;
  public checkEcoPlaces = false;
  public checkShoppingList = false;
  public namePattern = Patterns.NamePattern;
  public cityPattern = Patterns.profileCityPattern;
  public builder: EditProfileFormBuilder;
  private editProfileService: EditProfileService;
  private profileService: ProfileService;
  private snackBar: MatSnackBarComponent;
  private localStorageService: LocalStorageService;
  private translate: TranslateService;
  private ngZone: NgZone;

  constructor(private injector: Injector, public dialog: MatDialog, public router: Router) {
    super(router, dialog);
    this.builder = injector.get(EditProfileFormBuilder);
    this.editProfileService = injector.get(EditProfileService);
    this.profileService = injector.get(ProfileService);
    this.snackBar = injector.get(MatSnackBarComponent);
    this.localStorageService = injector.get(LocalStorageService);
    this.translate = injector.get(TranslateService);
    this.ngZone = injector.get(NgZone);
  }

  ngOnInit() {
    this.setupInitialValue();
    this.getInitialValue();
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.options = {
      types: ['(cities)'],
      componentRestrictions: { country: 'UA' }
    };
  }

  ngDoCheck() {
    this.checkLocation = this.editProfileForm.value.showLocation;
    this.checkEcoPlaces = this.editProfileForm.value.showEcoPlace;
    this.checkShoppingList = this.editProfileForm.value.showShoppingList;
  }

  public getFormValues(): any {
    return {
      firstName: this.editProfileForm.value.name,
      city: this.editProfileForm.value.city,
      userCredo: this.editProfileForm.value.credo,
      showLocation: this.editProfileForm.value.showLocation,
      showEcoPlace: this.editProfileForm.value.showEcoPlace,
      showShoppingList: this.editProfileForm.value.showShoppingList,
      socialNetworks: this.editProfileForm.value.socialNetworks
    };
  }

  public getFormInitialValues(data): void {
    this.initialValues = {
      firstName: data.firstName,
      get city() {
        return data.city === null ? '' : data.city;
      },
      get userCredo() {
        return data.userCredo === null ? '' : data.userCredo;
      },
      showLocation: data.showLocation,
      showEcoPlace: data.showEcoPlace,
      showShoppingList: data.showShoppingList,
      socialNetworks: data.socialNetworks
    };
  }

  public onCityChange(event) {
    this.cityName = event.formatted_address.split(',')[0];
  }

  public emitSocialLinks(val: string[]) {
    this.socialNetworksToServer = val;
  }

  private setupInitialValue() {
    this.editProfileForm = this.builder.getProfileForm();
  }

  public getInitialValue(): void {
    this.profileService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          this.setupExistingData(data);
          this.socialNetworks = data.socialNetworks;
          this.socialNetworksToServer = data.socialNetworks.map((sn) => sn.url);
          this.getFormInitialValues(data);
        }
      });
  }

  private setupExistingData(data) {
    this.editProfileForm = this.builder.getEditProfileForm(data);
  }

  public onSubmit(): void {
    this.areChangesSaved = true;
    this.sendFormData(this.editProfileForm);
  }

  public sendFormData(form): void {
    const body: EditProfileDto = {
      city: form.value.city,
      name: form.value.name,
      userCredo: form.value.credo,
      showLocation: form.value.showLocation,
      showEcoPlace: form.value.showEcoPlace,
      showShoppingList: form.value.showShoppingList,
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
  }

  private subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe((lang) => this.bindLang(lang));
  }

  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
  }
}
