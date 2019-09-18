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
import {FilterPlaceService} from '../../../service/filtering/filter-place.service';

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

  placeInfo: PlaceInfo;
  button = false;
  searchText;
  lat = 49.841795;
  lng = 24.031706;
  zoom = 13;
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
              private filterService: FilterPlaceService,
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

    this.filterService.setCategoryName('Food');
    this.filterService.setSpecName('Own cup');
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
    this.filterService.mapBounds = new MapBounds();
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
    this.filterService.setMapBounds(latLngBounds);
  }

  setMarker(place: any) {
    this.button = true;
    this.placeService.places = null;
    this.placeService.places = [place];
  }

  showAllPlaces() {
    this.origin = null;
    this.button = !this.button;
    this.placeService.getFilteredPlaces();
    console.log(this.placeService.places);
    this.searchText = null;
  }

  clearFilters() {
    this.filterService.clearDiscountRate();
    this.placeService.getFilteredPlaces();
  }

  showDetail(p: number) {
    this.directionButton = true;
    this.placeService.getPlaceInfo(p).subscribe((res) => {
        this.placeInfo = res;
      }
    );
    this.placeService.places = this.placeService.places.filter(r => {
      return r.id === p;
    });
    if (this.placeService.places.length === 1 && this.button !== true) {
      this.button = !this.button;
    }
  }

  savePlaceAsFavorite(placeId: number, name: string) {
    console.log('savePlaceAsFavorite placeId=' + placeId);
    this.favoritePlaceService.saveFavoritePlace(new FavoritePlaceSave(placeId, name)).subscribe();
  }

  getList() {
    if (this.button !== true) {
      this.placeService.getFilteredPlaces();
      console.log(this.placeService.places);
      this.searchText = null;
    }
  }

  toggleFilter() {
    this.isFilter = !this.isFilter;
  }

  setLocationToOrigin(location) {
    this.userMarkerLocation.lat = location.coords.lat;
    this.userMarkerLocation.lng = location.coords.lng;
    if (this.placeService.places.length === 1) {
      this.destination = {lat: this.placeService.places[0].location.lat, lng: this.placeService.places[0].location.lng};
      this.origin = {lat: this.userMarkerLocation.lat, lng: this.userMarkerLocation.lng};
    }
  }

  changeTravelMode() {
    this.travelMode = (this.travelMode === 'WALKING') ? 'DRIVING' : 'WALKING';
    this.travelModeButton = (this.travelModeButton === 'DRIVING') ? 'WALKING' : 'DRIVING';
  }
}
