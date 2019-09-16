import {Component, OnInit} from '@angular/core';
import {LatLngBounds} from '@agm/core';
import {Place} from '../../../model/place/place';
import {MapBounds} from '../../../model/map/map-bounds';
import {PlaceService} from '../../../service/place/place.service';
import {PlaceInfo} from '../../../model/place/place-info';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {FavoritePlaceService} from '../../../service/favorite-place/favorite-place.service';
import {FavoritePlaceSave} from '../../../model/favorite-place/favorite-place-save';

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
  map: any;
  origin: any;
  destination: any;
  geoLocation: any;
  directionButton: boolean;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
              private placeService: PlaceService,
              private favoritePlaceService: FavoritePlaceService
  ) {
    iconRegistry
      .addSvgIcon(
        'star-white'
        ,
        sanitizer
          .bypassSecurityTrustResourceUrl(
            'assets/img/icon/favorite-place/star-white.svg'
          ));
    iconRegistry
      .addSvgIcon(
        'star-yellow'
        ,
        sanitizer
          .bypassSecurityTrustResourceUrl(
            'assets/img/icon/favorite-place/star-yellow.svg'
          ));

  }

  getDirection(p: Place) {
    this.setCurrentLocation();
    this.origin = {lat: this.lat, lng: this.lng};
    console.log('log');
    console.log(this.place[0]);
    this.destination = {lat: p.location.lat, lng: p.location.lng};
  }

  ngOnInit() {
    this.mapBounds = new MapBounds();
    this.setCurrentLocation();
  }

  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('AllFavoritePlaces'));

  }


  setCurrentLocation(): Position {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 13;
        return position;
      });
    }
    return null;
  }


  boundsChange(latLngBounds: LatLngBounds) {
    this.mapBounds.northEastLat = latLngBounds.getNorthEast().lat();
    this.mapBounds.northEastLng = latLngBounds.getNorthEast().lng();
    this.mapBounds.southWestLat = latLngBounds.getSouthWest().lat();
    this.mapBounds.southWestLng = latLngBounds.getSouthWest().lng();
  }

  setMarker(place: any) {
    this.button = true;
    this.place = null;
    this.place = [place];
  }

  showAll() {
    this.origin = null;
    this.button = !this.button;
    this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => {
      this.place = res;
      this.getDistanceToPlaces();
    });
    this.searchText = null;
    console.log(this.place);
  }

  showDetail(p: number) {
    this.directionButton = true;
    this.placeService.getPlaceInfo(p).subscribe((res) => {
        this.placeInfo = res;
        this.place.forEach(place => {
          if (place.id === p) {
            this.placeInfo.location.distanceFromUser = place.location.distanceFromUser;
          }
        });
      }
    );
    this.place = this.place.filter(r => {
      return r.id === p;
    });
    if (this.place.length === 1 && this.button !== true) {
      this.button = !this.button;
    }
  }

  savePlaceAsFavorite(placeId: number, name: string) {
    console.log('savePlaceAsFavorite placeId=' + placeId);
    this.favoritePlaceService.saveFavoritePlace(new FavoritePlaceSave(placeId, name)).subscribe();
  }

  getList() {
    if (this.button !== true) {
      this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => {
        this.place = res;
        this.getDistanceToPlaces();
      });
      this.searchText = null;
    }
  }

  private getDistanceToPlaces() {
    this.place.forEach(place => {
      console.log(place);
      const placeLocation = new google.maps.LatLng(place.location.lat, place.location.lng);
      const userLocation = new google.maps.LatLng(this.lat, this.lng);
      const distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(placeLocation, userLocation) / 1000);
      console.log(distance);
      place.location.distanceFromUser = distance;
    });
  }
}
