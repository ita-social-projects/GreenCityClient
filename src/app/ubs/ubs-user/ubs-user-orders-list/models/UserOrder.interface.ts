export interface IUserOrderInfo {
  additionalOrders: any;
  address: IAddressExportDetails;
  amountBeforePayment: number;
  bags: IBags[];
  bonuses: number;
  certificate: string[];
  dateForm: string;
  datePaid: string;
  extend?: boolean;
  id: number;
  orderComment: string;
  orderFullPrice: number;
  orderStatus: string;
  paidAmount: number;
  paymentStatus: string;
  sender: IUserInfo;
}

export interface IUserInfo {
  senderEmail: string;
  senderName: string;
  senderPhone: string;
  senderSurname: string;
}

export interface IAddressExportDetails {
  addressCity: string;
  addressComment: string;
  addressDistinct: string;
  addressRegion: string;
  addressStreet: string;
}

export interface IBags {
  capacity: number;
  count: number;
  price: number;
  service: string;
  totalPrice: number;
}

export enum CheckPaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
  HALFPAID = 'Half paid'
}

export enum CheckOrderStatus {
  DONE = 'Done',
  CANCELED = 'Canceled',
  CONFIRMED = 'Confirmed',
  FORMED = 'Formed',
  ADJUSTMENT = 'Adjustment'
}
