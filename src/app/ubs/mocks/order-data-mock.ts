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
      id: 1,
      name: 'Мікс відходів',
      capacity: 120,
      price: 650,
      nameEng: 'Mix waste',
      limitedIncluded: true,
      quantity: 2
    },
    {
      id: 3,
      name: 'Текстильні відходи',
      capacity: 60,
      price: 220,
      nameEng: 'Textile waste',
      limitedIncluded: false,
      quantity: 0
    },
    {
      id: 2,
      name: 'Текстильні відходи',
      capacity: 20,
      price: 110,
      nameEng: 'Textile waste',
      limitedIncluded: false,
      quantity: 0
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

export const ordersMock = {
  points: 0,
  bags: [
    {
      code: 'ua',
      capacity: 100,
      id: 0,
      locationId: 1,
      price: 300,
      quantity: 10,
      nameEng: 'def',
      name: 'def'
    },
    {
      code: 'ua',
      capacity: 100,
      id: 1,
      locationId: 1,
      price: 300,
      quantity: 10,
      nameEng: 'def',
      name: 'def'
    }
  ]
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
