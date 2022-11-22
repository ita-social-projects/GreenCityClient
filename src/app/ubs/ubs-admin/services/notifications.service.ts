import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';

export const notificationTriggers = [
  'ORDER_NOT_PAID_FOR_3_DAYS',
  'PAYMENT_SYSTEM_RESPONSE',
  'ORDER_ADDED_TO_ITINERARY_STATUS_CONFIRMED',
  'STATUS_PARTIALLY_PAID',
  'OVERPAYMENT_WHEN_STATUS_DONE',
  'ORDER_VIOLATION_ADDED',
  'ORDER_VIOLATION_CANCELED',
  'ORDER_VIOLATION_CHANGED',
  '2_MONTHS_AFTER_LAST_ORDER'
];

export const notificationTriggerTime = ['6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID', 'IMMEDIATELY', '2_MONTHS_AFTER_LAST_ORDER'];

export const notificationStatuses = ['ACTIVE', 'INACTIVE'];

const notificationTemplates = [
  {
    id: 1,
    trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
    time: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
    schedule: { cron: '27 14 4,7,16 * *' },
    title: { en: 'Unpaid order', ua: 'Неоплачене замовлення' },
    status: 'ACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: 'Unpaid order, text for Email', ua: 'Неоплачене замовлення, текст для Email' } },
      { name: 'telegram', status: 'ACTIVE', body: { en: 'Unpaid order, text for Tg', ua: 'Неоплачене замовлення, текст для Tg' } },
      { name: 'viber', status: 'INACTIVE', body: { en: 'Unpaid order, text for Viber', ua: 'Неоплачене замовлення, текст для Viber' } }
    ]
  },
  {
    id: 2,
    trigger: 'PAYMENT_SYSTEM_RESPONSE',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'The payment was successful', ua: 'Оплата пройшла успішно' },
    status: 'ACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: 'Successful payment, text for Email', ua: 'Успішна оплата, текст для Email' } },
      { name: 'telegram', status: 'INACTIVE', body: { en: 'Successful payment, text for Tg', ua: 'Успішна оплата, текст для Tg' } },
      { name: 'viber', status: 'INACTIVE', body: { en: 'Successful payment, text for Viber', ua: 'Успішна оплата, текст для Viber' } }
    ]
  },
  {
    id: 3,
    trigger: 'ORDER_ADDED_TO_ITINERARY_STATUS_CONFIRMED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'The courier route formed', ua: 'Маршрут сформовано' },
    status: 'ACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'telegram', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'viber', status: 'ACTIVE', body: { en: '', ua: '' } }
    ]
  },
  {
    id: 4,
    trigger: 'STATUS_PARTIALLY_PAID',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Pay the change in the order', ua: 'Оплатіть різницю у замовлені' },
    status: 'ACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'telegram', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'viber', status: 'ACTIVE', body: { en: '', ua: '' } }
    ]
  },
  {
    id: 5,
    trigger: 'OVERPAYMENT_WHEN_STATUS_DONE',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Accrued bonuses to the account', ua: 'Нараховано бонуси' },
    status: 'ACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'telegram', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'viber', status: 'ACTIVE', body: { en: '', ua: '' } }
    ]
  },
  {
    id: 6,
    trigger: 'ORDER_VIOLATION_ADDED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Violation of the rules', ua: 'Недотримання правил' },
    status: 'INACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'telegram', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'viber', status: 'ACTIVE', body: { en: '', ua: '' } }
    ]
  },
  {
    id: 7,
    trigger: 'ORDER_VIOLATION_CANCELED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Cancellation of violation of sorting rules', ua: 'Відміна порушення правил' },
    status: 'ACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'telegram', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'viber', status: 'ACTIVE', body: { en: '', ua: '' } }
    ]
  },
  {
    id: 8,
    trigger: 'ORDER_VIOLATION_CHANGED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Changes in violations of sorting rules', ua: 'Зміни в порушеннях правил сортування' },
    status: 'ACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'telegram', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'viber', status: 'ACTIVE', body: { en: '', ua: '' } }
    ]
  },
  {
    id: 9,
    trigger: '2_MONTHS_AFTER_LAST_ORDER',
    time: '2_MONTHS_AFTER_LAST_ORDER',
    schedule: null,
    title: { en: `Let's stay connected`, ua: `Давайте залишатися на зв'язку` },
    status: 'INACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'telegram', status: 'ACTIVE', body: { en: '', ua: '' } },
      { name: 'viber', status: 'ACTIVE', body: { en: '', ua: '' } }
    ]
  }
];

export interface Platform {
  name: string;
  status: string;
  body: {
    en: string;
    ua: string;
  };
}

export interface NotificationTemplate {
  id: number;
  title: {
    en: string;
    ua: string;
  };
  schedule: {
    cron: string;
  };
  trigger: string;
  time: string;
  status: string;
  platforms: Platform[];
}

export interface NotificationFilterParams {
  topic?: string;
  triggers?: string[];
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  getAllNotificationTemplates(page: number = 0, size: number = 10, filter: NotificationFilterParams = {}) {
    const filtered = notificationTemplates.filter((notification) => {
      const match = (str, substr) => str.toLowerCase().includes(substr.trim().toLowerCase());
      const byTitle = filter.topic && (match(notification.title.en, filter.topic) || match(notification.title.ua, filter.topic));
      const byTrigger = filter.triggers?.length && filter.triggers.some((trigger) => notification.trigger === trigger);
      const byStatus = filter.status && notification.status === filter.status;
      return ![byTitle, byTrigger, byStatus].some((cond) => cond === false);
    });

    const totalElements = filtered.length;
    const totalPages = totalElements < size ? 1 : Math.ceil(totalElements / size);

    return of({
      currentPage: page,
      page: filtered.slice(page * size, page * size + size),
      totalElements,
      totalPages
    }).toPromise();

    // return this.http
    //   .get<{ currentPage: number; page: NotificationTemplate[]; totalElements: number; totalPages: number }>(
    //     `https://greencity-ubs.testgreencity.ga/admin/notification/get-all-templates?page=${page}&size=${size}`
    //   )
    //   .toPromise();
  }

  getNotificationTemplate(id: number) {
    const template = notificationTemplates.find((temp) => temp.id === id);
    if (!template) {
      return throwError(`No notification template with id ${id}!`);
    }
    return of(template);
  }
}
