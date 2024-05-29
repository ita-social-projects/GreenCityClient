import { NotificationTemplate, Platform } from '../models/notifications.model';

export const platformSuccessfulMock: Platform[] = [
  {
    receiverType: '',
    nameEng: 'email',
    name: 'email',
    status: 'ACTIVE',
    bodyEng: 'Successful payment, text for Email',
    body: 'Успішна оплата, текст для Email'
  },
  {
    receiverType: '',
    nameEng: 'telegram',
    name: 'telegram',
    status: 'INACTIVE',
    bodyEng: 'Successful payment, text for Tg',
    body: 'Успішна оплата, текст для Tg'
  },
  {
    receiverType: '',
    nameEng: 'viber',
    name: 'viber',
    status: 'INACTIVE',
    bodyEng: 'Successful payment, text for Viber',
    body: 'Успішна оплата, текст для Viber'
  }
];

export const platformUnpaidMock: Platform[] = [
  {
    receiverType: '',
    nameEng: 'email',
    name: 'email',
    status: 'ACTIVE',
    bodyEng: 'Unpaid order, text for Email',
    body: 'Неоплачене замовлення, текст для Email'
  },
  {
    receiverType: '',
    nameEng: 'mobile',
    name: 'mobile',
    status: 'ACTIVE',
    bodyEng: 'Unpaid order, text for Tg',
    body: 'Неоплачене замовлення, текст для Tg'
  },
  {
    receiverType: '',
    nameEng: 'site',
    name: 'site',
    status: 'INACTIVE',
    bodyEng: 'Unpaid order, text for Viber',
    body: 'Неоплачене замовлення, текст для Viber'
  }
];

export const NotificationMock: NotificationTemplate = {
  notificationTemplateMainInfoDto: {
    type: 'UNPAID_ORDER',
    trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
    triggerDescription: 'Замовлення не оплачується протягом 3 днів після формування замовлення',
    triggerDescriptionEng: 'The order is not paid 3 days after order was formed',
    time: 'IMMEDIATELY',
    timeDescription: 'Одразу',
    timeDescriptionEng: 'Immediately',
    schedule: '0 0 18 * * ?',
    title: 'Неоплачене замовлення',
    titleEng: 'Unpaid order',
    notificationStatus: 'ACTIVE'
  },
  platforms: platformUnpaidMock
};

