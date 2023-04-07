import { IOrderInfo, IEmployee, IGeneralOrderInfo } from '../models/ubs-admin.interface';

export const fakeAllPositionsEmployees: Map<string, IEmployee[]> = new Map();
fakeAllPositionsEmployees.set('PositionDto(id=1, name=Менеджер послуги)', [{ id: 1, name: 'Maria Admin' }]);
fakeAllPositionsEmployees.set('PositionDto(id=2, name=Менеджер обдзвону)', []);
fakeAllPositionsEmployees.set('PositionDto(id=3, name=Логіст)', []);
fakeAllPositionsEmployees.set('PositionDto(id=4, name=Штурман)', []);
fakeAllPositionsEmployees.set('PositionDto(id=5, name=Водій)', []);

export const OrderInfoMockedData: IOrderInfo = {
  generalOrderInfo: {
    id: 1,
    dateFormed: '2022-02-08T15:21:44.85458',
    adminComment: null,
    orderStatus: 'FORMED',
    orderStatusName: 'Сформовано',
    orderStatusNameEng: 'Formed',
    orderStatusesDtos: [
      {
        ableActualChange: false,
        key: 'FORMED',
        translation: 'Сформовано'
      },
      {
        ableActualChange: false,
        key: 'ADJUSTMENT',
        translation: 'Узгодження'
      },
      {
        ableActualChange: false,
        key: 'BROUGHT_IT_HIMSELF',
        translation: 'Привезе сам'
      },
      {
        ableActualChange: false,
        key: 'CONFIRMED',
        translation: 'Підтверджено'
      },
      {
        ableActualChange: false,
        key: 'ON_THE_ROUTE',
        translation: 'На маршруті'
      },
      {
        ableActualChange: true,
        key: 'DONE',
        translation: 'Виконано'
      },
      {
        ableActualChange: false,
        key: 'NOT_TAKEN_OUT',
        translation: 'Не вивезли'
      },
      {
        ableActualChange: true,
        key: 'CANCELED',
        translation: 'Скасовано'
      }
    ],
    orderPaymentStatus: 'PAID',
    orderPaymentStatusName: 'Оплачено',
    orderPaymentStatusNameEng: 'Paid',
    orderPaymentStatusesDto: [
      {
        key: 'PAID',
        translation: 'Оплачено'
      }
    ]
  },
  userInfoDto: {
    recipientId: 37,
    customerEmail: 'greencitytest@gmail.com',
    customerName: 'test',
    customerPhoneNumber: '380964521167',
    customerSurName: 'test',
    recipientEmail: 'test@gmail.com',
    recipientName: 'test',
    recipientPhoneNumber: '380964523467',
    recipientSurName: 'test',
    totalUserViolations: 0,
    userViolationForCurrentOrder: 0
  },
  addressExportDetailsDto: {
    addressId: 32,
    addressCity: 'Київ',
    addressCityEng: 'Kyiv',
    addressDistrict: 'Шевченківський',
    addressDistrictEng: 'Shevchenkivskyi',
    addressEntranceNumber: 1,
    addressHouseCorpus: 3,
    addressHouseNumber: 42,
    addressRegion: 'Київська область',
    addressRegionEng: 'Kyiv Oblast',
    addressStreet: 'Січових Стрільців вул',
    addressStreetEng: 'Sichovyh Streltsyv str'
  },
  addressComment: '',
  amountOfBagsConfirmed: new Map(),
  amountOfBagsExported: new Map(),
  amountOfBagsOrdered: new Map(),
  bags: [
    {
      actual: 0,
      capacity: 120,
      confirmed: 1,
      id: 1,
      name: 'Безпечні відходи',
      planned: 1,
      price: 250
    }
  ],
  courierPricePerPackage: 1,
  courierInfo: {
    courierLimit: 'LIMIT_BY_AMOUNT_OF_BAG',
    min: 2,
    max: 99
  },
  orderBonusDiscount: 0,
  orderCertificateTotalDiscount: 0,
  orderDiscountedPrice: 900,
  orderExportedDiscountedPrice: 0,
  orderExportedPrice: 0,
  orderFullPrice: 900,
  certificates: [],
  numbersFromShop: [],
  comment: '',
  paymentTableInfoDto: {
    overpayment: 480,
    paidAmount: 250,
    paymentInfoDtos: [
      {
        amount: 200,
        comment: null,
        id: 40,
        imagePath: null,
        paymentId: '436436436',
        receiptLink: '',
        settlementdate: '2022-02-01',
        currentDate: '2022-02-09'
      }
    ],
    unPaidAmount: 650
  },
  exportDetailsDto: {
    allReceivingStations: [],
    dateExport: null,
    receivingStationId: null,
    timeDeliveryFrom: null,
    timeDeliveryTo: null
  },
  employeePositionDtoRequest: {
    allPositionsEmployees: fakeAllPositionsEmployees,
    currentPositionEmployees: new Map(),
    orderId: 1
  }
};
