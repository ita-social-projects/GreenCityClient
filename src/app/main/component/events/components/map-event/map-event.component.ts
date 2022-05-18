import { MapsAPILoader } from '@agm/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Coords, MapMarker } from '../../models/events.interface';

@Component({
  selector: 'app-map-event',
  templateUrl: './map-event.component.html',
  styleUrls: ['./map-event.component.scss']
})
export class MapEventComponent implements OnInit {
  private map: any;
  private isPlaceChoosed: boolean;
  private geoCoder: any;

  public eventPlace: MapMarker;
  public adress: string;
  public markerContent: string;
  public mapDeactivate: boolean;

  @Output() location = new EventEmitter<Coords>();

  constructor(private mapsAPILoader: MapsAPILoader) {}

  ngOnInit(): void {
    this.isPlaceChoosed = false;
    this.mapDeactivate = false;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
    });
  }

  public onMapReady(map: any): void {
    this.map = map;
    this.setUserLocation();
  }

  public showCurLocation() {
    this.setUserLocation();
  }

  private setUserLocation(): void {
    navigator.geolocation.getCurrentPosition((position: any) => {
      this.mapDeactivate
        ? this.map.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        : this.map.setCenter({
            lat: 49.84579567734425,
            lng: 24.025124653312258
          });
    });
  }

  public addMarker(value: Coords): void {
    if (!this.isPlaceChoosed) {
      this.location.emit(value);
      const newMarker: MapMarker = {
        location: {
          lat: value.coords.lat,
          lng: value.coords.lng
        },
        animation: 'DROP'
      };

      this.getAddress(value.coords.lat, value.coords.lng);

      this.eventPlace = newMarker;
      this.isPlaceChoosed = true;
    }
  }

  public markerOver(marker: MapMarker): void {
    this.markerContent = this.adress;
    marker.animation = 'BOUNCE';
  }
  public markerOut(marker: MapMarker): void {
    this.markerContent = '';
    marker.animation = '';
  }

  public deletePlace(): void {
    this.eventPlace = null;
    this.isPlaceChoosed = false;
    this.adress = '';
  }

  getAddress(latitude: number, longitude: number): void {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      status === 'OK'
        ? results[0]
          ? (this.adress = results[0].formatted_address)
          : window.alert('No results found')
        : window.alert('Geocoder failed due to: ' + status);
    });
  }
}
