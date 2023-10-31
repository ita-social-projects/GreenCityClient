export interface Bag {
  name?: string;
  nameEng?: string;
  capacity: number;
  price: number;
  limitIncluded?: boolean;
  commission: number;
  description?: string;
  descriptionEng?: string;
  languageId?: 1;
  id?: number;
  fullPrice?: number;
  languageCode?: string;
  quantity?: number;
  langCode?: string;
  createdAt?: string;
  locationId?: number;
  createdBy?: string;
  tariffTranslationDtoList?: {
    name: string;
    description: string;
    descriptionEng: string;
    nameEng: string;
  };
}

export interface BagLimitDto {
  id: number;
  limitIncluded: boolean;
}

export interface ILimit {
  bagLimitDtoList: BagLimitDto[];
  courierLimit: string;
  limitDescription: string;
  min: number;
  max: number;
}

export interface Service {
  price: number;
  description?: string;
  descriptionEng?: string;
  name?: string;
  nameEng?: string;
  languageCode?: string;
  id?: number;
  tariffId?: number;
}

export interface Stations {
  id: number;
  name: string;
  stationStatus: string;
  createdBy: string;
  createDate: string;
}

export interface Couriers {
  courierId: number;
  courierStatus?: string;
  nameUk: string;
  nameEn: string;
  createDate?: string;
  createdBy?: string;
}

export interface Locations {
  locationsDto: LocationDto[];
  regionId: number;
  regionTranslationDtos: RegionTranslationDto[];
}

export interface RegionTranslationDto {
  regionName: string;
  languageCode: string;
}

export interface LocationDto {
  latitude: number;
  locationId: number;
  locationStatus: string;
  locationTranslationDtoList: Location[];
  longitude: number;
}

export interface DeactivateCard {
  cities: string;
  courier: number | undefined;
  regions: string;
  stations: string;
}

export interface CreateLocation {
  addLocationDtoList: Location[];
  latitude: number;
  longitude: number;
  regionTranslationDtos: Region[];
}

interface Region {
  languageCode: string;
  regionName: string;
}

interface Location {
  languageCode: string;
  locationName: string;
}

export interface EditLocationName {
  nameEn: string;
  nameUa: string;
  locationId: number;
}

export interface CreateCard {
  courierId: number;
  locationIdList: Array<number>;
  receivingStationsIdList: Array<number>;
  regionId: number;
}

export interface TariffCard {
  cardId: number;
  regionDto: RegionDto;
  locationInfoDtos: LocationInfoDtos[];
  receivingStationDtos: Stations[];
  courierDto: Couriers;
  tariffStatus: string;
  limitDescription?: string;
  creator: string;
  createdAt: string;
  courierLimit: string;
  min: number;
  max: number;
}

export interface RegionDto {
  regionId: number;
  nameEn: string;
  nameUk: string;
}

export interface LocationInfoDtos {
  locationId: number;
  nameEn: string;
  nameUk: string;
}

export interface SelectedItems {
  id: number;
  name: string;
  nameUa?: string;
}

export interface Card {
  cardId: number;
  courier: string;
  region: string;
  regionId: number;
  city: string[];
  station: string[];
  tariff: string;
}

export interface TranslationDto {
  locationName?: string;
  regionName?: string;
  languageCode: string;
}

export interface City {
  id: number;
  locationTranslationDtoList: { locationName: string; languageCode: string }[];
  name: string;
}

export interface FilterData {
  positions: Array<number>;
  regions: Array<number>;
  locations: Array<number>;
  couriers: Array<number>;
  employeeStatus: string;
}
