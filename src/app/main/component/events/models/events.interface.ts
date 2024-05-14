import { FormControl } from '@angular/forms';

type FormControllers<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export interface FormEmitter<T> {
  key: any;
  form: T | undefined;
  valid: boolean;
  sharedKey: number;
  formKey: string;
}

export type FormCollectionEmitter<T> = Omit<FormEmitter<T>, 'sharedKey' | 'formKey'>;

export interface DateTime {
  date: Date;
  startTime: string;
  endTime: string;
  allDay: boolean;
}

export type DateTimeGroup = FormControllers<DateTime>;

export interface PlaceOnline {
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  onlineLink: string;
  place: string;
}

export type PlaceOnlineGroup = FormControllers<PlaceOnline>;
export type DateInformation = { dateTime: DateTime; placeOnline: PlaceOnline };

export interface ImagesContainer {
  file: File;
  url: string;
  main: boolean;
}

export interface EventInformation {
  title: string;
  duration: number;
  description: string;
  open: boolean;
  tags: string[];
  editorText: string;
  images: ImagesContainer[];
}

export type EventInformationGroup = FormControllers<EventInformation>;

export type EventForm = { dateInformation: DateInformation[]; eventInformation: EventInformation };

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

export interface DateFormInformation {
  date: Date;

  allDay: boolean;
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

export interface EventResponseDto {
  currentPage: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  last: boolean;
  number: number;
  page: Array<EventPageResponseDto>;
  totalElements: number;
  totalPages: number;
}

export interface Organizer {
  organizerRating: number;
  id: number;
  name: string;
}

export interface EventPageResponseDto {
  additionalImages: Array<string>;
  dates: Array<DateEventResponseDto>;
  creationDate: string;
  description: any;
  eventRate: number;
  id: number;
  open: boolean;
  location?: DateFormObj;
  imgArray?: any[];
  editorText: string;
  imgArrayToPreview: string[];
  organizer: Organizer;
  tags: Array<TagDto>;
  title: string;
  titleImage: string;
  isSubscribed: boolean;
  isFavorite: boolean;
  isActive: boolean;
  isRelevant: boolean;
  countComments: number;
  likes: number;
  isOrganizedByFriend: boolean;
}

export interface TagDto {
  id: number;
  nameUa: string;
  nameEn: string;
}

export interface Coordinates {
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
  formattedAddressEn: string;
  formattedAddressUa: string;
}

export interface DateEventResponseDto {
  coordinates: Coordinates;
  event: string;
  finishDate: string;
  id: number;
  onlineLink: string;
  startDate: string;
  check?: boolean;
  valid: boolean;
}

export interface TagObj {
  nameUa: string;
  nameEn: string;
  isActive: boolean;
}

export interface DateFormObj {
  date: Date;
  finishDate?: string;
  onlineLink?: string;
  place: string;
  startDate?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PagePreviewDTO {
  title: string;
  description: string;
  eventDuration: number;
  open: boolean;
  isRelevant?: boolean;
  id?: number;
  editorText: string;
  organizer?: Organizer;
  dates: Dates[];
  tags: any;
  imgArray: any[];
  imgArrayToPreview: any[];
  location: string;
}

export interface EventFilterCriteriaInterface {
  eventTime: Array<string>;
  cities: Array<string>;
  statuses: Array<string>;
  tags: Array<string>;
}

export interface Addresses {
  cityEn: string;
  cityUa: string;
  countryEn: string;
  countryUa: string;
  formattedAddressEn: string;
  formattedAddressUa: string;
  houseNumber: string;
  latitude: number;
  longitude: number;
  regionEn: string;
  regionUa: string;
  streetEn: string;
  streetUa: string;
}

export interface FilterItem {
  type: string;
  nameUa: string;
  nameEn: string;
}
