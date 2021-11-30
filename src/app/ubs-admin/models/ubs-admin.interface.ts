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

export interface IOrderInfo {
  generalOrderInfo: IGeneralOrderInfo;
  userInfoDto: IUserInfo;
  addressExportDetailsDto: IAddressExportDetails;
  addressComment: string;
  amountOfBagsConfirmed: Map<string, number>;
  amountOfBagsExported: Map<string, number>;
  amountOfBagsOrdered: Map<string, number>;
  bags: IBags[];
  courierPricePerPackage: number;
  courierInfo: ICourierInfo;
  orderBonusDiscount: number;
  orderCertificateTotalDiscount: number;
  orderDiscountedPrice: number;
  orderExportedDiscountedPrice: number;
  orderExportedPrice: number;
  orderFullPrice: number;
  certificates: string[];
  numbersFromShop: string[];
  comment: string;
  paymentTableInfoDto: IPaymentInfo;
  exportDetailsDto: IExportDetails;
  employeePositionDtoRequest: IResponsiblePersons;
}

export interface ICourierInfo {
  courierLimit: 'LIMIT_BY_AMOUNT_OF_BAG' | 'LIMIT_BY_SUM_OF_ORDER';
  maxAmountOfBigBags: number;
  maxPriceOfOrder: number;
  minAmountOfBigBags: number;
  minPriceOfOrder: number;
}

export interface IOrderDetails {
  bags: IBags[];
  courierInfo: ICourierInfo;
  bonuses: number;
  certificateDiscount: number;
  orderFullPrice: number;
  courierPricePerPackage: number;
}

export interface IBags {
  capacity: number;
  id: number;
  name: string;
  price: number;
  planned?: number;
  confirmed?: number;
  actual?: number;
}

export interface IGeneralOrderInfo {
  id: number;
  dateFormed: string;
  adminComment: string;
  orderStatus: string;
  orderStatusName: string;
  orderStatusesDtos: IOrderStatusesDtos[];
  orderPaymentStatus: string;
  orderPaymentStatusName: string;
  orderPaymentStatusesDto: IOrderPaymentStatusesDto[];
}

export interface IOrderStatusesDtos {
  ableActualChange: boolean;
  key: string;
  translation: string;
}

export interface IOrderPaymentStatusesDto {
  key: string;
  translation: string;
}

export interface IUserInfo {
  customerEmail: string;
  customerName: string;
  customerPhoneNumber: string;
  customerSurName: string;
  recipientEmail: string;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientSurName: string;
  totalUserViolations: number;
  userViolationForCurrentOrder: number;
}

export interface IAddressExportDetails {
  addressCity: string;
  addressDistrict: string;
  addressEntranceNumber: number;
  addressHouseCorpus: number;
  addressHouseNumber: number;
  addressRegion: string;
  addressStreet: string;
  id: number;
}

export interface IPaymentInfo {
  overpayment: number;
  paidAmount: number;
  paymentInfoDtos: IPaymentInfoDtos[];
  unPaidAmount: number;
}

export interface IPaymentInfoDtos {
  amount: number;
  comment: string;
  paymentId: number;
  settlementdate: string;
}

export interface IExportDetails {
  allReceivingStations: string[];
  exportedDate: string;
  exportedTime: string;
  receivingStation: string;
}

export interface IResponsiblePersons {
  allPositionsEmployees: Map<string, string[]>;
  currentPositionEmployees: Map<string, string>;
  orderId: number;
}

export interface IOrderHistory {
  authorName: string;
  eventDate: string;
  eventName: string;
  id: number;
}

export interface IOrderStatusInfo {
  key: string;
  ableActualChange: boolean;
  translation: string;
}

export interface UserViolations {
  violationsAmount: number;
  violationsDescription: object;
}

export interface UserProfile {
  addressDto: Address;
  recipientEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientSurname: string;
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
