import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

const dummyTitles = ['Неоплачене замовлення', 'Нараховано бонуси', `Сформований маршрут кур'єра`];
const dummyTypes = ['UNPAID_ORDER', 'ACCRUED_BONUSES_TO_ACCOUNT', 'COURIER_ITINERARY_FORMED'];
const dummySchedules = [{ cron: '0 0 18 * *' }, null];
const dummyBodies = [''];
const dummyStatuses = ['active', 'inactive'];

const triggers = {
  UNPAID_ORDER: { en: 'The order is not paid 3 days after order was formed' },
  ORDER_IS_PAID: { en: '' }
};

const notificationTemplates = [
  {
    id: 1,
    trigger: { en: 'The order is not paid 3 days after order was formed' },
    time: {
      en: 'System checks BD at 18.00 daily and sends messages in case the order was formed 3 days ago and wasn’t paid by the client.'
    },
    schedule: { cron: '0 0 * * 1' },
    title: { en: 'Unpaid order', ua: 'Неоплачене замовлення' }
  },
  {
    id: 2,
    trigger: { en: 'The system gets an answer from the payment system' },
    time: {
      en: 'The UBS system sends a message immediately after confirmation.'
    },
    schedule: null,
    title: { en: 'The payment was successful', ua: 'Оплата пройшла успішно' }
  },
  {
    id: 3,
    trigger: { en: 'The system gets an answer from the payment system' },
    time: {
      en: 'The UBS system sends a message immediately after confirmation.'
    },
    schedule: null,
    title: { en: 'The payment was successful', ua: 'Оплата пройшла успішно' }
  }
];

const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getDummyNotification = (id): NotificationTemplate => ({
  id,
  title: choice(dummyTitles),
  notificationType: choice(dummyTypes),
  schedule: choice(dummySchedules),
  body: choice(dummyBodies),
  status: choice(dummyStatuses)
});

const totalNotifications = 100;
const notifications = Array(totalNotifications)
  .fill(0)
  .map((_, idx) => getDummyNotification(idx));

export interface NotificationTemplate {
  id: number;
  title: {
    enTitle: string;
    uaTitle: string;
  };
  notificationType: string;
  schedule: {
    cron: string;
  };
  status: string;
  body: {
    bodyEn: string;
    bodyUa: string;
  };
}

export interface NotificationFilterParams {
  topic?: string;
  activationEvent?: string[];
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  getAllNotificationTemplates(page: number = 0, size: number = 10, filter: NotificationFilterParams = {}) {
    // const match = (str, substr) => str.toLowerCase().includes(substr.trim().toLowerCase());

    // const filtered = notifications.filter((notification) => {
    //   const byTitle = filter.topic && match(notification.title, filter.topic);
    //   const byType =
    //     filter.activationEvent?.length &&
    //     filter.activationEvent.reduce((acc, option) => acc || match(notification.notificationType, option), false);
    //   // debugger;
    //   const byStatus = filter.status && notification.status === filter.status;
    //   return ![byTitle, byType, byStatus].some((cond) => cond === false);
    // });
    // const totalItems = filtered.length;
    // const totalPages = totalItems < size ? 1 : Math.ceil(totalItems / size);
    // return of({
    //   currentPage: page,
    //   page: filtered.slice(page * size, page * size + size),
    //   totalElements: totalItems,
    //   totalPages
    // }).toPromise();

    return this.http
      .get<{ currentPage: number; page: NotificationTemplate[]; totalElements: number; totalPages: number }>(
        `https://greencity-ubs.testgreencity.ga/admin/notification/get-all-templates?page=${page}&size=${size}`
      )
      .toPromise();
  }

  getNotificationTemplate(id: number) {
    return of({
      id: 1,
      title: 'Неоплачене замовлення',
      notificationType: 'UNPAID_ORDER',
      schedule: {
        cron: '0 0 18 * *'
      },
      text: `Вітання, <Ім'я користувача>!`,
      status: 'active'
    }).toPromise();
  }
}
