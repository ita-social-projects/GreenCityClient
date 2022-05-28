export interface EventDTO {
  title: string;
  description: string;
  open: boolean;
  datesLocations: Array<Dates>;
  tags: Array<string>;
}

export interface Dates {
  startDate: string;
  finishDate: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  onlineLink: string;
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
  coordinates: {
    latitude: number;
    longitude: number;
  };
  dates: Array<DateEventResponceDto>;
  description: any;
  id: number;
  onlineLink: string;
  open: boolean;
  organizer: {
    id: number;
    name: string;
  };
  title: string;
  titleImage: string;
}

export interface DateEventResponceDto {
  eventDto: string;
  finishDate: string;
  id: number;
  startDate: string;
}

export interface OfflineDto {
  latitude: number;
  longitude: number;
}

export interface TagObj {
  name: string;
  isActive: boolean;
}

export interface DateFormObj {
  date: Date;
  endTime?: string;
  onlineLink?: string;
  place: string;
  startTime?: string;
}
