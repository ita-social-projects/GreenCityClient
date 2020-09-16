import { EcoPlaces } from '@user-models/ecoPlaces.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardModel } from '@user-models/card.model';
import { ShoppingList } from '@user-models/shoppinglist.model';
import { environment } from '@environment/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ProfileStatistics } from '@user-models/profile-statistiscs';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { LanguageService } from '@language-service/language.service';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  public userId: number;
  private backEnd = environment.backendLink;

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService,
              private languageService: LanguageService) { }

  public setUserId(): void {
    this.localStorageService
      .userIdBehaviourSubject
      .subscribe(userId => this.userId = userId);
  }

  public getFactsOfTheDay(): Observable<CardModel> {
    return this.http.get<CardModel>(`${this.backEnd}facts/dayFact/2`);
  }

  public getUserInfo(): Observable<EditProfileModel> {
    this.setUserId();
    return this.http.get<EditProfileModel>(`${this.backEnd}user/${this.userId}/profile/`);
  }

  public getShoppingList(): Observable<ShoppingList[]> {
    this.setUserId();
    const currentLang = this.languageService.getCurrentLanguage();

    return this.http.get<ShoppingList[]>(`${this.backEnd}goals/shoppingList/${this.userId}?lang=${currentLang}`);
  }

  public getUserProfileStatistics(): Observable<ProfileStatistics> {
    return this.http.get<ProfileStatistics>(`${this.backEnd}user/${this.userId}/profileStatistics/`);
  }

  public getEcoPlaces(): Observable<EcoPlaces[]> {
    return this.http.get<EcoPlaces[]>(`${this.backEnd}/favorite_place/`);
  }

  public getUserFriends(): Observable<object> {
    return this.http.get<object>(`${this.backEnd}user/${this.userId}/sixUserFriends/`);
  }

  public toggleStatusOfShoppingItem(item): Observable<object[]> {
    const { status: prevStatus, goalId } = item;
    const newStatus = prevStatus !== 'DONE';
    const params = new HttpParams()
      .set('goalId', goalId)
      .set('status', newStatus.toString());

    return this.http.patch<object[]>(`${this.backEnd}goals/shoppingList/${this.userId}`, params);
  }
}
