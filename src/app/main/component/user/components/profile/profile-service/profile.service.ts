import { EcoPlaces } from '@user-models/ecoPlaces.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FactOfTheDay as FactOfTheDay } from '@global-user/models/factOfTheDay';
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
  readonly oneDayInMillis: number = 24 * 60 * 60 * 1000;
  userId: number;
  icons = {
    edit: './assets/img/profile/icons/edit.svg',
    add: './assets/img/profile/icons/add.svg',
    delete: './assets/img/profile/icons/delete.svg',
    defaultIcon: './assets/img/profile/icons/default_social.svg'
  };

  socialMedia = {
    facebook: './assets/img/icon/facebook-icon.svg',
    linkedin: './assets/img/icon/linkedin-icon.svg',
    instagram: './assets/img/icon/instagram-icon.svg',
    twitter: './assets/img/icon/twitter-icon.svg',
    x: './assets/img/icon/twitter-icon.svg',
    youtube: './assets/img/icon/youtube-icon.svg'
  };

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private languageService: LanguageService
  ) {}

  setUserId(): void {
    this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.userId = userId));
  }

  getRandomFactOfTheDay(): Observable<FactOfTheDay> {
    const currentLang = this.languageService.getCurrentLanguage();
    return this.http.get<FactOfTheDay>(`${mainLink}fact-of-the-day/random?lang=${currentLang}`);
  }

  getHabitFactFromLocalStorage(): FactOfTheDay | null {
    const savedHabitFact = localStorage.getItem('habitFactOfTheDay');
    const lastHabitFetchTime = localStorage.getItem('lastHabitFactFetchTime');
    const currentTime = Date.now();

    if (savedHabitFact && lastHabitFetchTime && currentTime - Number(lastHabitFetchTime) < this.oneDayInMillis) {
      return JSON.parse(savedHabitFact);
    }
    return null;
  }

  saveHabitFactToLocalStorage(fact: FactOfTheDay, currentTime: number): void {
    localStorage.setItem('habitFactOfTheDay', JSON.stringify(fact));
    localStorage.setItem('lastHabitFetchTime', currentTime.toString());
  }

  clearHabitFactFromLocalStorage(): void {
    localStorage.removeItem('habitFactOfTheDay');
    localStorage.removeItem('lastHabitFetchTime');
  }

  getFactsOfTheDayByTags(): Observable<FactOfTheDay> {
    const currentLang = this.languageService.getCurrentLanguage();
    return this.http.get<FactOfTheDay>(`${mainLink}fact-of-the-day/random/by-tags?lang=${currentLang}`);
  }

  getUserInfo(): Observable<EditProfileModel> {
    this.setUserId();
    return this.http.get<EditProfileModel>(`${mainUserLink}user/${this.userId}/profile/`);
  }

  getUserProfileStatistics(): Observable<ProfileStatistics> {
    this.setUserId();
    return this.http.get<ProfileStatistics>(`${mainUserLink}user/${this.userId}/profileStatistics/`);
  }

  getEcoPlaces(): Observable<EcoPlaces[]> {
    return this.http.get<EcoPlaces[]>(`${mainLink}favorite_place/`);
  }

  getSocialImage(socialNetwork: string): string {
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
