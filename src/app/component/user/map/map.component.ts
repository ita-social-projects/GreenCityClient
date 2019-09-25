import {Component, OnInit} from '@angular/core';
import {LatLngBounds} from '@agm/core';
import {Place} from '../../../model/place/place';
import {MapBounds} from '../../../model/map/map-bounds';
import {PlaceService} from '../../../service/place/place.service';
import {PlaceInfo} from '../../../model/place/place-info';
import {MatDialog, MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {FavoritePlaceService} from '../../../service/favorite-place/favorite-place.service';
import {UserService} from '../../../service/user/user.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {FavoritePlaceComponent} from '../favorite-place/favorite-place.component';
import {ModalService} from '../_modal/modal.service';
import {FavoritePlace} from '../../../model/favorite-place/favorite-place';

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
  mapBounds: MapBounds;
  searchText;
  lat = 49.841795;
  lng = 24.031706;
  zoom = 13;
  place: Place[] = [];
  userMarkerLocation: Location;
  map: any;
  private userRole: string;

  origin: any;
  destination: any;
  directionButton: boolean;
  navigationMode = false;
  navigationButton = 'Navigate to place';
  travelMode = 'WALKING';
  travelModeButton = 'DRIVING';
  distance;
  icon = 'assets/img/icon/blue-dot.png';
  color = 'star-yellow';
  markerYellow = 'assets/img/icon/favorite-place/Icon-43.png';
  private querySubscription: Subscription;
  idFavoritePlace: number;
  favoritePlaces: FavoritePlace[];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private uService: UserService, private route: ActivatedRoute,
              private placeService: PlaceService, private favoritePlaceService: FavoritePlaceService) {
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
    this.querySubscription = route.queryParams.subscribe(
      (queryParam: any) => {
        this.idFavoritePlace = queryParam.fp_id;
      });
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
    this.userRole = this.uService.getUserRole();
    this.mapBounds = new MapBounds();
    this.setCurrentLocation();
    this.userMarkerLocation = {lat: this.lat, lng: this.lng};
    if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MODERATOR' || this.userRole === 'ROLE_USER') {
      this.getFavoritePlaces();
    }

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
    console.log('set marker');
    this.button = true;
    this.place = null;
    this.place = [place];

  }

  showAll() {
    console.log('show all to map');
    this.origin = null;
    this.button = !this.button;
    this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => {
      this.place = res;
      if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MODERATOR' || this.userRole === 'ROLE_USER') {
        this.changePlaceToFavoritePlace();
      }
    });
    this.searchText = null;
  }

  showDetail(pl: Place) {
    this.directionButton = true;
    this.placeService.getPlaceInfo(pl.id).subscribe((res) => {
        this.placeInfo = res;
        if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MODERATOR' || this.userRole === 'ROLE_USER') {
          if (this.userRole !== null) {
            this.favoritePlaces.forEach(fp => {
              if (fp.placeId === this.placeInfo.id) {
                this.placeInfo.name = fp.name;
              }
            });
          }
        }
      }
    );
    this.place = this.place.filter(r => {
      return r.id === pl.id;
    });
    if (this.place.length === 1 && this.button !== true) {
      this.button = !this.button;
    }
    pl.color = this.getIcon(pl.favorite);
  }

  saveOrDeletePlaceAsFavorite(place: Place) {
    console.log('savePlaceAsFavorite() method in map.component placeId=' + place.id);
    if (!place.favorite) {
      this.favoritePlaceService.saveFavoritePlace(new FavoritePlace(place.id, place.name)).subscribe(res => {
          this.getFavoritePlaces();
        }
      );
      place.favorite = true;
      place.color = this.getIcon(place.favorite);

    } else {
      this.favoritePlaceService.deleteFavoritePlace(place.id).subscribe(res => {
        this.getFavoritePlaces();
      })
      ;
      place.favorite = false;
      place.color = this.getIcon(place.favorite);

    }

  }

  getIcon(favorite: boolean) {
    return favorite ? 'star-yellow' : 'star-white';
  }

  getList() {
    if (this.idFavoritePlace) {
      this.setFavoritePlaceOnMap();
    } else {
      console.log('in getList()');
      if (this.button !== true) {
        this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => {
          this.place = res;
          this.idFavoritePlace = null;
          if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MODERATOR' || this.userRole === 'ROLE_USER') {
            this.changePlaceToFavoritePlace();
          }
        });
        this.searchText = null;
      }
    }
  }

  getMarkerIcon(favorite: boolean) {
    if (favorite) {
      return this.markerYellow;
    } else {
      return null;
    }
  }

  setFavoritePlaceOnMap() {
    if (this.idFavoritePlace) {
      this.favoritePlaceService.getFavoritePlaceWithLocation(this.idFavoritePlace).subscribe((res) => {
          res.favorite = true;
          this.place = [res];
          this.setMarker(this.place[0]);
        }
      );
      this.idFavoritePlace = null;

    }
  }

  getFavoritePlaces() {
    console.log('getFavoritePlaces');
    this.favoritePlaceService.findAllByUserEmail().subscribe((res) => {
        this.favoritePlaces = res;
      }
    );
  }

  changePlaceToFavoritePlace() {
    console.log('in changePlaceToFavoritePlace()');
    this.place.forEach((place) => {
      place.favorite = false;
      this.favoritePlaces.forEach((favoritePlace) => {
        if (place.id === favoritePlace.placeId) {
          place.name = favoritePlace.name;
          place.favorite = true;
        }
      });
    });

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
