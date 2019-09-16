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
import {CategoryDto} from '../../../model/category.model';
import {Specification} from '../../../model/specification/specification';

interface Location {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  category: CategoryDto;
  specification: Specification;
  placeInfo: PlaceInfo;
  button = false;
  mapBounds: MapBounds;
  searchText;
  lat = 49.841795;
  lng = 24.031706;
  zoom = 13;
  place: Place[] = [];
  userMarkerLocation: Location;
  map: any;
  isFilter = false;
  origin: any;
  destination: any;
  directionButton: boolean;
  navigationMode = false;
  navigationButton = 'Navigate to place';
  travelMode = 'WALKING';
  travelModeButton = 'DRIVING';
  distance;
  icon = 'assets/img/icon/blue-dot.png';

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
              private placeService: PlaceService,
              private favoritePlaceService: FavoritePlaceService) {
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

    this.category = new CategoryDto();
    this.category.name = 'Food';
    this.specification = new Specification('Own Cup');
  }

  getDirection(p: Place) {
    if (this.navigationMode === false) {
      this.navigationButton = 'Close navigation';
      this.navigationMode = true;
      this.destination = {lat: p.location.lat, lng: p.location.lng};
      this.origin = {lat: this.userMarkerLocation.lat, lng: this.userMarkerLocation.lng};
    } else {
      this.navigationMode = false;
      this.navigationButton = 'Navigate to place';
    }
  }


  ngOnInit() {
    this.mapBounds = new MapBounds();
    this.setCurrentLocation();
    this.userMarkerLocation = {lat: this.lat, lng: this.lng};
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
        this.userMarkerLocation = {lat: this.lat, lng: this.lng};
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
    this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => this.place = res);
    this.searchText = null;
  }

  showDetail(p: number) {
    this.directionButton = true;
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

  savePlaceAsFavorite(placeId: number, name: string) {
    console.log('savePlaceAsFavorite placeId=' + placeId);
    this.favoritePlaceService.saveFavoritePlace(new FavoritePlaceSave(placeId, name)).subscribe();
  }

  getList() {
    if (!this.isFilter) {
      if (this.button !== true) {
        this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => this.place = res);
        this.searchText = null;
      }
    }
  }


  toggleFilter() {
    this.isFilter = !this.isFilter;
  }

  setLocationToOrigin(location) {
    this.userMarkerLocation.lat = location.coords.lat;
    this.userMarkerLocation.lng = location.coords.lng;
    if (this.place.length === 1) {
      this.destination = {lat: this.place[0].location.lat, lng: this.place[0].location.lng};
      this.origin = {lat: this.userMarkerLocation.lat, lng: this.userMarkerLocation.lng};
    }
  }

  changeTravelMode() {
    this.travelMode = (this.travelMode === 'WALKING') ? 'DRIVING' : 'WALKING';
    this.travelModeButton = (this.travelModeButton === 'DRIVING') ? 'WALKING' : 'DRIVING';
  }
}
