export const PlatformsMock = [
  { name: 'email', status: 'ACTIVE', body: { en: 'Successful payment, text for Email', ua: 'Успішна оплата, текст для Email' } },
  { name: 'telegram', status: 'INACTIVE', body: { en: 'Successful payment, text for Tg', ua: 'Успішна оплата, текст для Tg' } },
  { name: 'viber', status: 'INACTIVE', body: { en: 'Successful payment, text for Viber', ua: 'Успішна оплата, текст для Viber' } }
];

export const NotificationTemplatesMock = [
  {
    id: 1,
    trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
    time: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
    schedule: '27 14 4,7,16 * *',
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
    platforms: PlatformsMock
  },
  {
    id: 3,
    trigger: 'ORDER_ADDED_TO_ITINERARY_STATUS_CONFIRMED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'The courier route formed', ua: 'Маршрут сформовано' },
    status: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 4,
    trigger: 'STATUS_PARTIALLY_PAID',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Pay the change in the order', ua: 'Оплатіть різницю у замовлені' },
    status: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 5,
    trigger: 'OVERPAYMENT_WHEN_STATUS_DONE',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Accrued bonuses to the account', ua: 'Нараховано бонуси' },
    status: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 6,
    trigger: 'ORDER_VIOLATION_ADDED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Violation of the rules', ua: 'Недотримання правил' },
    status: 'INACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 7,
    trigger: 'ORDER_VIOLATION_CANCELED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Cancellation of violation of sorting rules', ua: 'Відміна порушення правил' },
    status: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 8,
    trigger: 'ORDER_VIOLATION_CHANGED',
    time: 'IMMEDIATELY',
    schedule: null,
    title: { en: 'Changes in violations of sorting rules', ua: 'Зміни в порушеннях правил сортування' },
    status: 'ACTIVE',
    platforms: PlatformsMock
  },
  {
    id: 9,
    trigger: '2_MONTHS_AFTER_LAST_ORDER',
    time: '2_MONTHS_AFTER_LAST_ORDER',
    schedule: null,
    title: { en: `Let's stay connected`, ua: `Давайте залишатися на зв'язку` },
    status: 'INACTIVE',
    platforms: PlatformsMock
  }
];
