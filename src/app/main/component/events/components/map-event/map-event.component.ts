import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Coords, MapMarker } from '../../models/events.interface';

@Component({
  selector: 'app-map-event',
  templateUrl: './map-event.component.html',
  styleUrls: ['./map-event.component.scss']
})
export class MapEventComponent {
  private map: any;
  private isPlaceChoosed = false;
  public places: MapMarker[] = [];

  @Output() location = new EventEmitter<Coords>();

  public onMapReady(map: any): void {
    this.map = map;
    this.setUserLocation();
  }

  private setUserLocation(): void {
    navigator.geolocation.getCurrentPosition(
      (position: any) => {
        this.map.setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        this.map.setCenter({
          lat: 49.84579567734425,
          lng: 24.025124653312258
        });
      }
    );
  }

  public addMarker(value: Coords) {
    if (!this.isPlaceChoosed) {
      this.location.emit(value);
      const newMarker: MapMarker = {
        location: {
          lat: value.coords.lat,
          lng: value.coords.lng
        },
        animation: 'DROP'
      };
      this.places.push(newMarker);
      this.isPlaceChoosed = true;
    }
  }

  public markerOver(marker: MapMarker) {
    marker.animation = 'BOUNCE';
  }
  public markerOut(marker: MapMarker) {
    marker.animation = '';
  }

  public deletePlace() {
    this.places = [];
    this.isPlaceChoosed = false;
  }
}
