export interface EventDTO {
  title: string;
  content: string;
  dates: Array<any>;
  onlineLink: string;
  location: {
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
  title: string;
  date: Date;
  timeStart: string;
  timeEnd: string;
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
