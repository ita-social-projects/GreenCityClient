import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationArrayModel } from '@global-user/models/notification.model';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { Notifications } from '@ubs/ubs-admin/models/ubs-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {
  url: string = environment.backendLink;

  constructor(private http: HttpClient) {}

  getAllNotifications(params: HttpParams): Observable<NotificationArrayModel> {
    return this.http.get<NotificationArrayModel>(`${this.url}notifications`, { params });
  }

  getThreeNewNotification(): Observable<NotificationArrayModel> {
    return this.http.get<NotificationArrayModel>(`${this.url}notifications?page=0&size=3&viewed=false`);
  }

  readNotification(id: number): Observable<void> {
    return this.http.post<void>(`${this.url}notifications/${id}/viewNotification`, {});
  }

  unReadNotification(id: number): Observable<void> {
    return this.http.post<void>(`${this.url}notifications/${id}/unreadNotification`, {});
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}notifications/${id}`);
  }

  getUBSNotification(params: HttpParams): Observable<Notifications> {
    return this.http.get<Notifications>(`https://greencity-ubs.greencity.cx.ua/notifications`, { params });
  }
}
