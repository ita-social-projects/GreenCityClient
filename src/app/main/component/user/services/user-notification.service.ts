import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationArrayModel, NotificationModel } from '@global-user/models/notification.model';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {
  private size = 10;
  public url: string = environment.backendLink;

  constructor(private http: HttpClient) {}

  public getAllNotification(page = 0, size = this.size): Observable<NotificationArrayModel> {
    return this.http.get<NotificationArrayModel>(`${this.url}notification/all?page=${page}&size=${size}`);
  }

  public getThreeNewNotification(): Observable<NotificationModel> {
    return this.http.get<NotificationModel>(`${this.url}notification/new`);
  }

  public readNotification(notificationId): Observable<object> {
    return this.http.patch<object>(`${this.url}notification/view/${notificationId}`, {});
  }
}
