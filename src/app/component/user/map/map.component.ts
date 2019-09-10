import {Component, OnInit} from '@angular/core';
import {LatLngBounds} from '@agm/core';
import {Place} from '../../../model/place/place';
import {MapBounds} from '../../../model/map/map-bounds';
import {PlaceService} from '../../../service/place/place.service';
import {PlaceInfo} from '../../../model/place/place-info';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  placeInfo: PlaceInfo;
  button = false;
  mapBounds: MapBounds;
  searchText;
  lat = 49.841795;
  lng = 24.031706;
  zoom = 13;
  place: Place[] = [];

  constructor(private placeService: PlaceService) {
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
    } else {
      this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => this.place = res);
      console.log(this.place);
    }

  }

  setMarker(place: any) {
    this.button = true;
    this.place = null;
    this.place = [place];
  }

  showAll() {
    this.button = !this.button;
    this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => this.place = res);
    this.searchText = null;
  }

  Show() {
    this.button = !this.button;
  }

  showDetail(p: number) {
    this.placeService.getPlaceInfo(p).subscribe((res) => {
        this.placeInfo = res;
      }
    );
    this.place = this.place.filter(r => {
      return r.id === p;
    });
    if (this.place.length === 1 && this.button !== true) {
      this.button = !this.button;
    }
  }


}
