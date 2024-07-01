import { OrderDetails } from '@ubs/ubs/models/ubs.interface';

export const ubsOrderServiseMock = {
  orderDetails: null,
  personalData: null,
  error: null
};

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
