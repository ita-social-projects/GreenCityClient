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
  date?: Date;
  startDate: string;
  finishDate: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  onlineLink?: string;
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
  page: Array<EventPageResponseDto>;
  totalElements: number;
  totalPages: number;
}

export interface Organizer {
  id: number;
  name: string;
  organizerRating: number;
}

export interface EventPageResponseDto {
  additionalImages: Array<string>;
  dates: Array<DateEventResponseDto>;
  creationDate: string;
  description: any;
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

export interface OfflineDto {
  lat: number;
  lng: number;
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
  dates: DateEvent[];
  tags: Array<string>;
  imgArray: any[];
  imgArrayToPreview: any[];
  location: DateFormObj;
}

export interface InitialStartDate {
  initialDate: Date;
  initialStartTime: string;
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
