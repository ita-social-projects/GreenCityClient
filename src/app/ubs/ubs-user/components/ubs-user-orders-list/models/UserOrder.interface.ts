export interface IUserOrderInfo {
  additionalOrders: any;
  address: IAddressExportDetails;
  amountBeforePayment: number;
  bags: IBags[];
  bonuses: number;
  certificate: ICertificate[];
  dateForm: string;
  datePaid: string;
  extend?: boolean;
  id: number;
  orderComment: string;
  orderFullPrice: number;
  orderStatusUk: string;
  orderStatusEn: string;
  paidAmount: number;
  paymentStatusUk: string;
  paymentStatusEn: string;
  paymentLink: string;
  sender: IUserInfo;
  refundedBonuses: number;
  refundedMoney: number;
}

export interface IUserInfo {
  senderEmail: string;
  senderName: string;
  senderPhone: string;
  senderSurname: string;
}

export interface IAddressExportDetails {
  addressCityUk: string;
  addressCityEn: string;
  addressComment: string;
  addressDistinctUk: string;
  addressDistinctEn: string;
  addressRegionUk: string;
  addressRegionEn: string;
  addressStreetUk: string;
  addressStreetEn: string;
  entranceNumber: string;
  houseCorpus: string;
  houseNumber: string;
}

export interface IBags {
  capacity: number;
  count: number;
  price: number;
  serviceUk: string;
  serviceEn: string;
  totalPrice: number;
  fullPrice: number;
}

export interface ICertificate {
  certificateStatus: string;
  code: string;
  creationDate: string;
  points: number;
}

export enum PaymentStatusEn {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
  HALFPAID = 'Half paid'
}

export enum OrderStatusEn {
  DONE = 'Done',
  CANCELED = 'Canceled',
  CONFIRMED = 'Confirmed',
  FORMED = 'Formed',
  ADJUSTMENT = 'Adjustment',
  BROUGHT_IT_HIMSELF = 'Brought by himself',
  NOT_TAKEN_OUT = 'Not taken out'
}

export interface IUserOrdersInfo {
  currentPage: number;
  page: IUserOrderInfo[];
  totalElements: number;
  totalPages: number;
}
