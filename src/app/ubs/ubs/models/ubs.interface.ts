export interface Bag {
  id: number;
  name?: string;
  nameEng?: string;
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
  addressCityEn?: string;
  addressStreet?: string;
  addressStreetEn?: string;
  addressDistrict?: string;
  addressDistrictEn?: string;
  addressRegion?: string;
  addressRegionEn?: string;
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

export interface Certificate {
  codes: Array<string>;
  points: Array<number>;
  activatedStatus: Array<boolean>;
  creationDates: Array<string>;
  dateOfUses?: Array<string>;
  expirationDates?: Array<string>;
  failed: Array<boolean>;
  status: Array<string>;
  error: Array<boolean>;
}

export interface ICertificateResponse {
  points: number;
  certificateStatus: string;
  creationDate?: string;
  dateOfUse?: string;
  expirationDate?: string;
  code?: string;
}

export interface PersonalData {
  id?: number;
  ubsUserId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addressComment: string;
  city: string;
  cityEn: string;
  district: string;
  districtEn: string;
  street?: string;
  streetEn?: string;
  region?: string;
  regionEn?: string;
  houseCorpus?: string;
  entranceNumber?: string;
  houseNumber?: string;
  longitude?: number;
  latitude?: number;
  senderEmail: string;
  senderFirstName: string;
  senderLastName: string;
  senderPhoneNumber: string;
}

export interface Address {
  id?: number;
  city: string;
  cityEn: string;
  district: string;
  districtEn: string;
  region: string;
  regionEn: string;
  entranceNumber: string;
  street: string;
  streetEn: string;
  houseCorpus: string;
  houseNumber: string;
  addressComment?: string;
  actual: boolean;
  searchAddress?: string;
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
}

export interface AddressData {
  addressComment: string;
  districtEn: string;
  district: string;
  entranceNumber: string;
  houseCorpus: string;
  houseNumber: string;
  regionEn: string;
  region: string;
  searchAddress: string;
}

export interface Locations {
  id: number;
  name: string;
  languageCode: string;
}

export interface CourierTranslationDtos {
  languageCode: string;
  limitDescription: string;
  name: string;
}
export interface CourierDtos {
  courierId: number;
  courierStatus: string;
  courierTranslationDtos: CourierTranslationDtos[];
}

export interface LocationTranslation {
  region: number;
  locationName: string;
  languageCode: string;
}

export interface LocationsDtos {
  locationId: number;
  locationStatus: string;
  locationTranslationDtoList: LocationTranslation[];
}
export interface LocationsName {
  locationId: number;
  locationName: string;
}

export interface LocationsDtosList {
  locationId: number;
  nameEn: string;
  nameUk: string;
}

export interface CourierTranslation {
  languageCode: string;
  name: string;
}
export interface CourierLocations {
  courierLimit: string;
  courierStatus: string;
  tariffInfoId: number;
  locationsDtosList: LocationsDtosList[];
  courierTranslationDtos: CourierTranslation[];
  regionDto: {
    nameEn: string;
    nameUk: string;
    regionId: number;
  };
  maxAmountOfBigBags: number;
  maxPriceOfOrder: number;
  minAmountOfBigBags: number;
  minPriceOfOrder: number;
}

export interface ActiveLocations {
  locationId: number;
  nameEn: string;
  nameUk: string;
}

export interface ActiveLocationsDtos {
  locations: ActiveLocations[];
  nameEn: string;
  nameUk: string;
  regionId: number;
}

export interface AllLocationsDtos {
  allActiveLocationsDtos: ActiveLocationsDtos[] | null;
  tariffsForLocationDto: CourierLocations | null;
  orderIsPresent: boolean;
}
