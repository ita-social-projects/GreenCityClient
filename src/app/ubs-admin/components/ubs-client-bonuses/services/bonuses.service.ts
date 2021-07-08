import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { BonusesModel } from '../models/BonusesModel';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BonusesService {
  private url: string = environment.backendUbsLink;

  constructor(private http: HttpClient) {}

  public getUserBonuses(): Observable<BonusesModel> {
    return this.http.get<BonusesModel[]>(`${this.url}client/users-pointsToUse`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
