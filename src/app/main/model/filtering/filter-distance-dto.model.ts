export class FilterDistanceDto {
  lat: number;
  lng: number;
  distance: number;

  constructor(lat: number, lng: number, distance: number) {
    this.lat = lat;
    this.lng = lng;
    this.distance = distance;
  }
}
