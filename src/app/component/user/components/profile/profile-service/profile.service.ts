import { EcoPlaces } from '@user-models/ecoPlaces.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardModel } from '@user-models/card.model';
import { ShoppingList } from '@user-models/shoppinglist.model';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ProfileStatistics } from '@user-models/profile-statistiscs';

@Injectable({
  providedIn: 'root'
})

export class ProfileService {
  public userId: number;
  private backEnd = environment.backendLink;

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) { }

  public setUserId(): void {
    this.localStorageService
      .userIdBehaviourSubject
      .subscribe(userId => this.userId = userId);
  }

  public getFactsOfTheDay(): Observable<CardModel> {
    return this.http.get<CardModel>(`${this.backEnd}facts/dayFact/2`);
  }

  public getShoppingList(): Observable<ShoppingList[]> {
    this.setUserId();
    return this.http.get<ShoppingList[]>(`${this.backEnd}goals/shoppingList/${this.userId}/language/en`);
  }

  public getUserInfo(): Observable<object> {
    this.setUserId();
    return this.http.get<object>(`${this.backEnd}user/${this.userId}/profile/`);
  }

  public getUserStatus(): Observable<object> {
    return this.http.get<object>(`${this.backEnd}user/isOnline/${this.userId}/`);
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

  toggleDoneShoppingItem(id) {
    const body = { status: 'DONE' };
    return this.http.patch(`${this.backEnd}goals/shoppingList/${this.userId}?goalId=${id}`, body);
  }
}
