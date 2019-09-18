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
import {UserService} from '../../../service/user/user.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

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
  color = 'star-yellow';
  markerYellow = 'assets/img/icon/favorite-place/Icon-43.png';
  private userRole: string;
  private querySubscription: Subscription;
  idFavoritePlace: number;
  favoritePlaces: FavoritePlaceSave[];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private uService: UserService, private route: ActivatedRoute,
              private placeService: PlaceService, private favoritePlaceService: FavoritePlaceService) {
    iconRegistry.addSvgIcon(
      'star-white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/favorite-place/star-white.svg'));
    iconRegistry.addSvgIcon(
      'star-yellow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/favorite-place/star-yellow.svg'));

    this.querySubscription = route.queryParams.subscribe(
      (queryParam: any) => {
        this.idFavoritePlace = queryParam.fp_id;
      }
    );

  }

  ngOnInit() {
    this.userRole = this.uService.getUserRole();
    this.mapBounds = new MapBounds();
    this.setCurrentLocation();
    if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MODERATOR' || this.userRole === 'ROLE_USER') {
      this.getFavoritePlaces();
    }
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
  }

  setMarker(place: any) {
    console.log('set marker');
    console.log(this.place);
    this.button = true;
    this.place = null;
    this.place = [place];

  }

  showAll() {
    console.log('show all to map');
    this.button = !this.button;
    this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => {
      this.place = res;
      if (this.userRole === 'ROLE_ADMIN' || this.userRole === 'ROLE_MODERATOR' || this.userRole === 'ROLE_USER') {
        this.changePlaceToFavoritePlace();
      }
    });
    this.searchText = null;
    console.log(this.place);
  }

  Show() {
    this.button = !this.button;
  }

  showDetail(p: number, pl: Place) {
    console.log('in showDetail()');
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
    pl.color = this.getIcon(pl.favorite);
  }

  savePlaceAsFavorite(place: Place) {
    console.log('savePlaceAsFavorite() method in map.component placeId=' + place.id);
    if (!place.favorite) {
      this.favoritePlaceService.saveFavoritePlace(new FavoritePlaceSave(place.id, place.name)).subscribe(res => {
          this.getFavoritePlaces();
        }
      )
      ;
      place.favorite = true;
      place.color = this.getIcon(place.favorite);

    } else {
      this.favoritePlaceService.deleteFavoritePlace(place.id * (-1)).subscribe(res => {
        this.getFavoritePlaces();
      })
      ;
      place.favorite = false;
      place.color = this.getIcon(place.favorite);

    }

  }

  getIcon(favorite: boolean) {
    console.log('isFavorite=' + favorite);
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
    this.favoritePlaceService.findAllByUserEmailWithPlaceId().subscribe((res) => {
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
}
