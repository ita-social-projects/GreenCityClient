import { PlaceLocation } from './location.model';
export class Place {
  id: number;
  name: string;
  location: PlaceLocation;
  favorite?: boolean;
}

export interface FilterPlaceCategories {
  id: number;
  name: string;
  nameUa: string;
}

export interface AllAboutPlace {
  author: {
    email: string;
    id: number;
    name: string;
  };
  category: {
    name: string;
    nameUa: string;
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
