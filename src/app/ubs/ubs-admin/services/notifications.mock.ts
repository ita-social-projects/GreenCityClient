import { NotificationTemplate, Platform } from '../models/notifications.model';

export const platformSuccessfulMock: Platform[] = [
  {
    receiverType: '',
    nameEn: 'email',
    name: 'email',
    status: 'ACTIVE',
    bodyEn: 'Successful payment, text for Email',
    bodyUk: 'Успішна оплата, текст для Email'
  },
  {
    receiverType: '',
    nameEn: 'telegram',
    name: 'telegram',
    status: 'INACTIVE',
    bodyEn: 'Successful payment, text for Tg',
    bodyUk: 'Успішна оплата, текст для Tg'
  },
  {
    receiverType: '',
    nameEn: 'viber',
    name: 'viber',
    status: 'INACTIVE',
    bodyEn: 'Successful payment, text for Viber',
    bodyUk: 'Успішна оплата, текст для Viber'
  }
];

export const platformUnpaidMock: Platform[] = [
  {
    receiverType: '',
    nameEn: 'email',
    name: 'email',
    status: 'ACTIVE',
    bodyEn: 'Unpaid order, text for Email',
    bodyUk: 'Неоплачене замовлення, текст для Email'
  },
  {
    receiverType: '',
    nameEn: 'mobile',
    name: 'mobile',
    status: 'ACTIVE',
    bodyEn: 'Unpaid order, text for Tg',
    bodyUk: 'Неоплачене замовлення, текст для Tg'
  },
  {
    receiverType: '',
    nameEn: 'site',
    name: 'site',
    status: 'INACTIVE',
    bodyEn: 'Unpaid order, text for Viber',
    bodyUk: 'Неоплачене замовлення, текст для Viber'
  }
];

export const NotificationMock: NotificationTemplate = {
  notificationTemplateMainInfoDto: {
    type: 'UNPAID_ORDER',
    trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
    triggerDescriptionUk: 'Замовлення не оплачується протягом 3 днів після формування замовлення',
    triggerDescriptionEn: 'The order is not paid 3 days after order was formed',
    time: 'IMMEDIATELY',
    timeDescriptionUk: 'Одразу',
    timeDescriptionEn: 'Immediately',
    schedule: '0 0 18 * * ?',
    titleUk: 'Неоплачене замовлення',
    titleEn: 'Unpaid order',
    notificationStatus: 'ACTIVE',
    scheduleUpdateForbidden: false
  },
  platforms: platformUnpaidMock
};

