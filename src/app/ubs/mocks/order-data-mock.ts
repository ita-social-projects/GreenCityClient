import { IUserOrderInfo } from '@ubs/ubs-user/components/ubs-user-orders-list/models/UserOrder.interface';
import { CourierLocations, OrderDetails, PersonalData } from '@ubs/ubs/models/ubs.interface';
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
    nameUk: 'fake name uk',
    regionId: 2
  },
  locationsDtosList: [
    {
      locationId: 3,
      nameEn: 'fake location en',
      nameUk: 'fake location uk'
    }
  ],
  courierTranslationDtos: [
    {
      languageCode: 'uk',
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
      code: 'uk',
      capacity: 100,
      id: 0,
      price: 300,
      quantity: 10,
      nameEn: 'def',
      nameUk: 'def'
    },
    {
      code: 'uk',
      capacity: 100,
      id: 1,
      price: 300,
      quantity: 10,
      nameEn: 'def',
      nameUk: 'def'
    }
  ],
  points: 0
};

export const fakeInputOrderData: IUserOrderInfo = {
  additionalOrders: [],
  address: {
    addressCityUk: 'Львів',
    addressCityEn: 'Lviv',
    addressComment: 'qweqe223',
    addressDistinctUk: 'Дарницький',
    addressDistinctEn: 'Darnitsk',
    addressRegionUk: 'Львівська область',
    addressRegionEn: 'Lviv region',
    addressStreetUk: 'Короля Данила',
    addressStreetEn: 'King Danylo',
    entranceNumber: '1A',
    houseCorpus: 'B',
    houseNumber: '15'
  },
  amountBeforePayment: 1100,
  bags: [
    {
      capacity: 120,
      count: 2,
      price: 250,
      serviceUk: 'Безпечний',
      serviceEn: 'Safe',
      totalPrice: 500,
      fullPrice: 600
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
  orderStatusUk: 'Коригування',
  orderStatusEn: 'Adjustment',
  paidAmount: 1100,
  paymentStatusUk: 'Оплачено',
  paymentStatusEn: 'Paid',
  sender: {
    senderEmail: 'm.kovalushun@gmail.com',
    senderName: 'Mykola',
    senderPhone: '+380977777777',
    senderSurname: 'Kovalushun'
  },
  refundedBonuses: 0,
  refundedMoney: 0
};

export const personalMockData: PersonalData = {
  id: 1,
  ubsUserId: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+1234567890',
  addressComment: 'comment',
  city: 'Lviv',
  cityEn: 'Lviv',
  district: 'Central',
  districtEn: 'Central',
  street: 'King Danylo',
  streetEn: 'King Danylo',
  region: 'Lviv region',
  regionEn: 'Lviv region',
  houseCorpus: '1',
  entranceNumber: '2',
  houseNumber: '3',
  longitude: 12.34,
  latitude: 56.78,
  isAnotherClient: false,
  senderEmail: 'sender@example.com',
  senderFirstName: 'Sender',
  senderLastName: 'Name',
  senderPhoneNumber: '+0987654321'
};
