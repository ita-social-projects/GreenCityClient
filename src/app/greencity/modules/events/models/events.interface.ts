import { FormControl } from '@angular/forms';
import { Moment } from 'moment';

export type FormControllers<T> = {
  [K in keyof T]: FormControl<T[K]>;
};

export interface EventDto extends EventForm {
  id?: number;
  organizer?: {
    id: number;
    name: string;
    organizerRating?: number;
    email: string;
  };
  creationDate?: string;
  type?: string;
  isRelevant?: boolean;
  likes?: number;
  dislikes?: number;
  countComments?: number;
  eventRate?: number;
  currentUserGrade?: number;
  open?: boolean;
  isSubscribed?: boolean;
  isFavorite?: boolean;
  isOrganizedByFriend?: boolean;
  title?: string;
  tags?: string[];
  isLiked?: boolean;
  isDisliked?: boolean;
}

export interface EventForm {
  eventInformation: EventInformation;
  dates: Array<DateInformation>;
  titleImage?: string;
  additionalImages?: Array<string>;
  images?: Array<any>;
  dateInformation?: DateInformation;
}

export interface DateInformation {
  day: Moment;
  startDate: Date;
  finishDate: Date;
  startTime: string;
  finishTime: string;
  allDay: boolean;
  minDate: Date;
  maxDate: Date;
  coordinates: PlaceOnline;
  id?: number;
  event?: any;
  onlineLink: string;
  place: string;
  appliedLinkForAll: boolean;
  appliedPlaceForAll: boolean;
}

export interface PlaceOnline {
  latitude?: number;
  longitude?: number;
  streetEn?: string;
  streetUk?: string;
  houseNumber?: string;
  cityEn?: string;
  cityUk?: string;
  regionEn?: string;
  regionUk?: string;
  countryEn?: string;
  countryUk?: string;
  formattedAddressEn?: string;
  formattedAddressUk?: string;
}

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
  editorText: string;
  tags: Array<{
    id?: number;
    name: string;
    nameUk?: string;
    nameEn?: string;
  }>;
}

export interface EventAttender {
  name: string;
  imagePath: string;
}

export interface EventResponseDto {
  currentPage: number;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  last: boolean;
  number: number;
  page: Array<EventResponse>;
  totalElements: number;
  totalPages: number;
}

export interface OrganizerInfo {
  organizerRating: number;
  id: number;
  name: string;
}

export interface LocationResponse {
  countryEn: string;
  countryUk: string;
  latitude: number;
  longitude: number;
  regionEn: string;
  regionUk: string;
  houseNumber: string | null;
  streetEn: string | null;
  streetUk: string | null;
  formattedAddressEn: string;
  formattedAddressUk: string;
  cityEn: string;
  cityUk: string;
}

export interface EventDatesResponse {
  onlineLink: null | string;
  coordinates: LocationResponse | null;
  startDate: string;
  finishDate: string;
  id: null;
  event: null;
}

export interface EventResponse {
  id?: number;
  title?: string;
  organizer: OrganizerInfo;
  creationDate: string;
  description: string;
  dates: EventDatesResponse[];
  tags: { nameUk: string; id: number; nameEn: string }[];
  titleImage: string;
  additionalImages: string[];
  isRelevant: boolean;
  likes: number;
  dislikes: number;
  countComments: number;
  eventRate: number;
  open: boolean;
  isSubscribed: boolean;
  isFavorite: boolean;
  isOrganizedByFriend: boolean;
  currentUserGrade?: number | null;
  isLiked: boolean;
  isDisliked: boolean;
}

export type EventListResponse = Omit<EventResponse, 'additionalImages' | 'description'>;

export interface TagDto {
  id: number;
  nameUk: string;
  nameEn: string;
}

export interface TagObj {
  nameUk: string;
  nameEn: string;
  isActive: boolean;
}

export interface EventFilterCriteriaInterface {
  eventTime: Array<string>;
  cities: Array<string>;
  statuses: Array<string>;
  tags: Array<string>;
}

export interface Addresses {
  cityEn: string;
  cityUk: string;
  countryEn: string;
  countryUk: string;
  formattedAddressEn: string;
  formattedAddressUk: string;
  houseNumber: string;
  latitude: number;
  longitude: number;
  regionEn: string;
  regionUk: string;
  streetEn: string;
  streetUk: string;
}

export interface FilterItem {
  type: string;
  nameUk: string;
  nameEn: string;
}
