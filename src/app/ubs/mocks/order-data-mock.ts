import { CourierLocations, OrderDetails } from '@ubs/ubs/models/ubs.interface';
import { OrderStatus } from '@ubs/ubs/order-status.enum';

export const ubsOrderServiseMock = {
  orderDetails: null,
  personalData: null,
  error: null
};

export const mockCourierLocations = {
  locationsDtosList: [{ locationId: 1, nameUk: 'Kyiv', nameEn: 'Kyiv' }],
  regionDto: { nameUk: 'Kyiv Region', nameEn: 'Kyiv Region' }
} as CourierLocations;

export const ubsOrderDataMock = {
  additionalOrders: [''],
  bags: [
    {
      capacity: 120,
      count: 2,
      price: 650,
      service: 'Мікс відходів',
      serviceEng: 'Mix waste',
      totalPrice: 0,
      fullPrice: 0
    },
    {
      capacity: 60,
      count: 0,
      price: 220,
      service: 'Текстильні відходи',
      serviceEng: 'Textile waste',
      totalPrice: 0,
      fullPrice: 0
    },
    {
      capacity: 20,
      count: 0,
      price: 110,
      service: 'Текстильні відходи',
      serviceEng: 'Textile waste',
      totalPrice: 0,
      fullPrice: 0
    }
  ],
  certificates: [],
  certificatesSum: 0,
  finalSum: 1300,
  orderComment: '',
  points: 10,
  pointsSum: 0,
  pointsToUse: 0,
  total: 1300
};

export const mockLocations = {
  courierLimit: 'fake',
  courierStatus: 'fake status',
  tariffInfoId: 1,
  regionDto: {
    nameEn: 'fake name en',
    nameUk: 'fake name ua',
    regionId: 2
  },
  locationsDtosList: [
    {
      locationId: 3,
      nameEn: 'fake location en',
      nameUk: 'fake location ua'
    }
  ],
  courierTranslationDtos: [
    {
      languageCode: 'ua',
      name: 'fake name'
    }
  ],
  maxAmountOfBigBags: 99,
  maxPriceOfOrder: 500000,
  minAmountOfBigBags: 2,
  minPriceOfOrder: 500
};

export const orderDetailsMock: OrderDetails = {
  bags: [
    {
      code: 'ua',
      capacity: 100,
      id: 0,
      price: 300,
      quantity: 10,
      nameEng: 'def',
      name: 'def'
    },
    {
      code: 'ua',
      capacity: 100,
      id: 1,
      price: 300,
      quantity: 10,
      nameEng: 'def',
      name: 'def'
    }
  ],
  points: 0
};

export const fakeInputOrderData = {
  additionalOrders: [],
  address: {
    addressCity: 'Lviv',
    addressComment: 'qweqe223',
    addressDistinct: 'Darnitsk',
    addressRegion: 'Lviv region',
    addressStreet: 'King Danylo'
  },
  amountBeforePayment: 1100,
  bags: [
    {
      capacity: 120,
      count: 2,
      price: 250,
      service: 'Safe',
      totalPrice: 500
    }
  ],
  bonuses: 0,
  certificate: [
    { certificateStatus: 'USED', points: 10, creationDate: '2022-05-09', code: '9953-7741' },
    { certificateStatus: 'USED', points: 500, creationDate: '2022-04-15', code: '3003-1992' }
  ],
  dateForm: '2022-03-24T23:48:21.689274',
  datePaid: '2022-03-24T23:48:21.689274',
  extend: true,
  id: 1,
  orderComment: '',
  orderFullPrice: 1100,
  orderStatus: OrderStatus.ADJUSTMENT,
  paidAmount: 1100,
  paymentStatus: 'Paid',
  sender: {
    senderEmail: 'm.kovalushun@gmail.com',
    senderName: 'mukola',
    senderPhone: '+380977777777',
    senderSurname: 'Kovalushun'
  }
};
