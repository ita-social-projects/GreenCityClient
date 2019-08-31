import {Component, OnInit} from '@angular/core';
import {LatLngBounds} from '@agm/core';
import {BoundsMap} from '@agm/core/services/fit-bounds';
import {Place} from '../../../model/place/place';
import {PlaceServiceService} from '../../../service/place/place.service';
import {MapBounds} from '../../../model/map/map-bounds';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  button = false;
  mapBounds: MapBounds;
  searchText;
  lat = 49.841795;
  lng = 24.031706;
  zoom = 13;
  place: Place[] = [];

  constructor(private placeService: PlaceServiceService) {
  }

  zoomChange(event) {
    console.log('zoom is change ');
    console.log(event);
  }

  ngOnInit() {
    this.mapBounds = new MapBounds();
    this.setCurrentLocation();
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 13;
      });
    }
  }


  boundsChange(latLngBounds: LatLngBounds) {
    this.mapBounds.northEastLat = latLngBounds.getNorthEast().lat();
    this.mapBounds.northEastLng = latLngBounds.getNorthEast().lng();
    this.mapBounds.southWestLat = latLngBounds.getSouthWest().lat();
    this.mapBounds.southWestLng = latLngBounds.getSouthWest().lng();
    if (this.button === true) {
      console.log('here');
      console.log('size 1');
      console.log(latLngBounds.getNorthEast().lat());
      console.log(latLngBounds.getNorthEast().lng());
      console.log(latLngBounds.getSouthWest().lat());
      console.log(latLngBounds.getSouthWest().lng());
    } else {
      this.placeService.gerListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => this.place = res);
      console.log(this.place);
    }

  }

  setMarker(place: any) {
    this.button = true;
    console.log(place);
    this.place = null;
    this.place = [place];
  }

  showAll() {
    this.button = !this.button;
    console.log(this.button);
    console.log('theeeeeee');
    this.placeService.gerListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => this.place = res);
    this.searchText = null;
  }

  Show() {
    this.button = !this.button;
  }
}
