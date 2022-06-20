export interface Bag {
  name?: string;
  nameEng?: string;
  capacity: number;
  price: number;
  commission: number;
  description?: string;
  languageId?: 1;
  id?: number;
  fullPrice?: number;
  languageCode?: string;
  quantity?: number;
  langCode?: string;
  createdAt?: string;
  locationId?: number;
  createdBy?: string;
  tariffTranslationDtoList?: [
    {
      description: string;
      languageId: number;
      name: string;
    },
    {
      description: string;
      languageId: number;
      name: string;
    }
  ];
}

export interface Service {
  price: number;
  capacity?: number;
  commission: number;
  description?: string;
  name?: string;
  languageCode?: string;
  id?: number;
  fullPrice?: number;
  locationId?: number;
  serviceTranslationDtoList?: [
    {
      description: string;
      languageId: number;
      name: string;
    },
    {
      description: string;
      languageId: number;
      name: string;
    }
  ];
}

export interface Locations {
  locationsDto: LocationDto[];
  regionId: number;
  regionTranslationDtos: {
    regionName: string;
    languageCode: string;
  };
}

export interface LocationDto {
  latitude: number;
  locationId: number;
  locationTranslationDtoList: Location[];
  longitude: number;
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
  location: Location[];
  locationId: number;
  regionId: number;
}

export interface CreateCard {
  courierId: number;
  locationIdList: Array<number>;
  receivingStationsIdList: Array<number>;
  regionId: number;
}
