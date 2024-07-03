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

  getAllNotification(page = 0, size = this.size, filters?): Observable<NotificationArrayModel> {
    const projectsString = filters.projectName.map((el) => 'projectName=' + el);
    const typesString = filters.notificationType.map((el) => 'notificationType=' + el);
    const filtersStringsArr = [...projectsString, ...typesString];
    const filtersString = filtersStringsArr.join('&') + (filtersStringsArr.length ? '&' : '');
    return this.http.get<NotificationArrayModel>(`${this.url}notification/all?${filtersString}page=${page}&size=${size}`);
  }

  getThreeNewNotification(): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(`${this.url}notification/new`);
  }

  readNotification(id: number): Observable<object> {
    return this.http.patch<object>(`${this.url}notification/view/${id}`, {});
  }
  unReadNotification(id: number): Observable<object> {
    return this.http.patch<object>(`${this.url}notification/unread/${id}`, {});
  }

  deleteNotification(id: number): Observable<object> {
    return this.http.delete<object>(`${this.url}notification/${id}`);
  }
}
