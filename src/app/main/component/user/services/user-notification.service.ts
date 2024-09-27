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
  url: string = environment.backendLink;

  constructor(private http: HttpClient) {}

  getAllNotifications(page = 0, size = this.size, filters?, viewed = false): Observable<NotificationArrayModel> {
    const projectsString = filters.projectName.map((el) => 'project-name=' + el);
    const typesString = filters.notificationType.map((el) => 'notification-types=' + el);
    const filtersStringsArr = [...projectsString, ...typesString];
    const filtersString = filtersStringsArr.join('&') + (filtersStringsArr.length ? '&' : '');
    return this.http.get<NotificationArrayModel>(`${this.url}notification/all?${filtersString}page=${page}&size=${size}&viewed=${viewed}`);
  }

  getThreeNewNotification(): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(`${this.url}notification/new`);
  }

  readNotification(id: number): Observable<NotificationModel[]> {
    return this.http.patch<NotificationModel[]>(`${this.url}notification/view/${id}`, {});
  }

  unReadNotification(id: number): Observable<NotificationModel[]> {
    return this.http.patch<NotificationModel[]>(`${this.url}notification/unread/${id}`, {});
  }

  deleteNotification(id: number): Observable<NotificationModel> {
    return this.http.delete<NotificationModel>(`${this.url}notification/${id}`);
  }
}
