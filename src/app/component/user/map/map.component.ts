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
import {ModalService} from '../_modal/modal.service';
import {ifTrue} from 'codelyzer/util/function';

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

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
              private placeService: PlaceService, private favoritePlaceService: FavoritePlaceService, private modalService: ModalService) {
    iconRegistry.addSvgIcon(
      'star-white',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/favorite-place/star-white.svg'));
    iconRegistry.addSvgIcon(
      'star-yellow',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icon/favorite-place/star-yellow.svg'));
  }


  openModal(id: string) {
    this.modalService.open(id);
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

  savePlaceAsFavorite(place: Place) {
    console.log('savePlaceAsFavorite placeId=' + place.id);
    if (!place.isFavorite) {
      this.favoritePlaceService.saveFavoritePlace(new FavoritePlaceSave(place.id, place.name)).subscribe();
      place.isFavorite = true;
    } else {
      this.favoritePlaceService.deleteFavoritePlace(place.id);
      place.isFavorite = false;
    }
  }

  getIcon(isFavorite: boolean) {
    console.log('isFavorite=' + isFavorite);
    return isFavorite ? 'star-yellow' : 'star-white';
  }

  getList() {
    if (this.button !== true) {
      this.placeService.getListPlaceByMapsBoundsDto(this.mapBounds).subscribe((res) => this.place = res);
      this.searchText = null;
    }
  }
}
