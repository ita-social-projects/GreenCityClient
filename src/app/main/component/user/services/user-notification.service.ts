import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationArrayModel } from '@global-user/models/notification.model';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {
  private size = 10;
  url: string = environment.backendLink;

  constructor(private http: HttpClient) {}

  getAllNotifications(page: number = 0, size: number = this.size, filters?: any, viewed = false): Observable<NotificationArrayModel> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString()).set('viewed', viewed.toString());

    if (filters && filters.projectName) {
      filters.projectName.forEach((project: string) => {
        params = params.append('project-name', project);
      });
    }

    if (filters && filters.notificationType) {
      filters.notificationType.forEach((type: string) => {
        params = params.append('notification-types', type);
      });
    }

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
}
