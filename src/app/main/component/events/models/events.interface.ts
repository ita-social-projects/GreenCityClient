export interface EventDTO {
  title: string;
  description: string;
  dates: Array<any>;
  onlineLink: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface DateDto {
  title: string;
  date: string;
  time: string;
  allDay: boolean;
}

export interface DateEvent {
  date: string;
  startDate: string;
  finishDate: string;
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
