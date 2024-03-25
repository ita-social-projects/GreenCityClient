export interface Bag {
  id: number;
  name?: string;
  nameEng?: string;
  capacity?: number;
  price?: number;
  quantity?: number;
  code?: string;
  limitedIncluded?: boolean;
}

export interface Order {
  additionalOrders: Array<string>;
  addressId: number;
  bags: OrderBag[];
  certificates: Array<string>;
  locationId: number;
  orderComment: string;
  personalData: PersonalData;
  pointsToUse: number;
  shouldBePaid: boolean;
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

export interface IProcessOrderResponse {
  orderId: number;
  link: string | null;
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
  isAnotherClient: boolean;
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
  addressRegionDistrictList?: DistrictsDtos[];
  searchAddress?: string;
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  display?: boolean;
  placeId?: string;
}

export interface AddressData {
  searchAddress: string;
  districtEn: string;
  district: string;
  regionEn: string;
  region: string;
  houseNumber: string;
  entranceNumber: string;
  houseCorpus: string;
  addressComment: string;
  placeId: string;
  city: string;
  cityEn: string;
  street: string;
  streetEn: string;
}

export interface CourierTranslationDtos {
  languageCode: string;
  limitDescription: string;
  name: string;
}

export interface LocationTranslation {
  region: number;
  locationName: string;
  languageCode: string;
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
  courierLimit: 'LIMIT_BY_AMOUNT_OF_BAG' | 'LIMIT_BY_SUM_OF_ORDER';
  courierStatus: string;
  tariffInfoId: number;
  locationsDtosList: LocationsDtosList[];
  courierTranslationDtos: CourierTranslation[];
  regionDto: {
    nameEn: string;
    nameUk: string;
    regionId: number;
  };
  min: number;
  max: number;
}

export interface ActiveLocations {
  locationId: number;
  nameEn: string;
  nameUk: string;
}

export interface DistrictsDtos {
  nameUa: string;
  nameEn: string;
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

export interface SearchAddress {
  input: string;
  street: string;
  city: string;
}

export interface ActiveCourierDto {
  courierId: number;
  courierStatus: string;
  nameUk: string;
  nameEn: string;
  createDate: string;
  createdBy: string;
}

export enum KyivNamesEnum {
  KyivRegionUa = 'Київська область',
  KyivRegionEn = 'Kyiv oblast',
  KyivCityUa = 'місто Київ',
  KyivUa = 'Київ',
  KyivEn = 'Kyiv'
}

export enum DistrictEnum {
  UA = ' район',
  EN = ' district'
}
