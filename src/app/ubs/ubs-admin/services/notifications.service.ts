import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ubsAdminNotificationLink } from 'src/app/main/links';
import { catchError } from 'rxjs/operators';
import { NotificationTemplate, NotificationTemplatesPage } from '../models/notifications.model';

export const notificationStatuses = ['ACTIVE', 'INACTIVE'];

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  getAllNotificationTemplates(page: number = 0, size: number = 10): Observable<NotificationTemplatesPage> {
    return this.http.get<NotificationTemplatesPage>(`${ubsAdminNotificationLink}/get-all-templates?page=${page}&size=${size}`);
  }

  getNotificationTemplate(id: number): Observable<NotificationTemplate> {
    return this.http
      .get<NotificationTemplate>(`${ubsAdminNotificationLink}/get-template/${id}`)
      .pipe(catchError(() => throwError(`No notification template with id ${id}!`)));
  }

  updateNotificationTemplate(id: number, notification: NotificationTemplate) {
    return this.http.put(`${ubsAdminNotificationLink}/update-template/${id}`, notification);
  }

  changeStatusOfNotificationTemplate(id: number, status: string) {
    return this.http.put(`${ubsAdminNotificationLink}/change-template-status/${id}?status=${status}`, null);
  }
}
