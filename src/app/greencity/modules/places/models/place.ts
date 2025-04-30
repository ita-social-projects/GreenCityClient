import { PlaceLocation } from './location.model';
export class Place {
  id: number;
  name: string;
  location: PlaceLocation;
  favorite?: boolean;
}

export interface FilterPlaceCategories {
  id: number;
  nameEn: string;
  nameUk: string;
}

export interface AllAboutPlace {
  author: {
    email: string;
    id: number;
    name: string;
  };
  category: {
    nameEn: string;
    nameUk: string;
    parentCategoryId: number;
  };
  id: number;
  location: {
    address: string;
    id: number;
    lat: number;
    lng: number;
  };
  modifiedDate: string;
  name: string;
  openingHoursList: [
    {
      breakTime: {
        endTime: string;
        startTime: string;
      };
      closeTime: {
        hour: number;
        minute: number;
        nano: number;
        second: number;
      };
      id: number;
      openTime: {
        hour: number;
        minute: number;
        nano: number;
        second: number;
      };
      weekDay: string;
    }
  ];
  status: string;
  isFavorite: boolean;
}
