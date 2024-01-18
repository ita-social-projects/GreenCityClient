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
