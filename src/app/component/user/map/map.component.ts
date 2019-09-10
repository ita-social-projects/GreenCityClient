import {Component, OnInit} from '@angular/core';
import {LatLngBounds} from '@agm/core';
import {Place} from '../../../model/place/place';
import {MapBounds} from '../../../model/map/map-bounds';
import {PlaceService} from '../../../service/place/place.service';
import {PlaceInfo} from '../../../model/place/place-info';
import {ModalService} from '../_modal/modal.service';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {FavoritePlaceService} from '../../../service/favorite-place/favorite-place.service';
import {FavoritePlace} from '../../../model/favorite-place/favorite-place';
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
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
              private placeService: PlaceService, private favoritePlaceService: FavoritePlaceService) {
    iconRegistry.addSvgIcon(
      'star-white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/favorite-place/star-white.svg'));
    iconRegistry.addSvgIcon(
      'star-yellow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/favorite-place/star-yellow.svg'));
  }

  ngOnInit() {

    this.mapBounds = new MapBounds();
    this.setCurrentLocation();
  }
  mapReady(event: any) {
    this.map = event;
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('AllFavoritePlaces'));

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
    this.button = true;
    this.place = null;
    this.place = [place];
  }

  showAll() {
    this.button = !this.button;
    this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => this.place = res);
    this.searchText = null;
    console.log(this.place);
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
  savePlaceAsFavorite(placeId: number, name: string) {
    console.log('savePlaceAsFavorite placeId=' + placeId);
    this.favoritePlaceService.saveFavoritePlace(new FavoritePlaceSave(placeId, name)).subscribe();
  }

  getList() {
    this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => this.place = res);
    this.searchText = null;
  }
}
