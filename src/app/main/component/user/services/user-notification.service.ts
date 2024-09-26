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
    return this.http.get<NotificationArrayModel>(`${this.url}notifications?${filtersString}page=${page}&size=${size}&viewed=${viewed}`);
  }

  getThreeNewNotification(): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(`${this.url}notifications?page=0&size=3&viewed=false`);
  }

  readNotification(id: number): Observable<object> {
    return this.http.post<object>(`${this.url}notifications/${id}/viewNotification`, {});
  }

  unReadNotification(id: number): Observable<object> {
    return this.http.post<object>(`${this.url}notifications/${id}/unreadNotification`, {});
  }

  deleteNotification(id: number): Observable<object> {
    return this.http.delete<object>(`${this.url}notifications/${id}`);
  }
}
