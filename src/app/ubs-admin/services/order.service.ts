import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bags, IUserInfo } from '../models/ubs-admin.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = 'https://greencity-ubs.azurewebsites.net/ubs';

  constructor(private http: HttpClient) {}

  public getBags(lang): Observable<Bags> {
    return this.http.get<Bags>(`${this.url}/order-details?lang=${lang}`);
  }

  public getUserInfo(orderId, lang): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${this.url}/user-info/${orderId}?lang=${lang}`);
  }
}
