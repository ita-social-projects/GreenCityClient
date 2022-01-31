import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { BonusesModel } from '../models/BonusesModel';
import { Observable } from 'rxjs';
import { IBonus } from '../models/IBonus.interface';

@Injectable({
  providedIn: 'root'
})
export class BonusesService {
  private url: string = environment.backendUbsLink;

  constructor(private http: HttpClient) {}

  public getUserBonusesWithPaymentHistory(): Observable<BonusesModel> {
    return this.http.get<BonusesModel>(`${this.url}/ubs/client/users-pointsToUse`);
  }

  public getUserBonuses(): Observable<IBonus> {
    return this.http.get<IBonus>(`${this.url}/ubs/client/user-bonuses`);
  }
}
