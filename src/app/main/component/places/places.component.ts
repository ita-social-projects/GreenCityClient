import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatDrawer } from '@angular/material/sidenav';
import { PlaceService } from '@global-service/place/place.service';
import { redIcon, greenIcon, searchIcon, notification, share, starUnfilled, starHalf, star } from '../../image-pathes/places-icons.js';
import { Place } from './models/place';
import { FilterPlaceService } from '@global-service/filtering/filter-place.service';
import { debounceTime, take } from 'rxjs/operators';
import { LatLngBounds, LatLngLiteral } from '@agm/core/services/google-maps-types';
import { MapBoundsDto } from './models/map-bounds-dto';
import { MoreOptionsFormValue } from './models/more-options-filter.model';
import { PlaceInfo } from '@global-models/place/place-info';
import { Location } from '@angular-material-extensions/google-maps-autocomplete';
import { FavoritePlaceService } from '@global-service/favorite-place/favorite-place.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  public position: any = {};
  public zoom = 13;
  public tagList: Array<string> = ['Shops', 'Restaurants', 'Recycling points', 'Events', 'Saved places'];
  public searchName = '';
  public moreOptionsFilters: MoreOptionsFormValue;
  public searchIcon = searchIcon;
  public notification = notification;
  public share = share;
  public basicFilters: string[];
  public mapBoundsDto: MapBoundsDto;
  public places: Place[] = [];
  public readonly redIconUrl: string = redIcon;
  public readonly greenIconUrl: string = greenIcon;
  public activePlace: Place;
  public activePlaceInfo: PlaceInfo;
  public favoritePlaces: Place[] = [];
  public isActivePlaceFavorite = false;

  @ViewChild('drawer') drawer: MatDrawer;

  private map: any;

  constructor(
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private placeService: PlaceService,
    private filterPlaceService: FilterPlaceService,
    private favoritePlaceService: FavoritePlaceService
  ) {}

  ngOnInit() {
    this.filterPlaceService.filtersDto$.pipe(debounceTime(300)).subscribe((filtersDto: any) => {
      this.placeService.updatePlaces(filtersDto);
    });

    combineLatest([
      this.placeService.places$,
      this.filterPlaceService.isFavoriteFilter$,
      this.favoritePlaceService.favoritePlaces$
    ]).subscribe(([places, isFavoriteFilter, favoritePlaces]: [Place[], boolean, Place[]]) => {
      this.favoritePlaces = favoritePlaces;
      this.updateIsActivePlaceFavorite();

      if (isFavoriteFilter) {
        this.places = places.filter((place: Place) => {
          return this.favoritePlaces.some((favoritePlace: Place) => favoritePlace.location.id === place.location.id);
        });
      } else {
        this.places = places;
      }
    });

    this.favoritePlaceService.updateFavoritePlaces();

    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  public onMapIdle(): void {
    this.updateFilters();
  }

  public onMapReady(map: any): void {
    this.map = map;
    this.setUserLocation();
  }

  public mapCenterChange(newValue: LatLngLiteral): void {
    this.position = {
      latitude: newValue.lat,
      longitude: newValue.lng
    };
  }

  public mapBoundsChange(newValue: LatLngBounds): void {
    this.mapBoundsDto = {
      northEastLat: newValue.getNorthEast().lat(),
      northEastLng: newValue.getNorthEast().lng(),
      southWestLat: newValue.getSouthWest().lat(),
      southWestLng: newValue.getSouthWest().lng()
    };
  }

  public moreOptionsChange(newValue: MoreOptionsFormValue): void {
    this.moreOptionsFilters = newValue;
    this.updateFilters();
  }

  public basicFiltersChange(newValue: string[]) {
    this.basicFilters = newValue;
    this.updateFilters();
  }

  public searchNameChange(newValue: string): void {
    this.searchName = newValue;
    this.updateFilters();
  }

  public updateFilters(): void {
    this.filterPlaceService.updateFiltersDto({
      searchName: this.searchName,
      moreOptionsFilters: this.moreOptionsFilters,
      basicFilters: this.basicFilters,
      mapBoundsDto: this.mapBoundsDto,
      position: this.position
    });
  }

  public toggleFavorite(): void {
    if (this.isActivePlaceFavorite) {
      this.favoritePlaceService.deleteFavoritePlace(this.activePlaceInfo.id);
    } else {
      this.favoritePlaceService.addFavoritePlace({ placeId: this.activePlaceInfo.id, name: this.activePlaceInfo.name });
    }
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  public selectPlace(place: Place): void {
    this.activePlace = place;
    this.placeService
      .getPlaceInfo(place.id)
      .pipe(take(1))
      .subscribe((placeInfo: PlaceInfo) => {
        this.activePlaceInfo = placeInfo;
        this.drawer.toggle(true);
        this.updateIsActivePlaceFavorite();
      });
  }

  private updateIsActivePlaceFavorite(): void {
    this.isActivePlaceFavorite = this.favoritePlaces.some((favoritePlace: Place) => {
      return favoritePlace.location.id === this.activePlaceInfo?.location.id;
    });
  }

  public getStars(rating: number): Array<string> {
    const stars = [];
    const maxRating = 5;
    const validRating = Math.min(rating, maxRating);
    for (let i = 0; i <= validRating - 1; i++) {
      stars.push(star);
    }
    if (Math.trunc(validRating) < validRating) {
      stars.push(starHalf);
    }
    for (let i = stars.length; i < maxRating; i++) {
      stars.push(starUnfilled);
    }
    return stars;
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

  onLocationSelected(event: Location) {
    this.map.setCenter({
      lat: event.latitude,
      lng: event.longitude
    });
  }
}
