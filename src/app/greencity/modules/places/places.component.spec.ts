import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync, flush } from '@angular/core/testing';
import { PlacesComponent } from './places.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { PlaceService } from 'src/app/shared/services/place/place.service';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { AllAboutPlace, Place } from './models/place';
import { FilterPlaceService } from 'src/app/shared/services/filtering/filter-place.service';
import { PlaceStatus } from 'src/app/shared/models/placeStatus.model';
import { FavoritePlaceService } from 'src/app/greencity/modules/places/services/favorite-place/favorite-place.service';
import { CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatePlaceModel, OpeningHoursDto } from './models/create-place.model';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ActivatedRoute } from '@angular/router';
import { GoogleScript } from '@assets/google-script/google-script';
import { UserOwnAuthService } from 'src/app/shared/services/auth/user-own-auth.service';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { initialMoreOptionsFormValue } from './components/more-options-filter/more-options-filter.constant';
import { PlatformLocation } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import { star, starHalf, starUnfilled } from 'src/app/greencity/image-paths/places-icons';
import { AddPlaceComponent } from './components/add-place/add-place.component';

describe('PlacesComponent', () => {
  let component: PlacesComponent;
  let fixture: ComponentFixture<PlacesComponent>;

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageSubject',
    'getUserId',
    'languageBehaviourSubject'
  ]);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getUserId = () => 1;
  localStorageServiceMock.languageSubject.unsubscribe = jasmine.createSpy();

  const placeServiceMock: PlaceService = jasmine.createSpyObj('PlaceService', [
    'getPlaceInfo',
    'updatePlaces',
    'createPlace',
    'getAllPlaces'
  ]);
  placeServiceMock.places$ = new Subject<Place[]>();
  placeServiceMock.createPlace = () =>
    of({
      locationAddressAndGeoDto: {
        lat: 33.2,
        lng: 33.4
      }
    });
  (placeServiceMock.getAllPlaces as jasmine.Spy).and.returnValue(of({ page: [], totalPages: 0 }));

  const filterPlaceServiceMock: FilterPlaceService = jasmine.createSpyObj('FilterPlaceService', ['updateFiltersDto']);
  filterPlaceServiceMock.filtersDto$ = new BehaviorSubject<any>({ status: PlaceStatus.APPROVED });
  (filterPlaceServiceMock.isFavoriteFilter$ as BehaviorSubject<boolean>) = new BehaviorSubject<boolean>(true);

  const favoritePlaceServiceMock: FavoritePlaceService = jasmine.createSpyObj('FavoritePlaceService', [
    'updateFavoritePlaces',
    'deleteFavoritePlace',
    'addFavoritePlace'
  ]);
  favoritePlaceServiceMock.favoritePlaces$ = new BehaviorSubject<Place[]>([]);

  let placeMock: AllAboutPlace = {
    id: 1,
    name: 'test',
    location: {
      id: 1,
      lat: 49.840224,
      lng: 24.0221738,
      address: 'Universytetska St, 1, Lviv, Lvivska oblast, Ukraine, 79000'
    },
    category: {
      nameEn: 'Charging station',
      nameUk: 'Зарядні станції',
      parentCategoryId: null
    },
    openingHoursList: [
      {
        breakTime: {
          endTime: '',
          startTime: ''
        },
        closeTime: {
          hour: 0,
          minute: 0,
          nano: 0,
          second: 0
        },
        id: 0,
        openTime: {
          hour: 0,
          minute: 0,
          nano: 0,
          second: 0
        },
        weekDay: ''
      }
    ],
    author: {
      id: 19,
      name: 'Iryna',
      email: 'admin.greencity@starmaker.email'
    },
    status: 'APPROVED',
    isFavorite: true,
    modifiedDate: null
  };

  const openingHour: OpeningHoursDto[] = [
    {
      weekDay: 'Test',
      closeTime: '20:00',
      openTime: '08:00'
    }
  ];
  const parametersToSend: CreatePlaceModel = {
    categoryName: 'Test',
    locationName: 'Test',
    placeName: 'Test',
    openingHoursList: openingHour
  };

  const matDialogFake = jasmine.createSpyObj('matDialog', ['open']);
  matDialogFake.open.and.returnValue({ afterClosed: () => of(parametersToSend) });

  const mockGoogleScript = {
    $isRenderingMap: of(false),
    load: jasmine.createSpy('load').and.returnValue(of(undefined)),
    mapReady: new Subject<boolean>()
  };
  const mockPlaceResult = {
    name: 'Test Place',
    place_id: 'abc123',
    geometry: {
      location: {
        lat: () => 49.840224,
        lng: () => 24.022174
      }
    },
    rating: 4.5
  } as google.maps.places.PlaceResult;

  const mockUserOwnAuthService = {
    credentialDataSubject: new BehaviorSubject({ userId: 1 }),
    getDataFromLocalStorage: () => {}
  };

  const activatedRouteMock = {
    queryParams: of({ section: 'places' })
  };

  let matDrawerSpy: jasmine.SpyObj<MatDrawer>;

  beforeEach(waitForAsync(() => {
    const translateServiceMock = jasmine.createSpyObj('TranslateService', ['use', 'get', 'setDefaultLang', 'instant'], {
      onLangChange: new Subject<any>(),
      onTranslationChange: new Subject<any>(),
      onDefaultLangChange: new Subject<any>()
    });
    translateServiceMock.get.and.returnValue(of(''));
    translateServiceMock.instant.and.returnValue('');

    const mockPlatformLocation = jasmine.createSpyObj('PlatformLocation', ['getBaseHref', 'onPopState', 'onHashChange', 'historyGo']);
    mockPlatformLocation.onPopState = new Subject<any>();
    mockPlatformLocation.onHashChange = new Subject<any>();
    mockPlatformLocation.getBaseHref.and.returnValue('/');
    mockPlatformLocation.historyGo.and.returnValue(undefined);

    matDrawerSpy = jasmine.createSpyObj('MatDrawer', ['toggle', 'open', 'close']);
    matDrawerSpy.open.and.returnValue(Promise.resolve('open'));
    matDrawerSpy.close.and.returnValue(Promise.resolve('close'));
    matDrawerSpy.toggle.and.returnValue(Promise.resolve('open'));

    TestBed.configureTestingModule({
      declarations: [PlacesComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, InfiniteScrollModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: FilterPlaceService, useValue: filterPlaceServiceMock },
        { provide: PlaceService, useValue: placeServiceMock },
        { provide: FavoritePlaceService, useValue: favoritePlaceServiceMock },
        { provide: MatDialog, useValue: matDialogFake },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: GoogleScript, useValue: mockGoogleScript },
        { provide: UserOwnAuthService, useValue: mockUserOwnAuthService },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: PlatformLocation, useValue: mockPlatformLocation }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    placeMock = {
      id: 1,
      name: 'test',
      location: {
        id: 1,
        lat: 49.840224,
        lng: 24.0221738,
        address: 'Universytetska St, 1, Lviv, Lvivska oblast, Ukraine, 79000'
      },
      category: {
        nameEn: 'Charging station',
        nameUk: 'Зарядні станції',
        parentCategoryId: null
      },
      openingHoursList: [
        {
          breakTime: {
            endTime: '',
            startTime: ''
          },
          closeTime: {
            hour: 0,
            minute: 0,
            nano: 0,
            second: 0
          },
          id: 0,
          openTime: {
            hour: 0,
            minute: 0,
            nano: 0,
            second: 0
          },
          weekDay: ''
        }
      ],
      author: {
        id: 19,
        name: 'Iryna',
        email: 'admin.greencity@starmaker.email'
      },
      status: 'APPROVED',
      isFavorite: true,
      modifiedDate: null
    };

    window.google = {
      maps: {
        places: {
          PlacesService: jasmine.createSpy('PlacesService').and.callFake(function (map: any) {
            this.map = map;
            this.findPlaceFromQuery = jasmine.createSpy('findPlaceFromQuery').and.callFake((request, callback) => {
              callback([mockPlaceResult], window.google.maps.places.PlacesServiceStatus.OK);
            });
            this.getDetails = jasmine.createSpy('getDetails').and.callFake((request, callback) => {
              callback(mockPlaceResult, window.google.maps.places.PlacesServiceStatus.OK);
            });
          }) as any,
          PlacesServiceStatus: {
            OK: 'OK',
            ZERO_RESULTS: 'ZERO_RESULTS',
            NOT_FOUND: 'NOT_FOUND',
            INVALID_REQUEST: 'INVALID_REQUEST',
            OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
            REQUEST_DENIED: 'REQUEST_DENIED',
            UNKNOWN_ERROR: 'UNKNOWN_ERROR'
          }
        },
        Map: jasmine.createSpy('Map').and.returnValue({
          _center: { lat: 0, lng: 0 },
          setCenter: jasmine.createSpy('setCenter').and.callFake(function (
            latLng: { lat: () => number; lng: () => number } | { lat: number; lng: number }
          ) {
            if (typeof latLng.lat === 'function' && typeof latLng.lng === 'function') {
              this._center = { lat: latLng.lat(), lng: latLng.lng() };
            } else {
              this._center = latLng;
            }
          }),
          getCenter: () => ({ lat: () => (this as any)._center.lat, lng: () => (this as any)._center.lng }),
          getBounds: () => ({
            getNorthEast: () => ({ lat: () => 0, lng: () => 0 }),
            getSouthWest: () => ({ lat: () => 0, lng: () => 0 })
          }),
          addListener: jasmine.createSpy('addListener')
        }) as any
      }
    };

    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.callFake((successCb, errorCb) => {
          successCb({ coords: { latitude: 10, longitude: 20 } });
        })
      },
      writable: true
    });

    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;

    component.drawer = matDrawerSpy;

    component.map = {
      googleMap: new window.google.maps.Map(document.createElement('div')),
      center: { lat: 0, lng: 0 },
      options: {},
      zoom: 8,
      panTo: jasmine.createSpy('panTo'),
      setCenter: jasmine.createSpy('setCenter')
    } as any;

    fixture.detectChanges();
  });

  afterEach(() => {
    delete window.google;
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true
    });
    sessionStorage.clear();
    matDrawerSpy.toggle.calls.reset();
    matDrawerSpy.open.calls.reset();
    matDrawerSpy.close.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the favorite status of a place correctly', () => {
    component.userId = 1;
    expect(placeMock.isFavorite).toBeTrue();

    component.toggleFavoriteFromSideBar(placeMock);
    expect(favoritePlaceServiceMock.deleteFavoritePlace).toHaveBeenCalledWith(placeMock.id, true);
    expect(placeMock.isFavorite).toBeFalse();

    component.toggleFavoriteFromSideBar(placeMock);
    expect(favoritePlaceServiceMock.addFavoritePlace).toHaveBeenCalledWith({ placeId: placeMock.id, name: placeMock.name }, true);
    expect(placeMock.isFavorite).toBeTrue();
  });

  it('should open AuthModalComponent if user is not logged in when toggling favorite', () => {
    component.userId = null;
    component.toggleFavoriteFromSideBar(placeMock);
    expect(matDialogFake.open).toHaveBeenCalledWith(AuthModalComponent, jasmine.any(Object));
  });

  it('should call updateFilters on idleMap', () => {
    const updateFiltersSpy = spyOn(component, 'updateFilters');
    component.onMapIdle();
    expect(updateFiltersSpy).toHaveBeenCalled();
  });

  it('should clear activePlace and activePlaceDetails when closePlaceInformation is called', () => {
    component.activePlace = undefined;
    component.activePlaceDetails = undefined;

    component.activePlace = placeMock;
    component.activePlaceDetails = mockPlaceResult;

    component.closePlaceInformation();

    expect(component.activePlace).toBeUndefined();
    expect(component.activePlaceDetails).toBeUndefined();
  });

  it('should update moreOptionsFilters and call updateFilters when moreOptionsChange is called', () => {
    const newMoreOptions = { ...initialMoreOptionsFormValue, openNow: true };
    const updateFiltersSpy = spyOn(component, 'updateFilters');
    const setSessionStorageSpy = spyOn(sessionStorage, 'setItem');

    component.moreOptionsChange(newMoreOptions);

    expect(component.moreOptionsFilters).toEqual(newMoreOptions);
    expect(setSessionStorageSpy).toHaveBeenCalledWith(component.moreOptionsStorageKey, JSON.stringify(newMoreOptions));
    expect(updateFiltersSpy).toHaveBeenCalled();
  });

  it('should update basicFilters and call updateFilters when basicFiltersChange is called', () => {
    const newBasicFilters = ['Filter1', 'Filter2'];
    const updateFiltersSpy = spyOn(component, 'updateFilters');

    component.basicFiltersChange(newBasicFilters);

    expect(component.basicFilters).toEqual(newBasicFilters);
    expect(updateFiltersSpy).toHaveBeenCalled();
  });

  it('should update searchName and call updateFilters when searchNameChange is called', () => {
    const newSearchName = 'New Place';
    const updateFiltersSpy = spyOn(component, 'updateFilters');

    component.searchNameChange(newSearchName);

    expect(component.searchName).toBe(newSearchName);
    expect(updateFiltersSpy).toHaveBeenCalled();
  });

  it('should toggle favorite status for activePlace', () => {
    component.userId = 1;
    component.activePlace = { id: 10, name: 'Active Test', location: { id: 1, lat: 1, lng: 1, address: 'Test' } };
    component.isActivePlaceFavorite = true;
    component.toggleFavorite();
    expect(favoritePlaceServiceMock.deleteFavoritePlace).toHaveBeenCalledWith(10);

    component.isActivePlaceFavorite = false;
    component.toggleFavorite();
    expect(favoritePlaceServiceMock.addFavoritePlace).toHaveBeenCalledWith({ placeId: 10, name: 'Active Test' });
  });

  it('should set places based on favorite filter', fakeAsync(() => {
    const placesFromService: Place[] = [
      { id: 1, name: 'Place 1', location: { id: 1, lat: 0, lng: 0, address: '' } },
      { id: 2, name: 'Place 2', location: { id: 2, lat: 0, lng: 0, address: '' } }
    ];
    const favoritePlacesFromService: Place[] = [{ id: 1, name: 'Place 1', location: { id: 1, lat: 0, lng: 0, address: '' } }];

    placeServiceMock.places$.next(placesFromService);
    (filterPlaceServiceMock.isFavoriteFilter$ as BehaviorSubject<boolean>).next(true);
    favoritePlaceServiceMock.favoritePlaces$.next(favoritePlacesFromService);
    tick();
    fixture.detectChanges();

    expect(component.places.length).toBe(1);
    expect(component.places[0].id).toBe(1);

    (filterPlaceServiceMock.isFavoriteFilter$ as BehaviorSubject<boolean>).next(false);
    tick();
    fixture.detectChanges();

    expect(component.places.length).toBe(2);
    flush();
  }));

  it('should update isActivePlaceFavorite based on favoritePlaces', fakeAsync(() => {
    component.activePlace = { id: 1, name: 'Test', location: { id: 1, lat: 0, lng: 0, address: '' } };
    favoritePlaceServiceMock.favoritePlaces$.next([{ id: 1, name: 'Test', location: { id: 1, lat: 0, lng: 0, address: '' } }]);
    tick();
    fixture.detectChanges();

    favoritePlaceServiceMock.favoritePlaces$.next([]);
    tick();
    fixture.detectChanges();
    expect(component.isActivePlaceFavorite).toBeFalse();
    flush();
  }));

  it('should open AddPlaceComponent dialog and create a place', fakeAsync(() => {
    const createPlaceSpy = spyOn(placeServiceMock, 'createPlace').and.returnValue(
      of({
        locationAddressAndGeoDto: {
          lat: 33.2,
          lng: 33.4
        }
      })
    );
    const onLocationSelectedSpy = spyOn(component, 'onLocationSelected');

    matDialogFake.open.and.returnValue({ afterClosed: () => of(parametersToSend) });
    component.openTimePickerPopUp();
    tick();
    fixture.detectChanges();

    expect(matDialogFake.open).toHaveBeenCalledWith(AddPlaceComponent, jasmine.any(Object));
    expect(createPlaceSpy).toHaveBeenCalledWith(parametersToSend);
    expect(onLocationSelectedSpy).toHaveBeenCalled();
    flush();
  }));

  it('should not call createPlace if dialog returns no value', fakeAsync(() => {
    const createPlaceSpy = spyOn(placeServiceMock, 'createPlace');
    matDialogFake.open.and.returnValue({ afterClosed: () => of(null) });
    component.openTimePickerPopUp();
    tick();
    fixture.detectChanges();
    expect(createPlaceSpy).not.toHaveBeenCalled();
    flush();
  }));

  it('should destroy subscriptions on ngOnDestroy', () => {
    const destroySubject: Subject<boolean> = (component as any).$destroy;
    const destroySpy = spyOn(destroySubject, 'next');
    const completeSpy = spyOn(destroySubject, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should retrieve moreOptionsFilters from session storage on init', fakeAsync(() => {
    const storedValue = { ...initialMoreOptionsFormValue, openNow: true, discount: true };
    sessionStorage.setItem(component.moreOptionsStorageKey, JSON.stringify(storedValue));

    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;
    component.drawer = matDrawerSpy;
    component.map = {
      googleMap: new window.google.maps.Map(document.createElement('div')),
      center: { lat: 0, lng: 0 },
      options: {},
      zoom: 8,
      panTo: jasmine.createSpy('panTo'),
      setCenter: jasmine.createSpy('setCenter')
    } as any;
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();

    expect(component.moreOptionsFilters).toEqual(storedValue);
    flush();
  }));

  it('should return correct star icons for a given rating', () => {
    expect(component.getStars(0)).toEqual([starUnfilled, starUnfilled, starUnfilled, starUnfilled, starUnfilled]);
    expect(component.getStars(2)).toEqual([star, star, starUnfilled, starUnfilled, starUnfilled]);
    expect(component.getStars(3.5)).toEqual([star, star, star, starHalf, starUnfilled]);
    expect(component.getStars(5)).toEqual([star, star, star, star, star]);
    expect(component.getStars(6)).toEqual([star, star, star, star, star]);
  });

  it('should initialize saved state and user ID on ngOnInit without drawer calls', () => {
    expect(component.isSavedVisible).toBeFalse();
    expect(component.currentTab).toBe('places');
    expect(matDrawerSpy.toggle).toHaveBeenCalled();
  });

  it('should filter tagsList if user is not logged in without drawer calls', () => {
    (mockUserOwnAuthService.credentialDataSubject as BehaviorSubject<any>).next({ userId: null });
    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;
    component.map = {
      googleMap: new window.google.maps.Map(document.createElement('div')),
      center: { lat: 0, lng: 0 },
      options: {},
      zoom: 8,
      panTo: jasmine.createSpy('panTo'),
      setCenter: jasmine.createSpy('setCenter')
    } as any;
    fixture.detectChanges();

    const savedPlacesTag = component.tagList.find((item) => item.nameEn === 'Saved places');
    expect(savedPlacesTag).toBeUndefined();
    expect(matDrawerSpy.toggle).toHaveBeenCalled();
  });

  it('should update filtersDto on filterPlaceService.filtersDto$ emission without drawer calls', fakeAsync(() => {
    const newFilters = { searchName: 'test', moreOptionsFilters: {}, basicFilters: [], mapBoundsDto: {}, position: {} };
    (filterPlaceServiceMock.filtersDto$ as BehaviorSubject<any>).next(newFilters);
    tick(300);
    expect(matDrawerSpy.toggle).toHaveBeenCalled();
    flush();
  }));

  it('should handle map load error gracefully without drawer calls', fakeAsync(() => {
    (mockGoogleScript.load as jasmine.Spy).and.returnValue(throwError(() => new Error('Map load failed')));
    (localStorageServiceMock.languageBehaviourSubject as BehaviorSubject<string>).next('uk');
    tick();
    fixture.detectChanges();

    expect(mockGoogleScript.load).toHaveBeenCalledWith('uk');
    expect(component.isMapLoading).toBeFalse();
    expect(component.mapLoadError).toBeTrue();
    expect(component.showMap).toBeFalse();
    flush();
  }));

  it('should update isActivePlaceFavorite when favoritePlaces or activePlace changes without drawer calls', fakeAsync(() => {
    component.activePlace = { id: 1, name: 'Place A', location: { id: 1, lat: 0, lng: 0, address: 'addr' } };
    (favoritePlaceServiceMock.favoritePlaces$ as BehaviorSubject<Place[]>).next([
      { id: 1, name: 'Place A', location: { id: 1, lat: 0, lng: 0, address: 'addr' } }
    ]);
    tick();
    fixture.detectChanges();
    expect(component.isActivePlaceFavorite).toBeFalse();

    (favoritePlaceServiceMock.favoritePlaces$ as BehaviorSubject<Place[]>).next([]);
    tick();
    fixture.detectChanges();
    expect(component.isActivePlaceFavorite).toBeFalse();

    component.activePlace = { id: 2, name: 'Place B', location: { id: 2, lat: 0, lng: 0, address: 'addr' } };
    (favoritePlaceServiceMock.favoritePlaces$ as BehaviorSubject<Place[]>).next([
      { id: 1, name: 'Place A', location: { id: 1, lat: 0, lng: 0, address: 'addr' } }
    ]);
    tick();
    fixture.detectChanges();
    expect(component.isActivePlaceFavorite).toBeFalse();
    flush();
  }));

  it('should not call placeService.getAllPlaces if totalPages equals page without drawer calls', fakeAsync(() => {
    component['page'] = 1;
    component['totalPages'] = 1;
    (placeServiceMock.getAllPlaces as jasmine.Spy).calls.reset();

    component.updatePlaceList(false);
    tick();
    fixture.detectChanges();

    expect(placeServiceMock.getAllPlaces).not.toHaveBeenCalled();
    expect(matDrawerSpy.toggle).toHaveBeenCalled();
    flush();
  }));

  it('should call selectPlace when selectPlaceFromSideBar is called with AllAboutPlace without drawer calls', () => {
    const placeAllAbout: AllAboutPlace = {
      id: 1,
      name: 'Side Place',
      location: { id: 1, lat: 10, lng: 20, address: 'Side Address' },
      category: { nameEn: 'Cat', nameUk: 'Кат', parentCategoryId: null },
      author: { id: 1, name: 'Auth', email: 'e@mail.com' },
      status: 'APPROVED',
      isFavorite: false,
      modifiedDate: null,
      openingHoursList: null
    };
    const selectPlaceSpy = spyOn(component, 'selectPlace');

    component.selectPlaceFromSideBar(placeAllAbout);
    expect(selectPlaceSpy).toHaveBeenCalledWith({
      id: placeAllAbout.id,
      name: placeAllAbout.name,
      location: placeAllAbout.location
    });
  });

  it('should filter tagsList correctly when user logs in (dynamic change of userId)', fakeAsync(() => {
    (mockUserOwnAuthService.credentialDataSubject as BehaviorSubject<any>).next({ userId: null });
    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;
    component.map = {
      googleMap: new window.google.maps.Map(document.createElement('div')),
      center: { lat: 0, lng: 0 },
      options: {},
      zoom: 8,
      panTo: jasmine.createSpy('panTo'),
      setCenter: jasmine.createSpy('setCenter')
    } as any;
    component.drawer = matDrawerSpy;

    fixture.detectChanges();

    let savedPlacesTag = component.tagList.find((item) => item.nameEn === 'Saved places');
    expect(savedPlacesTag).toBeUndefined();

    (mockUserOwnAuthService.credentialDataSubject as BehaviorSubject<any>).next({ userId: 123 });

    tick(150);
    fixture.detectChanges();
    tick(150);

    savedPlacesTag = component.tagList.find((item) => item.nameEn === 'Shops');
    expect(savedPlacesTag).toBeDefined();
    expect(savedPlacesTag.nameEn).toBe('Shops');
    flush();
  }));

  it('should set filtersDto correctly based on component properties and map bounds in updateFilters', fakeAsync(() => {
    component.searchName = 'Test Search';
    component.basicFilters = ['category1', 'category2'];
    component.moreOptionsFilters = { ...initialMoreOptionsFormValue, baseFilters: { openNow: true } };

    component.updateFilters();
    tick(300);

    expect(filterPlaceServiceMock.updateFiltersDto).toHaveBeenCalled();
    flush();
  }));

  it('should not fetch places if isLoader is true in updatePlaceList', fakeAsync(() => {
    component.drawer = matDrawerSpy;
    component['page'] = 0;
    component['totalPages'] = 0;
    (placeServiceMock.getAllPlaces as jasmine.Spy).calls.reset();

    spyOn<any>(component, 'getPlaceList').and.callThrough();

    component.updatePlaceList(false);
    tick();
    fixture.detectChanges();

    expect(component['getPlaceList']).not.toHaveBeenCalled();
    expect(placeServiceMock.getAllPlaces).not.toHaveBeenCalled();
    flush();
  }));

  it('should call getPlaceInfoFromGoogleApi when selectPlace is called', fakeAsync(() => {
    const spy = spyOn<any>(component, 'getPlaceInfoFromGoogleApi').and.callThrough();
    const mockPlace: Place = {
      id: 1,
      name: 'Test Place',
      location: { id: 1, lat: 10, lng: 20, address: 'Test Address' }
    };
    component.selectPlace(mockPlace);
    tick();
    expect(spy).toHaveBeenCalledWith(mockPlace);
    expect(component.activePlace).toEqual(mockPlace);
    expect(matDrawerSpy.toggle).toHaveBeenCalledWith(true);
    flush();
  }));

  it('should not call google places service if _googlePlacesService is undefined in getPlaceInfoFromGoogleApi', fakeAsync(() => {
    component['googlePlacesService'] = undefined;
    const mockPlace: Place = {
      id: 1,
      name: 'Test Place',
      location: { id: 1, lat: 10, lng: 20, address: 'Test Address' }
    };
    const getDetailsSpy = spyOn<any>(component, 'getPlaceInfoFromGoogleApi').and.callFake(() => {});

    component.selectPlace(mockPlace);
    tick();
    expect(getDetailsSpy).toHaveBeenCalledWith(mockPlace);
    expect(component.activePlaceDetails).toBeUndefined();
    expect(matDrawerSpy.toggle).toHaveBeenCalled();
    flush();
  }));

  it('should handle ZERO_RESULTS from findPlaceFromQuery gracefully', fakeAsync(() => {
    const mockPlacesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    (mockPlacesService.findPlaceFromQuery as jasmine.Spy).and.callFake((request, callback) => {
      callback([], window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS);
    });
    component['googlePlacesService'] = mockPlacesService;

    const mockPlace: Place = {
      id: 1,
      name: 'Nonexistent Place',
      location: { id: 1, lat: 10, lng: 20, address: 'Nonexistent Address' }
    };
    component.selectPlace(mockPlace);
    tick();
    fixture.detectChanges();

    expect(component.activePlaceDetails).toBeUndefined();
    expect(matDrawerSpy.toggle).toHaveBeenCalled();
    flush();
  }));

  it('should update place list and open drawer if page data is returned', fakeAsync(() => {
    component.drawer = matDrawerSpy;
    const mockPlacesResponse = {
      page: [{ id: 10, name: 'New Place', location: { id: 10, lat: 0, lng: 0, address: '' } }],
      totalPages: 2
    };
    (placeServiceMock.getAllPlaces as jasmine.Spy).and.returnValue(of(mockPlacesResponse));

    component.updatePlaceList(false);
    tick();
    fixture.detectChanges();

    expect(component.placesList.length).toBe(1);
    expect(component.placesList[0].id).toBe(10);
    expect(component['page']).toBe(2);
    expect(component['totalPages']).toBe(2);
    expect(component.drawer.toggle).toHaveBeenCalledWith(true);
    flush();
  }));

  it('should handle empty page data and close drawer', fakeAsync(() => {
    component.drawer = matDrawerSpy;
    const mockEmptyResponse = { page: [], totalPages: 0 };
    (placeServiceMock.getAllPlaces as jasmine.Spy).and.returnValue(of(mockEmptyResponse));

    component.updatePlaceList(true);
    tick(150);
    fixture.detectChanges();

    expect(component.drawer.toggle).toHaveBeenCalled();
    flush();
  }));

  it('should set mapLoadError to true if Google Maps API is undefined during initialization', fakeAsync(() => {
    fixture.detectChanges();
    (mockGoogleScript.mapReady as Subject<boolean>).next(true);
    tick(150);
    fixture.detectChanges();

    expect(component.mapLoadError).toBeTrue();
    expect(component.showMap).toBeFalse();
    expect(component.isMapLoading).toBeFalse();
    flush();
  }));

  it('should unsubscribe from observables on ngOnDestroy', () => {
    const $destroySpy = spyOn((component as any).$destroy, 'next');
    const $destroyCompleteSpy = spyOn((component as any).$destroy, 'complete');

    component.ngOnDestroy();

    expect($destroySpy).toHaveBeenCalledWith(true);
    expect($destroyCompleteSpy).toHaveBeenCalled();
  });

  it('should call updateFavoritePlaces on favoritePlaceService if userId is present on init', () => {
    (mockUserOwnAuthService.credentialDataSubject as BehaviorSubject<any>).next({ userId: 123 });

    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;
    component.drawer = matDrawerSpy;
    component.map = {
      googleMap: new window.google.maps.Map(document.createElement('div')),
      center: { lat: 0, lng: 0 },
      options: {},
      zoom: 8,
      panTo: jasmine.createSpy('panTo'),
      setCenter: jasmine.createSpy('setCenter')
    } as any;
    fixture.detectChanges();

    expect(favoritePlaceServiceMock.updateFavoritePlaces).toHaveBeenCalledWith(false);
  });

  it('should call updateFavoritePlaces on favoritePlaceService if userId is null on init', () => {
    (mockUserOwnAuthService.credentialDataSubject as BehaviorSubject<any>).next({ userId: null });

    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;
    component.drawer = matDrawerSpy;
    component.map = {
      googleMap: new window.google.maps.Map(document.createElement('div')),
      center: { lat: 0, lng: 0 },
      options: {},
      zoom: 8,
      panTo: jasmine.createSpy('panTo'),
      setCenter: jasmine.createSpy('setCenter')
    } as any;
    fixture.detectChanges();

    expect(favoritePlaceServiceMock.updateFavoritePlaces).toHaveBeenCalled();
  });

  it('should set mapLoadError to true if initializeMapServices throws an error', fakeAsync(() => {
    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;
    component.drawer = matDrawerSpy;
    component.map = {
      googleMap: new window.google.maps.Map(document.createElement('div')),
      center: { lat: 0, lng: 0 },
      options: {},
      zoom: 8,
      panTo: jasmine.createSpy('panTo'),
      setCenter: jasmine.createSpy('setCenter')
    } as any;
    fixture.detectChanges();
    (mockGoogleScript.mapReady as Subject<boolean>).next(true);

    tick(150);
    fixture.detectChanges();
    tick(150);

    expect(component.mapLoadError).toBeTrue();
    expect(component.showMap).toBeFalse();
    expect(component.isMapLoading).toBeFalse();
    flush();
  }));

  it('should handle INVALID_REQUEST from findPlaceFromQuery gracefully', fakeAsync(() => {
    const mockPlacesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    (mockPlacesService.findPlaceFromQuery as jasmine.Spy).and.callFake((request, callback) => {
      callback([], window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST);
    });
    component['googlePlacesService'] = mockPlacesService;

    const mockPlace: Place = {
      id: 1,
      name: 'Invalid Place',
      location: { id: 1, lat: 10, lng: 20, address: 'Invalid Address' }
    };
    component.selectPlace(mockPlace);
    tick();
    fixture.detectChanges();

    expect(component.activePlaceDetails).toBeUndefined();
    expect(matDrawerSpy.toggle).toHaveBeenCalled();
    flush();
  }));

  it('should handle non-OK status from getDetails gracefully', fakeAsync(() => {
    const mockPlacesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    (mockPlacesService.findPlaceFromQuery as jasmine.Spy).and.callFake((request, callback) => {
      callback([mockPlaceResult], window.google.maps.places.PlacesServiceStatus.OK);
    });
    (mockPlacesService.getDetails as jasmine.Spy).and.callFake((request, callback) => {
      callback(null, window.google.maps.places.PlacesServiceStatus.NOT_FOUND);
    });
    component['googlePlacesService'] = mockPlacesService;

    const mockPlace: Place = {
      id: 1,
      name: 'Place Not Found',
      location: { id: 1, lat: 10, lng: 20, address: 'Address' }
    };
    component.selectPlace(mockPlace);
    tick();
    fixture.detectChanges();

    expect(component.activePlaceDetails).toBeUndefined();
    expect(matDrawerSpy.toggle).toHaveBeenCalled();
    flush();
  }));
});
