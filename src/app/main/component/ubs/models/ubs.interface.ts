export interface Bag {
  id: number;
  name?: string;
  capacity?: number;
  price?: number;
  quantity?: number;
  code?: string;
}

export interface OrderBag {
  amount: number;
  id: number;
}

export interface OrderDetails {
  bags?: Bag[];
  points: number;
  pointsToUse?: number;
  certificates?: any;
  additionalOrders?: any;
  orderComment?: string;
  certificatesSum?: number;
  pointsSum?: number;
  total?: number;
  finalSum?: number;
  minAmountOfBigBags?: number;
}

export interface OrderDetailsNotification {
  bags: Bag[];
  points: number;
  pointsToUse?: number;
  certificates?: any;
  additionalOrders?: any;
  orderComment?: string;
  certificatesSum?: number;
  pointsSum?: number;
  total?: number;
  finalSum?: number;
  minAmountOfBigBags?: number;
}

export interface OrderDetailsNotification {
  bags: Bag[];
  addressComment?: string;
  orderBonusDiscount?: number;
  orderCertificateTotalDiscount?: number;
  orderFullPrice?: number;
  orderDiscountedPrice?: number;
  amountOfBagsOrdered?: number;
  recipientName?: string;
  recipientSurname?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  addressCity?: string;
  addressStreet?: string;
  addressDistrict?: string;
}

export interface FinalOrder {
  bags: Bag[];
  pointsToUse?: number;
  cerfiticates?: any;
  additionalOrders?: any;
  orderComment?: string;
  personalData?: PersonalData;
  points?: number;
}

export interface ICertificate {
  certificatePoints: number;
  certificateStatus: string;
  // certificateDate: any
}

export interface PersonalData {
  id?: number;
  ubsUserId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  anotherClientFirstName?: string;
  anotherClientLastName?: string;
  anotherClientEmail?: string;
  anotherClientPhoneNumber?: string;
  addressComment: string;
  city: string;
  district: string;
  street?: string;
  houseCorpus?: string;
  entranceNumber?: string;
  houseNumber?: string;
  longitude?: number;
  latitude?: number;
}

export interface Address {
  actual: boolean;
  id: number;
  city: string;
  district: string;
  street: string;
  houseCorpus: string;
  entranceNumber: string;
  houseNumber: string;
  addressComment?: string;
  longitude?: number;
  latitude?: number;
}

export interface Locations {
  id: number;
  name: string;
  languageCode: string;
}
