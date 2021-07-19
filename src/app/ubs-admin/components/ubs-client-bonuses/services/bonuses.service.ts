import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { BonusesModel } from '../models/BonusesModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BonusesService {
  private url: string = environment.backendUbsLink;

  constructor(private http: HttpClient) {}

  getUserBonuses(): Observable<BonusesModel> {
    return this.http.get<BonusesModel>(`${this.url}/ubs/client/users-pointsToUse`);
  }
}
