import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ubsAdminNotificationLink } from 'src/app/main/links';
import { catchError } from 'rxjs/operators';
import { NotificationFilterParams, NotificationTemplate, NotificationTemplatesPage } from '../models/notifications.model';

export const notificationTriggersMock = [
  {
    trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
    triggerDescription: 'Замовлення не оплачується протягом 3 днів після формування замовлення',
    triggerDescriptionEng: 'The order is not paid 3 days after order was formed'
  },
  {
    trigger: 'TWO_MONTHS_AFTER_LAST_ORDER',
    triggerDescription: '2 місяці після останнього замовлення',
    triggerDescriptionEng: '2 months after last order'
  },
  {
    trigger: 'HALF_PAID_ORDER_STATUS_BROUGHT_BY_HIMSELF',
    triggerDescription: 'Статус не повністю оплаченого замовлення змінено на «Привезе сам»',
    triggerDescriptionEng: 'Status of half paid order changed to «Brought by himself»'
  },
  {
    trigger: 'ORDER_STATUS_CHANGED_FROM_FORMED_TO_BROUGHT_BY_HIMSELF',
    triggerDescription: 'Статус замовлення зміненийз «Сформовано» на «Привезе сам»',
    triggerDescriptionEng: 'Order status changedfrom «Formed» to «Brought by himself»'
  },
  {
    trigger: 'ORDER_WAS_CANCELED',
    triggerDescription: 'Повернення бонусів після скасування замовлення',
    triggerDescriptionEng: 'Refund of bonuses after order cancellation'
  },
  {
    trigger: 'TWO_MONTHS_AFTER_LAST_ORDER',
    triggerDescription: '2 місяці після останнього замовлення',
    triggerDescriptionEng: '2 months after last order'
  },
  {
    trigger: 'ORDER_VIOLATION_CHANGED',
    triggerDescription: 'Керівник змінив порушення в наказі',
    triggerDescriptionEng: 'Manager changed the violation in the order'
  },
  {
    trigger: 'ORDER_VIOLATION_CANCELED',
    triggerDescription: 'Керівник скасував статус припису про порушення',
    triggerDescriptionEng: 'Manager canceled the violation order status'
  },
  {
    trigger: 'ORDER_VIOLATION_ADDED',
    triggerDescription: 'Менеджер додає порушення до замовлення',
    triggerDescriptionEng: 'Manager adds violation to order'
  },
  {
    trigger: 'OVERPAYMENT_WHEN_STATUS_DONE',
    triggerDescription: 'Якщо в замовленні є переплата після зміни статусу замовлення на «Виконано»',
    triggerDescriptionEng: 'If the order has overpayment after changing order status to «Done»'
  },
  {
    trigger: 'STATUS_PARTIALLY_PAID',
    triggerDescription: 'Зміна статусу платежу на «Частково оплачено»',
    triggerDescriptionEng: 'Payment status changes to «Half paid»'
  },
  {
    trigger: 'ORDER_ADDED_TO_ITINERARY_STATUS_CONFIRMED',
    triggerDescription: 'Менеджер включає замовлення в маршрут і змінює статус замовлення на «Підтверджено»',
    triggerDescriptionEng: 'The manager includes the order in the itinerary and changes order status to «Confirmed»'
  },
  {
    trigger: 'PAYMENT_SYSTEM_RESPONSE',
    triggerDescription: 'Система отримує відповідь від платіжної системи',
    triggerDescriptionEng: 'The system gets an answer from the payment system'
  }
];

export const notificationTriggerTimeMock = [
  { time: 'IMMEDIATELY', timeDescription: 'Одразу', timeDescriptionEng: 'Immediately' },
  {
    time: 'TWO_MONTHS_AFTER_LAST_ORDER',
    timeDescription: 'Система щодня перевіряє BD і надсилає повідомлення, якщо замовлення було зроблено 2 місяці тому',
    timeDescriptionEng: 'System checks BD daily and sends messages in case the order was made 2 months ago'
  },
  {
    time: 'AT_6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
    timeDescription:
      'Система перевіряє BD щодня о 18.00 і відправляє повідомлення, якщо замовлення було ' +
      'сформовано 3 дні тому і не було оплачено клієнтом.',
    timeDescriptionEng:
      'System checks BD at 18.00 daily and sends messages in case the order was ' + 'formed 3 days ago and wasn’t paid by the client.'
  }
];

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
    return this.http.put(`${ubsAdminNotificationLink}/update-template/${id}`, notification);
  }

  deactivateNotificationTemplate(id: number) {
    return this.http.put(`${ubsAdminNotificationLink}/deactivate-template/${id}`, null);
  }
}
