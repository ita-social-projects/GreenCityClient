import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { Component, NgZone, OnInit, OnDestroy, DoCheck, Injector, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileFormBuilder } from '@global-user/components/profile/edit-profile/edit-profile-form-builder';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Coordinates, EditProfileDto, EditProfileModel } from '@global-user/models/edit-profile.model';
import { MapsAPILoader } from '@agm/core';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FormBaseComponent } from '@shared/components/form-base/form-base.component';
import { Patterns } from 'src/assets/patterns/patterns';
import { FormGroup } from '@angular/forms';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent extends FormBaseComponent implements OnInit, OnDestroy, DoCheck {
  public editProfileForm: FormGroup;
  @ViewChild('placesRef') placesRef: ElementRef;
  private langChangeSub: Subscription;
  private coordinates: Coordinates = { latitude: null, longitude: null };
  private cityOptions = {
    types: ['(cities)'],
    componentRestrictions: { country: 'UA' },
    language: this.getLangValue('ua', 'en')
  };
  // private country = this.getLangValue('Україна', 'Ukraine');
  public userInfo = {
    id: 0,
    avatarUrl: './assets/img/profileAvatarBig.png',
    status: 'online',
    rate: 658
  };
  public autocomplete;
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

  constructor(
    private injector: Injector,
    public dialog: MatDialog,
    public router: Router,
    private langService: LanguageService,
    private mapsAPILoader: MapsAPILoader
  ) {
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
    this.setPlaceAutocomplete();
  }

  ngDoCheck() {
    this.checkLocation = this.editProfileForm.value.showLocation;
    this.checkEcoPlaces = this.editProfileForm.value.showEcoPlace;
    this.checkShoppingList = this.editProfileForm.value.showShoppingList;
  }

  getControl(control: string) {
    return this.editProfileForm.get(control);
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

  public setPlaceAutocomplete(): void {
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(this.placesRef.nativeElement, this.cityOptions);
      this.autocomplete.addListener('place_changed', () => {
        const locationName = this.autocomplete.getPlace();
        if (locationName.formatted_address) {
          this.coordinates.latitude = locationName.geometry.location.lat();
          this.coordinates.longitude = locationName.geometry.location.lng();
          this.getControl('city').setValue(this.getCityCountryFormat(locationName.formatted_address));
        }
      });
    });
  }

  private getCityCountryFormat(address: string): string {
    // return `${address.split(', ')[0]}, ${this.country}`;
    const postIndexLength = 7;
    if (address.split(', ').length === 3) {
      return address.slice(0, -postIndexLength);
    }
    return `${address.split(', ')[0]}, ${address.split(', ')[2] || ''}`;
  }

  onCityChange() {
    this.getControl('city').setValue('');
  }

  public getFormInitialValues(data: EditProfileModel): void {
    this.initialValues = {
      firstName: data.name,
      get latitude() {
        return data.userLocationDto.latitude;
      },
      get longitude() {
        return data.userLocationDto.latitude;
      },
      get userCredo() {
        return data.userCredo === null ? '' : data.userCredo;
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

  private setupInitialValue() {
    this.editProfileForm = this.builder.getProfileForm();
  }

  public getLangValue(uaValue, enValue): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  public getInitialValue(): void {
    this.profileService
      .getUserInfo()
      .pipe(take(1))
      .subscribe((data: EditProfileModel) => {
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
      coordinates: { longitude: this.coordinates.longitude, latitude: this.coordinates.latitude },
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
