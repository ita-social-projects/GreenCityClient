import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { Notifications } from '../../ubs-admin/models/ubs-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserMessagesService {
  private url = environment.backendUbsLink;
  public countOfNoReadeMessages: any;

  constructor(private http: HttpClient) {}

  getNotification(lang: string, currentPage: number, size: number): Observable<Notifications> {
    return this.http.get<Notifications>(`${this.url}/notifications?lang=${lang}&page=${currentPage}&size=${size}`);
  }

  getCountUnreadNotification(): Observable<Notifications> {
    return this.http.get<Notifications>(`${this.url}/notifications/quantityUnreadenNotifications`);
  }

  setReadNotification(id: number, lang: string): Observable<any> {
    return this.http.post(`${this.url}/notifications/${id}?lang=${lang}`, {});
  }
}
