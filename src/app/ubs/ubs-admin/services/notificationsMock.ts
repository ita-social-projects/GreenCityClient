export const PlatformsMock = [
  { name: 'email', status: 'ACTIVE', body: { en: 'Successful payment, text for Email', ua: 'Успішна оплата, текст для Email' } },
  { name: 'telegram', status: 'INACTIVE', body: { en: 'Successful payment, text for Tg', ua: 'Успішна оплата, текст для Tg' } },
  { name: 'viber', status: 'INACTIVE', body: { en: 'Successful payment, text for Viber', ua: 'Успішна оплата, текст для Viber' } }
];

export const NotificationMock = {
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
  platforms: [
    { name: 'email', status: 'ACTIVE', body: { en: 'Unpaid order, text for Email', ua: 'Неоплачене замовлення, текст для Email' } },
    { name: 'mobile', status: 'ACTIVE', body: { en: 'Unpaid order, text for Tg', ua: 'Неоплачене замовлення, текст для Tg' } },
    { name: 'site', status: 'INACTIVE', body: { en: 'Unpaid order, text for Viber', ua: 'Неоплачене замовлення, текст для Viber' } }
  ]
};

export const NotificationTemplatesMock = [
  {
    id: 1,
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
    notificationStatus: 'ACTIVE',
    platforms: [
      { name: 'email', status: 'ACTIVE', body: { en: 'Unpaid order, text for Email', ua: 'Неоплачене замовлення, текст для Email' } },
      { name: 'telegram', status: 'ACTIVE', body: { en: 'Unpaid order, text for Tg', ua: 'Неоплачене замовлення, текст для Tg' } },
      { name: 'viber', status: 'INACTIVE', body: { en: 'Unpaid order, text for Viber', ua: 'Неоплачене замовлення, текст для Viber' } }
    ]
  },
  {
    id: 2,
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
    notificationStatus: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 3,
    type: 'COURIER_ITINERARY_FORMED',
    trigger: 'ORDER_ADDED_TO_ITINERARY_STATUS_CONFIRMED',
    time: 'IMMEDIATELY',
    timeDescription: 'Одразу',
    timeDescriptionEng: 'Immediately',
    schedule: null,
    title: 'Маршрут сформовано',
    titleEng: 'The courier route formed',
    notificationStatus: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 4,
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
    notificationStatus: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 5,
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
    notificationStatus: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 6,
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
    notificationStatus: 'INACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 7,
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
    notificationStatus: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 8,
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
    notificationStatus: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 9,
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
    notificationStatus: 'INACTIVE',
    platforms: PlatformsMock
  }
];
