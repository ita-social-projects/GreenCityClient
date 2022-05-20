export interface EventDTO {
  title: string;
  description: string;
  open: boolean;
  dates: Array<Dates>;
}

export interface Dates {
  startDate: Array<number>;
  finishDate: Array<number>;
  coordinatesDto: {
    latitude: number;
    longitude: number;
  };
  onlineLink: string;
}

export interface DateEvent {
  date: string;
  startDate: string;
  finishDate: string;
  coordinatesDto: {
    latitude: number;
    longitude: number;
  };
  onlineLink: string;
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

export interface OnlineOflineDto {
  latitude: number;
  longitude: number;
  onlineLink: string;
}
