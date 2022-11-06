import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

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
    schedule: { cron: '0 0 * * 1' },
    title: { en: 'Unpaid order', ua: 'Неоплачене замовлення' },
    status: 'ACTIVE',
    body: {
      en:
        'Hello <User name>! You recently submitted a request to order <Order number> our "UBS Courier" service,' +
        ' but we have not received confirmation of payment. Maybe you have some difficulties? If you have any questions,' +
        ' I will be happy to answer them! Chat with the manager <Chat> or e-mail <e-mail>',
      ua:
        'Вітання, <User name>! Ви нещодавно залишили заявку <Order number> для замовлення нашої послуги «УБС Кур’єр»,' +
        ' але ми не отримали підтвердження оплати. Можливо, у вас виникли якісь труднощі? ' +
        'Якщо у вас залишилися будь-які питання — з радістю відповім! Чат з менеджеркою  <Chat> чи e-mail <e-mail>'
    }
  },
  {
    id: 2,
    trigger: 'PAYMENT_SYSTEM_RESPONSE',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'The payment was successful', ua: 'Оплата пройшла успішно' },
    status: 'ACTIVE',
    body: {
      en:
        'Hello, <User name>! You have successfully ordered and paid for the "UBS Courier" service!' +
        ' UBS Courier will pick up your packages within 2-9 days from the date of payment for the service.' +
        ' When the route is formed, we will definitely contact you to agree on the details. If you have any questions,' +
        ' I will be happy to answer them! Chat with the manager  <Chat> or e-mail <e-mail>',
      ua:
        `Вітаємо, <User name>!  Ви успішно замовили й оплатили послугу «УБС Кур'єр»!` +
        ` УБС Кур'єр приїде по ваші пакети впродовж 2–9 днів від дати оплати послуги.` +
        ` Коли маршрут буде сформовано, ми обов'язково зв'яжемося з вами для узгодження деталей.` +
        ` Якщо у вас залишилися будь-які питання — з радістю відповім! Чат з менеджеркою  <Chat> чи e-mail <e-mail>`
    }
  },
  {
    id: 3,
    trigger: 'ORDER_ADDED_TO_ITINERARY_STATUS_CONFIRMED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'The courier route formed', ua: 'Маршрут сформовано' },
    status: 'ACTIVE',
    body: {
      en:
        `Hello,  <User name>! We created the UBS Courier route.` +
        ` Our Courier <Courier name> will be with you tomorrow, <Date>.` +
        ` Working hours of the Courier: from <Time from> to <Time to>. ` +
        `Please stay connected and put your phone on loud during this time.` +
        ` The courier will call you in advance and when he arrives.`,
      ua:
        `Вітання, <User name>! Ми сформували маршрут УБС Кур’єра. Наш Кур’єр <Courier name>  буде у вас завтра, <Date>.` +
        ` Робочий час Кур'єра: з <Time from>  до <Time to>.` +
        ` Будь ласка, залишайтеся в цей час на зв’язку й увімкніть телефон на гучний режим.` +
        ` Кур'єр зателефонує вам заздалегідь та коли приїде.`
    }
  },
  {
    id: 4,
    trigger: 'STATUS_PARTIALLY_PAID',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Pay the change in the order', ua: 'Оплатіть різницю у замовлені' },
    status: 'ACTIVE',
    body: {
      en:
        'Congratulations, <User name>! You have made changes to order No. <Order number>. We ask you to pay <Sum> UAH. ' +
        'Pay: <Button>. If you have any questions, I will be happy to answer them! Chat with the manager <Chat> чи e-mail <e-mail>',
      ua:
        'Вітання, <User name>! Ви внесли зміни у замовлення №<Order number> ' +
        ' Просимо вас, будь ласка, доплатити <Sum>  грн. Оплатити: <Button>. ' +
        ' Якщо у вас залишилися будь-які питання — з радістю відповім! Чат з менеджеркою  <Chat> чи e-mail <e-mail>'
    }
  },
  {
    id: 5,
    trigger: 'OVERPAYMENT_WHEN_STATUS_DONE',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Accrued bonuses to the account', ua: 'Нараховано бонуси' },
    status: 'ACTIVE',
    body: {
      en:
        'Hello! Today UBS Courier picked up packages from you:  <Numbers of packages from the order>. ' +
        'And you paid: <Numbers of packages from the payment>. ' +
        'Therefore, we fix a deposit for you for the next export in the amount of UAH <Difference>. Have a good day!',
      ua:
        'Вітання, <User name>!  Сьогодні УБС Кур’єр забрав у вас пакетів: <Numbers of packages from the order>. ' +
        'А оплачували ви: <Numbers of packages from the payment>. ' +
        'Тож фіксуємо для вас депозит для наступного вивозу на суму <Difference> грн. Гарного дня!'
    }
  },
  {
    id: 6,
    trigger: 'ORDER_VIOLATION_ADDED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Violation of the rules', ua: 'Недотримання правил' },
    status: 'INACTIVE',
    body: {
      en:
        'Hello, <User name>! Sorry, but in your packages were found: <Unsafe waste>. ' +
        'This is waste that we do not accept. Please review our sorting rules again: https://bit.ly/2Q2esLB ',
      ua:
        'Вітання, <User name>! На жаль, у ваших пакетах було виявлено: <Unsafe waste>. Це відходи, які ми не приймаємо.' +
        ' Будь ласка, ознайомтеся ще раз із нашими правилами сортування: https://bit.ly/2Q2esLB'
    }
  },
  {
    id: 7,
    trigger: 'ORDER_VIOLATION_CANCELED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Cancellation of violation of sorting rules', ua: 'Відміна порушення правил' },
    status: 'ACTIVE',
    body: {
      en:
        'Hello <User name>! Your order <Order number> has been canceled with information' +
        ' about violation of sorting rules after communication with the manager.' +
        ' Thank you for sorting with us. Have a good day.',
      ua:
        'Вітаю <User name>! У вашому замовленні <Order number> було скасовано інформацію про порушення' +
        ' правил сортування після спілкування з менеджером. Дякуємо, що сортуєте разом з нами. Гарного дня!'
    }
  },
  {
    id: 8,
    trigger: 'ORDER_VIOLATION_CHANGED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Changes in violations of sorting rules', ua: 'Зміни в порушеннях правил сортування' },
    status: 'ACTIVE',
    body: {
      en:
        'Hello <User name>. Your order <Order number> has had its sorting violation information changed' +
        ' after speaking with the manager. Please see the changes in the order <link order>.' +
        'Thank you for sorting with us. Have a good day.',
      ua:
        'Вітаю <ім’я>! У вашому замовленні <Order number> було внесено зміни в інформацію про' +
        ' порушення правил сортування після спілкування з менеджером. Передивіться, будь ласка, зміни в замовленні' +
        '   <link order>.Дякуємо, що сортуєте разом з нами. Гарного дня.'
    }
  },
  {
    id: 9,
    trigger: '2_MONTHS_AFTER_LAST_ORDER',
    time: '2_MONTHS_AFTER_LAST_ORDER',
    schedule: null,
    title: { en: `Let's stay connected`, ua: `Давайте залишатися на зв'язку` },
    status: 'INACTIVE',
    body: {
      en:
        'Hello <User name>! We noticed that you have not used the "UBS Courier" service for <Last month> months.' +
        ' Maybe you went on a long trip, or maybe something went wrong with the collection of plastics.' +
        ' Please share this with us so we can understand if and how we can help.',
      ua:
        'Привіт, <User name>! Ми помітили, що ви не користувалися послугою «УБС Кур‘єр» уже <Last month> місяці.' +
        ' Можливо, ви вирушили в тривалу подорож, а можливо, щось пішло не так зі збиранням пластиків.' +
        ' Поділіться, будь ласка, цим із нами, щоб ми зрозуміли, чи можемо допомогти і як саме.'
    }
  }
];

export interface NotificationTemplate {
  id: number;
  title: {
    en: string;
    ua: string;
  };
  notificationType: string;
  schedule: {
    cron: string;
  };
  trigger: string;
  time: string;
  status: string;
  body: {
    en: string;
    ua: string;
  };
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
    return of(notificationTemplates.find((temp) => temp.id === id));
  }
}
