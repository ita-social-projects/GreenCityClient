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

  public getAllNotification(page = 0, size = this.size, filters?): Observable<NotificationArrayModel> {
    const projectsString = [...filters.projectName.map((el) => 'projectName=' + el.name)];
    const typesString = [
      ...filters.notificationType.map((el) =>
        el.filterArr ? [...el.filterArr.map((el) => 'notificationType=' + el)].join('&') : 'notificationType=' + el.name
      )
    ];
    const filtersString = [...projectsString, ...typesString].join('&');
    return this.http.get<NotificationArrayModel>(
      `${this.url}notification/all?page=${page}&size=${size}${filtersString.length ? '?' : ''}${filtersString}`
    );
  }

  public getThreeNewNotification(): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(`${this.url}notification/new`);
  }

  public readNotification(id: number): Observable<object> {
    return this.http.patch<object>(`${this.url}notification/view/${id}`, {});
  }

  public deleteNotification(id: number): Observable<object> {
    return this.http.delete<object>(`${this.url}notification/${id}`);
  }
}
