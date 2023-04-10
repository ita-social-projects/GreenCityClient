import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ubsAdminNotificationLink } from 'src/app/main/links';
import { catchError } from 'rxjs/operators';
import { NotificationFilterParams, NotificationTemplate, NotificationTemplatesPage } from '../models/notifications.model';

export const notificationTriggers = [
  'ORDER_NOT_PAID_FOR_3_DAYS',
  'PAYMENT_SYSTEM_RESPONSE',
  'ORDER_ADDED_TO_ITINERARY_STATUS_CONFIRMED',
  'STATUS_PARTIALLY_PAID',
  'OVERPAYMENT_WHEN_STATUS_DONE',
  'ORDER_VIOLATION_ADDED',
  'ORDER_VIOLATION_CANCELED',
  'ORDER_VIOLATION_CHANGED',
  '2_MONTHS_AFTER_LAST_ORDER',
  'UNDERPAYMENT_WHEN_STATUS_DONE_OR_CANCELED',
  'HALF_PAID_ORDER_STATUS_BROUGHT_BY_HIMSELF',
  'ORDER_STATUS_CHANGED_FROM_FORMED_TO_BROUGHT_BY_HIMSELF',
  'ORDER_WAS_CANCELED',
  'TWO_MONTHS_AFTER_LAST_ORDER'
];

export const notificationTriggerTime = ['6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID', 'IMMEDIATELY', '2_MONTHS_AFTER_LAST_ORDER'];

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

  updateNotificationTemplate(id: number, notification) {
    console.log('notification', notification);
    notification = {
      notificationStatus: 'ACTIVE',
      platforms: [
        {
          body: 'Шановний Клієнте! Інформуємо Вас про необхідність оплати за послуги. Сума до сплати ${amountToPay}. грн.',
          bodyEng: 'Dear client! We inform you about the necessity of paying for services. The sum is ${amountToPay}. UAH',
          id: 37,
          nameEng: 'Email',
          receiverType: 'EMAIL',
          status: 'ACTIVE'
        },
        {
          body: 'Шановний Клієнте! Інформуємо Вас про необхідність оплати за послуги. Сума до сплати ${amountToPay}. грн.',
          bodyEng: 'Dear client! We inform you about the necessity of paying for services. The sum is ${amountToPay}. UAH',
          id: 37,
          nameEng: 'Site',
          receiverType: 'SITE',
          status: 'ACTIVE'
        },
        {
          body: 'Шановний Клієнте! Інформуємо Вас про необхідність оплати за послуги. Сума до сплати ${amountToPay}. грн.',
          bodyEng: 'Dear client! We inform you about the necessity of paying for services. The sum is ${amountToPay}. UAH',
          id: 37,
          nameEng: 'Mobile',
          receiverType: 'MOBILE',
          status: 'ACTIVE'
        }
      ],
      schedule: null,
      time: 'IMMEDIATELY',
      title: 'Неоплачене замовлення',
      titleEng: 'Unpaid Order',
      trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
      type: 'UNPAID_ORDER'
    };

    this.http.put(`${ubsAdminNotificationLink}/update-template/${id}`, notification).subscribe((res) => {
      console.log('res', res);
    });
  }

  deactivateNotificationTemplate(id: number): Observable<void> {
    console.log(id);
    return of();
  }
}
