import { EcoPlaces } from '@user-models/ecoPlaces.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { CardModel } from '@user-models/card.model';
import { ShoppingList } from '@user-models/shoppinglist.model';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ProfileStatistics } from '@user-models/profile-statistiscs';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { UserFriendsInterface } from '../../../../../interface/user/user-friends.interface';
import { mainLink, mainUserLink } from '../../../../../links';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public userId: number;

  private shoppingList = new Subject<ShoppingList[]>();
  public shoppingList$ = this.shoppingList.asObservable();

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

  public getUserFriends(): Observable<UserFriendsInterface> {
    this.setUserId();
    return this.http.get<UserFriendsInterface>(`${mainUserLink}user/${this.userId}/sixUserFriends/`);
  }
}
