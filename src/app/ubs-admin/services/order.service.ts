import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bags, IUserInfo } from '../models/ubs-admin.interface';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private backend: string = environment.ubsAdmin.backendUbsAdminLink;

  constructor(private http: HttpClient) {}

  public getBags(lang): Observable<Bags> {
    return this.http.get<Bags>(`${this.backend}/order-details?lang=${lang}`);
  }

  public getUserInfo(orderId, lang): Observable<IUserInfo> {
    return this.http.get<IUserInfo>(`${this.backend}/user-info/${orderId}?lang=${lang}`);
  }
}
