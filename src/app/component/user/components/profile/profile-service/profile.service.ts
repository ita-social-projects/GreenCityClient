import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardModel } from '@user-models/card.model';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

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

  public getUserInfo(): Observable<object> {
    this.setUserId();
    return this.http.get<object>(`${this.backEnd}user/${this.userId}/profile/`);
  }

  public getUserStatus(): Observable<object> {
    return this.http.get<object>(`${this.backEnd}user/isOnline/${this.userId}/`);
  }

  public getEcoPlaces(): any {
    this.setUserId();
    return this.http.get(`https://greencity.azurewebsites.net/favorite_place/`);
  }

}
