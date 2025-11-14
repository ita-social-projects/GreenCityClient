export const columnsParams: ColumnParam[] = [
  {
    title: {
      key: 'clientName',
      uk: 'Імя клієнта',
      en: 'Client name'
    },
    width: 200
  },
  {
    title: {
      key: 'recipientPhone',
      uk: 'Телефон',
      en: 'Phone'
    },
    width: 200
  },
  {
    title: {
      key: 'recipientEmail',
      uk: 'E-mail',
      en: 'E-mail'
    },
    width: 200
  },
  {
    title: {
      key: 'dateOfRegistration',
      uk: 'Дата реєстрації в системі',
      en: 'Registration Date'
    },
    width: 150
  },
  {
    title: {
      key: 'orderDate',
      uk: 'Останнє замовлення',
      en: 'Last order'
    },
    width: 150
  },
  {
    title: {
      key: 'number_of_orders',
      uk: 'К-сть замовлень',
      en: 'Orders'
    },
    width: 100
  },
  {
    title: {
      key: 'violations',
      uk: 'Порушення',
      en: 'Violations'
    },
    width: 100
  },
  {
    title: {
      key: 'currentPoints',
      uk: 'Баланс бонусного рахунку',
      en: 'Bonuses'
    },
    width: 100
  },
  {
    title: {
      key: 'chatId',
      uk: 'Чат з клієнтом',
      en: 'Client chat'
    },
    width: 90
  },
  {
    title: {
      key: 'status',
      uk: 'Статус',
      en: 'Status'
    },
    width: 200
  }
];

export const columnsParamsOrders: ColumnParam[] = [
  {
    title: {
      key: 'orderDate',
      uk: 'Дата замовлення',
      en: 'Order Date'
    },
    width: 100
  },
  {
    title: {
      key: 'id',
      uk: '№ замовлення	',
      en: '№ order	'
    },
    width: 60
  },
  {
    title: {
      key: 'orderStatus',
      uk: 'Статус замовлення',
      en: 'Order status'
    },
    width: 100
  },
  {
    title: {
      key: 'orderPaymentStatus',
      uk: 'Статус оплати',
      en: 'Payment status'
    },
    width: 60
  },
  {
    title: {
      key: 'amount',
      uk: 'Сума замовлення',
      en: 'Order amount'
    },
    width: 60
  }
];

export const columnsParamsViolations: ColumnParam[] = [
  {
    title: {
      key: 'violationDate',
      uk: 'Дата порушення',
      en: 'Violation date'
    },
    width: 100
  },
  {
    title: {
      key: 'orderId',
      uk: '№ замовлення',
      en: '№ order'
    },
    width: 60
  },
  {
    title: {
      key: 'violationLevel',
      uk: 'Ступінь порушення',
      en: 'Violation level'
    },
    width: 100
  }
];

export const columnsParamsCertificates: ColumnParam[] = [
  {
    title: {
      key: 'select',
      uk: 'Вибір',
      en: 'Select'
    },
    width: 45
  },
  {
    title: {
      key: 'code',
      uk: 'Код',
      en: 'Code'
    },
    width: 164
  },
  {
    title: {
      key: 'certificateStatus',
      uk: 'Статус сертифіката',
      en: 'Sertificate status'
    },
    width: 164
  },
  {
    title: {
      key: 'orderId',
      uk: 'Id замовлення',
      en: 'Order Id'
    },
    width: 164
  },
  {
    title: {
      key: 'initialPointsValue',
      uk: 'Значення',
      en: 'Points'
    },
    width: 164
  },
  {
    title: {
      key: 'expirationDate',
      uk: 'Термін придатності',
      en: 'Expiration date'
    },
    width: 164
  },
  {
    title: {
      key: 'creationDate',
      uk: 'Дата створення',
      en: 'Creation date'
    },
    width: 164
  },
  {
    title: {
      key: 'dateOfUse',
      uk: 'Дата використання',
      en: 'Date ot use'
    },
    width: 164
  }
];

export interface ColumnTitle {
  key: string;
  uk: string;
  en: string;
}

export interface ColumnParam {
  title: ColumnTitle;
  width: number;
  index?: number;
}
