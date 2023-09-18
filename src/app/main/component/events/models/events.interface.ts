export interface EventDTO {
  title: string;
  description: string;
  open: boolean;
  datesLocations: Array<Dates>;
  tags: Array<string>;
  imagesToDelete?: Array<string>;
  additionalImages?: Array<string>;
  id?: number;
  organizer?: {
    id: number;
    name: string;
  };
  titleImage?: string;
}

export interface Dates {
  startDate: string;
  finishDate: string;
  coordinates?: {
    cityUa?: 'cityUa';
    cityEn?: 'cityEn';
    addressEn?: string;
    addressUa?: string;
    latitude: number;
    longitude: number;
  } | null;
  onlineLink?: string;
  id?: number;
}

export interface DateEvent {
  date: Date;
  startDate: string;
  finishDate: string;
  coordinatesDto: {
    latitude: number;
    longitude: number;
  };
  onlineLink: string;
  valid: boolean;
  check: boolean;
}

export interface Coords {
  coords: { lat: number; lng: number };
  placeId: number;
}

export interface MapMarker {
  location: {
    lat: number;
    lng: number;
  };
  animation: string;
}

export interface EventImage {
  src: string;
  label: string;
  isLabel: boolean;
}

export interface EventResponseDto {
  currentPage: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  last: boolean;
  number: number;
  page: Array<EventPageResponceDto>;
  totalElements: number;
  totalPages: number;
}

export interface EventPageResponceDto {
  additionalImages: Array<string>;
  dates: Array<DateEventResponceDto>;
  creationDate: string;
  description: any;
  id: number;
  open: boolean;
  organizer: {
    id: number;
    name: string;
    organizerRating: number;
  };
  tags: Array<TagDto>;
  title: string;
  titleImage: string;
  isSubscribed: boolean;
  isFavorite: boolean;
  isActive: boolean;
  isRelevant: boolean;
  countComments: number;
  likes: number;
}

export interface TagDto {
  id: number;
  nameUa: string;
  nameEn: string;
}
export interface DateEventResponceDto {
  coordinates: {
    cityEn: string;
    cityUa: string;
    latitude: number;
    longitude: number;
    countryEn: string;
    countryUa: string;
    houseNumber: number;
    regionEn: string;
    regionUa: string;
    streetEn: string;
    streetUa: string;
  };
  event: string;
  finishDate: string;
  id: number;
  onlineLink: string;
  startDate: string;
}

export interface OfflineDto {
  latitude: number;
  longitude: number;
}

export interface TagObj {
  nameUa: string;
  nameEn: string;
  isActive: boolean;
}

export interface DateFormObj {
  date: Date;
  endTime?: string;
  onlineLink?: string;
  place: string;
  startTime?: string;
  coordinatesDto?: {
    latitude: number;
    longitude: number;
  };
}

export interface PagePreviewDTO {
  title: string;
  description: string;
  open: boolean;
  datesLocations: DateEvent[];
  tags: Array<string>;
  imgArray: any[];
  location: DateFormObj;
}

export interface InitialStartDate {
  initialDate: Date;
  initialStartTime: string;
}
export interface EventFilterCriteriaIntarface {
  eventTime: Array<string>;
  cities: Array<string>;
  statuses: Array<string>;
  tags: Array<string>;
}