export const NotificationTemplatesMock = [
  {
    id: 1,
    notificationTemplateMainInfoDto: {
      type: 'UNPAID_ORDER',
      trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
      triggerDescription: 'Замовлення не оплачується протягом 3 днів після формування замовлення',
      triggerDescriptionEng: 'The order is not paid 3 days after order was formed',
      time: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
      timeDescription:
        'Система перевіряє BD щодня о 18.00 і відправляє повідомлення, якщо замовлення було ' +
        'сформовано 3 дні тому і не було оплачено клієнтом.',
      timeDescriptionEng:
        'System checks BD at 18.00 daily and sends messages in case the order was ' + 'formed 3 days ago and wasn’t paid by the client.',
      schedule: '27 14 4,7,16 * *',
      title: 'Неоплачене замовлення',
      titleEng: 'Unpaid order',
      notificationStatus: 'ACTIVE'
    },
    platforms: platformUnpaidMock
  },
  {
    id: 2,
    notificationTemplateMainInfoDto: {
      trigger: 'PAYMENT_SYSTEM_RESPONSE',
      type: 'ORDER_IS_PAID',
      triggerDescription: 'Система отримує відповідь від платіжної системи',
      triggerDescriptionEng: 'The system gets an answer from the payment system',
      time: 'IMMEDIATELY',
      timeDescription: 'Одразу',
      timeDescriptionEng: 'Immediately',
      schedule: null,
      title: 'Оплата пройшла успішно',
      titleEng: 'The payment was successful',
      notificationStatus: 'ACTIVE'
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 3,
    notificationTemplateMainInfoDto: {
      type: 'COURIER_ITINERARY_FORMED',
      trigger: 'ORDER_ADDED_TO_ITINERARY_STATUS_CONFIRMED',
      triggerDescription: 'Система отримує відповідь від платіжної системи',
      triggerDescriptionEng: 'The system gets an answer from the payment system',
      time: 'IMMEDIATELY',
      timeDescription: 'Одразу',
      timeDescriptionEng: 'Immediately',
      schedule: null,
      title: 'Маршрут сформовано',
      titleEng: 'The courier route formed',
      notificationStatus: 'ACTIVE'
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 4,
    notificationTemplateMainInfoDto: {
      type: 'UNPAID_PACKAGE',
      trigger: 'STATUS_PARTIALLY_PAID',
      triggerDescription: 'Зміна статусу платежу на «Частково оплачено»',
      triggerDescriptionEng: 'Payment status changes to «Half paid»',
      time: 'IMMEDIATELY',
      timeDescription: 'Одразу',
      timeDescriptionEng: 'Immediately',
      schedule: null,
      title: 'Оплатіть різницю у замовлені',
      titleEng: 'Pay the change in the order',
      notificationStatus: 'ACTIVE'
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 5,
    notificationTemplateMainInfoDto: {
      type: 'ACCRUED_BONUSES_TO_ACCOUNT',
      trigger: 'OVERPAYMENT_WHEN_STATUS_DONE',
      triggerDescription: 'Якщо в замовленні є переплата після зміни статусу замовлення на «Виконано»',
      triggerDescriptionEng: 'If the order has overpayment after changing order status to «Done»',
      time: 'IMMEDIATELY',
      timeDescription: 'Одразу',
      timeDescriptionEng: 'Immediately',
      schedule: null,
      title: 'Нараховано бонуси',
      titleEng: 'Accrued bonuses to the account',
      notificationStatus: 'ACTIVE'
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 6,
    notificationTemplateMainInfoDto: {
      type: 'VIOLATION_THE_RULES',
      trigger: 'ORDER_VIOLATION_ADDED',
      triggerDescription: 'Менеджер додає порушення до замовлення',
      triggerDescriptionEng: 'Manager adds violation to order',
      time: 'IMMEDIATELY',
      timeDescription: 'Одразу',
      timeDescriptionEng: 'Immediately',
      schedule: null,
      title: 'Недотримання правил',
      titleEng: 'Violation of the rules',
      notificationStatus: 'INACTIVE'
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 7,
    notificationTemplateMainInfoDto: {
      type: 'CANCELED_VIOLATION_THE_RULES_BY_THE_MANAGER',
      trigger: 'ORDER_VIOLATION_CANCELED',
      triggerDescription: 'Керівник скасував статус припису про порушення',
      triggerDescriptionEng: 'Manager canceled the violation order status',
      time: 'IMMEDIATELY',
      timeDescription: 'Одразу',
      timeDescriptionEng: 'Immediately',
      schedule: null,
      title: 'Відміна порушення правил',
      titleEng: 'Cancellation of violation of sorting rules',
      notificationStatus: 'ACTIVE'
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 8,
    notificationTemplateMainInfoDto: {
      type: 'CHANGED_IN_RULE_VIOLATION_STATUS',
      trigger: 'ORDER_VIOLATION_CHANGED',
      triggerDescription: 'Керівник змінив порушення в наказі',
      triggerDescriptionEng: 'Manager changed the violation in the order',
      time: 'IMMEDIATELY',
      timeDescription: 'Одразу',
      timeDescriptionEng: 'Immediately',
      schedule: null,
      title: 'Зміни в порушеннях правил сортування',
      titleEng: 'Changes in violations of sorting rules',
      notificationStatus: 'ACTIVE'
    },
    platforms: platformSuccessfulMock
  },
  {
    id: 9,
    notificationTemplateMainInfoDto: {
      type: 'LETS_STAY_CONNECTED',
      trigger: 'TWO_MONTHS_AFTER_LAST_ORDER',
      triggerDescription: '2 місяці після останнього замовлення',
      triggerDescriptionEng: '2 months after last order',
      time: 'TWO_MONTHS_AFTER_LAST_ORDER',
      timeDescription: 'Система щодня перевіряє BD і надсилає повідомлення, якщо замовлення було зроблено 2 місяці тому',
      timeDescriptionEng: 'System checks BD daily and sends messages in case the order was made 2 months ago',
      schedule: null,
      title: `Давайте залишатися на зв'язку`,
      titleEng: `Let's stay connected`,
      notificationStatus: 'INACTIVE'
    },
    platforms: platformSuccessfulMock
  }
];

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
