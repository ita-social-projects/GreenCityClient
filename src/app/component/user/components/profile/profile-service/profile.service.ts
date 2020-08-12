import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CardModel } from '@user-models/card.model';
import { ShoppingList } from '@user-models/shoppinglist.model';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { retry, catchError } from 'rxjs/operators';

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
    return this.http.get<ShoppingList[]>(`${this.backEnd}user/${this.userId}/goals?language=en`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
