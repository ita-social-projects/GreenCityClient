import { EcoPlaces } from '@user-models/ecoPlaces.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardModel } from '@user-models/card.model';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ProfileStatistics } from '@user-models/profile-statistiscs';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { mainLink, mainUserLink } from '../../../../../links';
import { Patterns } from 'src/assets/patterns/patterns';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public userId: number;
  public icons = {
    edit: './assets/img/profile/icons/edit.svg',
    add: './assets/img/profile/icons/add.svg',
    delete: './assets/img/profile/icons/delete.svg',
    defaultIcon: './assets/img/profile/icons/default_social.svg'
  };

  public socialMedia = {
    facebook: './assets/img/icon/facebook-icon.svg',
    linkedin: './assets/img/icon/linkedin-icon.svg',
    instagram: './assets/img/icon/instagram-icon.svg',
    twitter: './assets/img/icon/twitter-icon.svg',
    x: './assets/img/icon/twitter-icon.svg',
    youtube: './assets/img/icon/youtube-icon.svg'
  };

  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private languageService: LanguageService) {}

  public setUserId(): void {
    this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.userId = userId));
  }

  public getFactsOfTheDay(): Observable<CardModel> {
    const currentLang = this.languageService.getCurrentLanguage();
    return this.http.get<CardModel>(`${mainLink}factoftheday/?lang=${currentLang}`);
  }

  public getUserInfo(): Observable<EditProfileModel> {
    this.setUserId();
    return this.http.get<EditProfileModel>(`${mainUserLink}user/${this.userId}/profile/`);
  }

  public getUserProfileStatistics(): Observable<ProfileStatistics> {
    this.setUserId();
    return this.http.get<ProfileStatistics>(`${mainUserLink}user/${this.userId}/profileStatistics/`);
  }

  public getEcoPlaces(): Observable<EcoPlaces[]> {
    return this.http.get<EcoPlaces[]>(`${mainLink}favorite_place/`);
  }

  public getSocialImage(socialNetwork: string): string {
    const domain = this.getDomainFromUrl(socialNetwork);

    if (!domain) {
      return this.icons.defaultIcon;
    }

    return this.socialMedia[domain] || this.icons.defaultIcon;
  }

  private getDomainFromUrl(url: string): string | null {
    const regex = Patterns.socialMediaPattern;
    const match = regex.exec(url);

    return match?.[1] || null;
  }
}