export const NotificationTemplatesMock = [
  {
    id: 1,
    notificationTemplateMainInfoDto: {
      type: 'UNPAID_ORDER',
      trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
      triggerDescriptionUk: 'Замовлення не оплачується протягом 3 днів після формування замовлення',
      triggerDescriptionEn: 'The order is not paid 3 days after order was formed',
      time: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
      timeDescriptionUk:
        'Система перевіряє BD щодня о 18.00 і відправляє повідомлення, якщо замовлення було ' +
        'сформовано 3 дні тому і не було оплачено клієнтом.',
      timeDescriptionEn:
        'System checks BD at 18.00 daily and sends messages in case the order was ' + 'formed 3 days ago and wasn’t paid by the client.',
      schedule: '27 14 4,7,16 * *',
      titleUk: 'Неоплачене замовлення',
      titleEn: 'Unpaid order',
      notificationStatus: 'ACTIVE',
      scheduleUpdateForbidden: false
    },
    platforms: platformUnpaidMock
  },
  {
    id: 2,
    notificationTemplateMainInfoDto: {
      trigger: 'PAYMENT_SYSTEM_RESPONSE',
      type: 'ORDER_IS_PAID',
      triggerDescriptionUk: 'Система отримує відповідь від платіжної системи',
      triggerDescriptionEn: 'The system gets an answer from the payment system',
      time: 'IMMEDIATELY',
      timeDescriptionUk: 'Одразу',
      timeDescriptionEn: 'Immediately',
      schedule: null,
      titleUk: 'Оплата пройшла успішно',
      titleEn: 'The payment was successful',
      notificationStatus: 'ACTIVE',
      scheduleUpdateForbidden: false
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 3,
    notificationTemplateMainInfoDto: {
      type: 'COURIER_ITINERARY_FORMED',
      trigger: 'ORDER_ADDED_TO_ITINERARY_STATUS_CONFIRMED',
      triggerDescriptionUk: 'Система отримує відповідь від платіжної системи',
      triggerDescriptionEn: 'The system gets an answer from the payment system',
      time: 'IMMEDIATELY',
      timeDescriptionUk: 'Одразу',
      timeDescriptionEn: 'Immediately',
      schedule: null,
      titleUk: 'Маршрут сформовано',
      titleEn: 'The courier route formed',
      notificationStatus: 'ACTIVE',
      scheduleUpdateForbidden: false
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 4,
    notificationTemplateMainInfoDto: {
      type: 'UNPAID_PACKAGE',
      trigger: 'STATUS_PARTIALLY_PAID',
      triggerDescriptionUk: 'Зміна статусу платежу на «Частково оплачено»',
      triggerDescriptionEn: 'Payment status changes to «Half paid»',
      time: 'IMMEDIATELY',
      timeDescriptionUk: 'Одразу',
      timeDescriptionEn: 'Immediately',
      schedule: null,
      titleUk: 'Оплатіть різницю у замовлені',
      titleEn: 'Pay the change in the order',
      notificationStatus: 'ACTIVE',
      scheduleUpdateForbidden: false
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 5,
    notificationTemplateMainInfoDto: {
      type: 'ACCRUED_BONUSES_TO_ACCOUNT',
      trigger: 'OVERPAYMENT_WHEN_STATUS_DONE',
      triggerDescriptionUk: 'Якщо в замовленні є переплата після зміни статусу замовлення на «Виконано»',
      triggerDescriptionEn: 'If the order has overpayment after changing order status to «Done»',
      time: 'IMMEDIATELY',
      timeDescriptionUk: 'Одразу',
      timeDescriptionEn: 'Immediately',
      schedule: null,
      titleUk: 'Нараховано бонуси',
      titleEn: 'Accrued bonuses to the account',
      notificationStatus: 'ACTIVE',
      scheduleUpdateForbidden: false
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 6,
    notificationTemplateMainInfoDto: {
      type: 'VIOLATION_THE_RULES',
      trigger: 'ORDER_VIOLATION_ADDED',
      triggerDescriptionUk: 'Менеджер додає порушення до замовлення',
      triggerDescriptionEn: 'Manager adds violation to order',
      time: 'IMMEDIATELY',
      timeDescriptionUk: 'Одразу',
      timeDescriptionEn: 'Immediately',
      schedule: null,
      titleUk: 'Недотримання правил',
      titleEn: 'Violation of the rules',
      notificationStatus: 'INACTIVE',
      scheduleUpdateForbidden: false
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 7,
    notificationTemplateMainInfoDto: {
      type: 'CANCELED_VIOLATION_THE_RULES_BY_THE_MANAGER',
      trigger: 'ORDER_VIOLATION_CANCELED',
      triggerDescriptionUk: 'Керівник скасував статус припису про порушення',
      triggerDescriptionEn: 'Manager canceled the violation order status',
      time: 'IMMEDIATELY',
      timeDescriptionUk: 'Одразу',
      timeDescriptionEn: 'Immediately',
      schedule: null,
      titleUk: 'Відміна порушення правил',
      titleEn: 'Cancellation of violation of sorting rules',
      notificationStatus: 'ACTIVE',
      scheduleUpdateForbidden: false
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 8,
    notificationTemplateMainInfoDto: {
      type: 'CHANGED_IN_RULE_VIOLATION_STATUS',
      trigger: 'ORDER_VIOLATION_CHANGED',
      triggerDescriptionUk: 'Керівник змінив порушення в наказі',
      triggerDescriptionEn: 'Manager changed the violation in the order',
      time: 'IMMEDIATELY',
      timeDescriptionUk: 'Одразу',
      timeDescriptionEn: 'Immediately',
      schedule: null,
      titleUk: 'Зміни в порушеннях правил сортування',
      titleEn: 'Changes in violations of sorting rules',
      notificationStatus: 'ACTIVE',
      scheduleUpdateForbidden: false
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 9,
    notificationTemplateMainInfoDto: {
      type: 'LETS_STAY_CONNECTED',
      trigger: 'TWO_MONTHS_AFTER_LAST_ORDER',
      triggerDescriptionUk: '2 місяці після останнього замовлення',
      triggerDescriptionEn: '2 months after last order',
      time: 'TWO_MONTHS_AFTER_LAST_ORDER',
      timeDescriptionUk: 'Система щодня перевіряє BD і надсилає повідомлення, якщо замовлення було зроблено 2 місяці тому',
      timeDescriptionEn: 'System checks BD daily and sends messages in case the order was made 2 months ago',
      schedule: null,
      titleUk: `Давайте залишатися на зв'язку`,
      titleEn: `Let's stay connected`,
      notificationStatus: 'INACTIVE',
      scheduleUpdateForbidden: false
    },
    platforms: platformSuccessfulMock
  }
];
