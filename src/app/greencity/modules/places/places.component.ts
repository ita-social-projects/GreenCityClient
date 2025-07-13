import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { MatDrawer } from '@angular/material/sidenav';
import { PlaceService } from 'src/app/shared/services/place/place.service';
import {
  greenIcon,
  notification,
  redIcon,
  searchIcon,
  share,
  star,
  starHalf,
  starUnfilled,
  starSmoothFilled,
  heart
} from 'src/app/greencity/image-paths/places-icons';
import { AllAboutPlace, Place } from './models/place';
import { FilterPlaceService } from 'src/app/shared/services/filtering/filter-place.service';
import { debounceTime, switchMap, take, takeUntil } from 'rxjs/operators';
import { MapBoundsDto } from './models/map-bounds-dto';
import { MoreOptionsFormValue } from './models/more-options-filter.model';
import { FavoritePlaceService } from 'src/app/greencity/modules/places/services/favorite-place/favorite-place.service';
import { combineLatest, filter, from, Subject, Subscription } from 'rxjs';
import { initialMoreOptionsFormValue } from './components/more-options-filter/more-options-filter.constant';
import { MatDialog } from '@angular/material/dialog';
import { AddPlaceComponent } from './components/add-place/add-place.component';
import { UserOwnAuthService } from 'src/app/shared/services/auth/user-own-auth.service';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { FilterModel } from 'src/app/greencity/shared/components/tag-filter/tag-filter.model';
import { tagsListPlacesData } from './models/places-consts';
import { GoogleScript } from '@assets/google-script/google-script';
import { ActivatedRoute } from '@angular/router';
import { initializeSavedState } from 'src/app/greencity/shared/components/saved-tabs/saved-section-const';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit, OnDestroy {
  position: any = {};
  zoom = 13;
  tagList: FilterModel[] = tagsListPlacesData;
  searchName = '';
  moreOptionsFilters: MoreOptionsFormValue;
  searchIcon = searchIcon;
  notification = notification;
  share = share;
  basicFilters: string[];
  mapBoundsDto: MapBoundsDto;
  places: Place[] = [];

  showMap = false;
  isMapLoading = false;
  mapLoadError = false;

  isSavedVisible = false;
  currentTab = 'places';
  mapOptions: google.maps.MapOptions = { disableDefaultUI: true, gestureHandling: 'greedy' };

  readonly redIconUrl: string = redIcon;
  readonly greenIconUrl: string = greenIcon;
  readonly smoothStarIconUrl: string = starSmoothFilled;
  readonly heartIconUrl: string = heart;
  activePlace: Place;
  activePlaceDetails: google.maps.places.PlaceResult;
  favoritePlaces: Place[] = [];
  isActivePlaceFavorite = false;
  readonly tagFilterStorageKey = 'placesTagFilter';
  readonly moreOptionsStorageKey = 'moreOptionsFilter';
  placesList: AllAboutPlace[] = [];

  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  private googlePlacesService: google.maps.places.PlacesService;
  get _googlePlacesService() {
    return this.googlePlacesService;
  }
  private page = 0;
  private totalPages: number;
  private size = 6;
  private $destroy: Subject<boolean> = new Subject();
  userId: number;

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly translate: TranslateService,
    private readonly placeService: PlaceService,
    private readonly filterPlaceService: FilterPlaceService,
    private readonly favoritePlaceService: FavoritePlaceService,
    private readonly googleScript: GoogleScript,
    private readonly dialog: MatDialog,
    private readonly userOwnAuthService: UserOwnAuthService,
    private readonly route: ActivatedRoute,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
    this.getPlaceList();
    if (!this.userId) {
      this.tagList = this.tagList.filter((item) => item.nameEn !== 'Saved places');
    }
    this.filterPlaceService.filtersDto$.pipe(debounceTime(300)).subscribe((filtersDto: any) => {
      this.placeService.updatePlaces(filtersDto);
    });

    this.getMoreOptionsValueFromSessionStorage();
    const initialLang = this.localStorageService.getCurrentLanguage();
    this.bindLang(initialLang);
    this.localStorageService.languageBehaviourSubject
      .pipe(
        switchMap((lang: string) => {
          this.bindLang(lang);

          this.ngZone.run(() => {
            this.isMapLoading = true;
            this.mapLoadError = false;
            this.showMap = false;
          });

          return from(this.googleScript.load(lang)).pipe(
            switchMap(() =>
              this.googleScript.mapReady.pipe(
                filter((ready) => ready),
                take(1)
              )
            )
          );
        }),
        takeUntil(this.$destroy)
      )
      .subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.isMapLoading = false;
            this.mapLoadError = false;
            this.showMap = true;
            this.cdr.detectChanges();
            this.initializeMapServices();
          });
        },
        error: (error) => {
          this.ngZone.run(() => {
            this.isMapLoading = false;
            this.mapLoadError = true;
            this.showMap = false;
            this.cdr.detectChanges();
          });
        }
      });

    combineLatest([
      this.placeService.places$,
      this.filterPlaceService.isFavoriteFilter$,
      this.favoritePlaceService.favoritePlaces$
    ]).subscribe(([places, isFavoriteFilter, favoritePlaces]: [Place[], boolean, Place[]]) => {
      this.favoritePlaces = favoritePlaces;
      this.updateIsActivePlaceFavorite();

      if (isFavoriteFilter) {
        this.places = places.filter((place: Place) =>
          this.favoritePlaces.some((favoritePlace: Place) => favoritePlace.location.id === place.location.id)
        );
      } else {
        this.places = places;
      }
    });

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!this.userId) {
      this.favoritePlaceService.updateFavoritePlaces(false);
    }

    initializeSavedState(this.route, (isBookmark, section) => {
      this.isSavedVisible = isBookmark;
      this.currentTab = section;
    });
  }

  private initializeMapServices(): void {
    if (window?.google?.maps !== 'undefined' && this.map?.googleMap) {
      try {
        this.googlePlacesService = new google.maps.places.PlacesService(this.map.googleMap);
        this.setUserLocation();
      } catch (e) {
        this.ngZone.run(() => {
          this.mapLoadError = true;
          this.showMap = false;
          this.isMapLoading = false;
          this.cdr.detectChanges();
        });
      }
    } else {
      this.ngZone.run(() => {
        this.mapLoadError = true;
        this.showMap = false;
        this.isMapLoading = false;
        this.cdr.detectChanges();
      });
    }
  }

  onMapIdle(): void {
    this.updateFilters();
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject.subscribe((data) => {
      this.userId = data.userId;
    });
  }

  moreOptionsChange(newValue: MoreOptionsFormValue): void {
    this.moreOptionsFilters = newValue;
    this.setMoreOptionsValueToSessionStorage(this.moreOptionsFilters);
    this.updateFilters();
  }

  basicFiltersChange(newValue: string[]) {
    this.basicFilters = newValue;
    this.updateFilters();
  }

  searchNameChange(newValue: string): void {
    this.searchName = newValue;
    this.updateFilters();
  }

  updateFilters(): void {
    this.filterPlaceService.updateFiltersDto({
      searchName: this.searchName,
      moreOptionsFilters: this.moreOptionsFilters,
      basicFilters: this.basicFilters,
      mapBoundsDto: this.mapBoundsDto,
      position: this.position
    });
  }

  toggleFavoriteFromSideBar(place) {
    if (!this.userId) {
      this.dialog
        .open(AuthModalComponent, {
          hasBackdrop: true,
          closeOnNavigation: true,
          panelClass: ['custom-dialog-container'],
          data: {
            popUpName: 'sign-in'
          }
        })
        .afterClosed()
        .subscribe((data) => {
          this.userId = data;
          // eslint-disable-next-line no-extra-boolean-cast
          if (!!data) {
            this.toggleFavoriteFromSideBar(place);
          }
        });
    } else {
      if (place.isFavorite) {
        this.favoritePlaceService.deleteFavoritePlace(place.id, true);
      } else {
        this.favoritePlaceService.addFavoritePlace({ placeId: place.id, name: place.name }, true);
      }
      place.isFavorite = !place.isFavorite;
    }
  }

  closePlaceInformation(): void {
    this.activePlaceDetails = undefined;
    this.activePlace = undefined;
  }

  updatePlaceList(isAfterClose: boolean): void {
    if (isAfterClose) {
      this.page = 0;
    } else if (this.totalPages === this.page) {
      return;
    }
    this.getPlaceList();
  }

  private getPlaceList(): void {
    this.placeService.getAllPlaces(this.page, this.size).subscribe((item: any) => {
      this.handlePlaceListResponse(item);
    });
  }

  private handlePlaceListResponse(item: any): void {
    if (item.page) {
      this.placesList = [...this.placesList, ...item.page];
      this.drawer.toggle(true);
    } else {
      this.drawer.toggle(false);
    }
    this.totalPages = item.totalPages;
    this.page += 1;
  }

  toggleFavorite(): void {
    if (this.isActivePlaceFavorite) {
      this.favoritePlaceService.deleteFavoritePlace(this.activePlace.id);
    } else {
      this.favoritePlaceService.addFavoritePlace({ placeId: this.activePlace.id, name: this.activePlace.name });
    }
  }

  private bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  selectPlace(place: Place): void {
    this.activePlace = place;
    this.updateIsActivePlaceFavorite();
    this.getPlaceInfoFromGoogleApi(place);
  }

  selectPlaceFromSideBar(place: AllAboutPlace) {
    const sendingPlace = {
      id: place.id,
      name: place.name,
      location: place.location
    };
    this.selectPlace(sendingPlace);
  }
  private getPlaceInfoFromGoogleApi(place: Place) {
    if (!this.googlePlacesService) {
      return;
    }

    const findByQueryRequest: google.maps.places.FindPlaceFromQueryRequest = {
      query: place.name,
      locationBias: {
        lat: place.location.lat,
        lng: place.location.lng
      },
      fields: ['ALL']
    };

    this.googlePlacesService.findPlaceFromQuery(
      findByQueryRequest,
      (places: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && places && places.length > 0) {
          const detailsRequest: google.maps.places.PlaceDetailsRequest = {
            placeId: places[0].place_id,
            fields: ['ALL']
          };
          this.googlePlacesService.getDetails(
            detailsRequest,
            (placeDetails: google.maps.places.PlaceResult | null, detailsStatus: google.maps.places.PlacesServiceStatus) => {
              if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                this.ngZone.run(() => {
                  this.activePlaceDetails = placeDetails;
                });
                this.drawer.toggle(true);
              }
            }
          );
        }
      }
    );
  }

  private setMoreOptionsValueToSessionStorage(formValue: MoreOptionsFormValue): void {
    sessionStorage.setItem(this.moreOptionsStorageKey, JSON.stringify(formValue));
  }

  private getMoreOptionsValueFromSessionStorage(): void {
    const formValue: MoreOptionsFormValue = JSON.parse(sessionStorage.getItem(this.moreOptionsStorageKey));
    this.moreOptionsFilters = formValue ?? initialMoreOptionsFormValue;
  }

  private updateIsActivePlaceFavorite(): void {
    this.isActivePlaceFavorite = this.favoritePlaces.some(
      (favoritePlace: Place) => favoritePlace.location.id === this.activePlace?.location.id
    );
  }

  getStars(rating: number): Array<string> {
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
    if (typeof window?.google?.maps === 'undefined' || !this.map?.googleMap) {
      return;
    }

    const map = this.map?.googleMap;

    if (!map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position: any) => {
        this.ngZone.run(() => {
          map.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        });
      },
      (error) => {
        this.ngZone.run(() => {
          map.setCenter({
            lat: 49.84579567734425,
            lng: 24.025124653312258
          });
        });
      }
    );
  }

  onLocationSelected(event: Event | Location) {
    return;
  }

  openTimePickerPopUp() {
    this.dialog
      .open(AddPlaceComponent, { hasBackdrop: true, closeOnNavigation: true, disableClose: true, panelClass: 'add-place-wrapper-class' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((value) => {
        if (value) {
          this.placeService.createPlace(value).subscribe((resp: any) => {
            this.onLocationSelected(location);
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
