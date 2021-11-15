export interface Employees {
  currentPage: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  last: boolean;
  number: number;
  page: Page[];
  totalElements: number;
  totalPages: number;
}

export interface Page {
  email: string;
  employeePositions: EmployeePositions[];
  firstName: string;
  id: number;
  image: string;
  lastName: string;
  phoneNumber: string;
  receivingStations: ReceivingStations[];
}

export interface EmployeePositions {
  id: number;
  name: string;
}

export interface ReceivingStations {
  id: number;
  name: string;
}

export interface Bags {
  bags: Bag[];
  points: number;
}

export interface Bag {
  id: number;
  name: string;
  capacity: number;
  price: number;
  code: string;
}

export interface IOrderDetails {
  amount: number;
  bagId: number;
  capacity: number;
  confirmedQuantity: number;
  exportedQuantity: number;
  name: string;
  orderId: number;
  price: number;
}

export interface IRecipientsData {
  id: number;
  recipientEmail: string;
  recipientName: string;
  recipientPhoneNumber: string;
}

export interface UserViolations {
  violationsAmount: number;
  violationsDescription: object;
}

export interface PaymentInfo {
  paidAmount: number;
  paymentInfoDtos: PaymentInfoDto[];
  unPaidAmount: number;
}

export interface PaymentInfoDto {
  amount: number;
  comment: string;
  paymentId: number;
  settlementDate: string;
}

export interface IAddressOrder {
  comment: string;
  district: string;
  entranceNumber: string;
  houseCorpus: string;
  houseNumber: string;
  street: string;
}

export interface IOrderSumDetails {
  bonus: number;
  certificate: string[];
  certificateBonus: number;
  numberOrderFromShop: string[];
  orderComment: string;
  sumAmount: number;
  sumConfirmed: number;
  sumExported: number;
  totalAmount: number;
  totalConfirmed: number;
  totalExported: number;
  totalSumAmount: number;
  totalSumConfirmed: number;
  totalSumExported: number;
}

export interface IUserInfo {
  customerName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientEmail: string;
  totalUserViolations: number;
  userViolationForCurrentOrder: number;
}

export interface UserProfile {
  addressDto: Address;
  recipientEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientSurname: string;
}

export interface IExportDetails {
  allReceivingStations: string[];
  exportedDate: any;
  exportedTime: string;
  receivingStation: string;
}

export interface IDetailStatus {
  date: string;
  orderStatus: string;
  paymentStatus: string;
}

export interface Address {
  actual: boolean;
  city: string;
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  district: string;
  entranceNumber: string;
  houseCorpus: string;
  houseNumber: string;
  id: number;
  street: string;
}

export interface DialogData {
  button: 'add' | 'update';
}

export interface CreateCertificate {
  code: string;
  monthCount: number;
  points: number;
}

export interface IOrderHistory {
  authorName: string;
  eventDate: string;
  eventName: string;
  id: number;
}
