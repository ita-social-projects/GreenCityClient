import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { PlacesComponent } from './places.component';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { PlaceService } from 'src/app/shared/services/place/place.service';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { AllAboutPlace, Place } from './models/place';
import { FilterPlaceService } from 'src/app/shared/services/filtering/filter-place.service';
import { PlaceStatus } from 'src/app/shared/models/placeStatus.model';
import { FavoritePlaceService } from 'src/app/greencity/modules/places/services/favorite-place/favorite-place.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatePlaceModel, OpeningHoursDto } from './models/create-place.model';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { tagsListPlacesData } from './models/places-consts';
import { FilterModel } from 'src/app/greencity/shared/components/tag-filter/tag-filter.model';
import { ActivatedRoute } from '@angular/router';
import { GoogleScript } from '@assets/google-script/google-script';

const activatedRouteMock = {
  queryParams: of({ section: 'places' })
};

describe('PlacesComponent', () => {
  let component: PlacesComponent;
  let fixture: ComponentFixture<PlacesComponent>;
  let tagsArray: Array<FilterModel> = tagsListPlacesData;

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageSubject',
    'getUserId'
  ]);

  localStorageServiceMock.languageSubject = new Subject();

  const locationAddressAndGeoDtoMock: any = {
    locationAddressAndGeoDto: {
      lat: 33.2,
      lng: 33.4
    }
  };

  const placeServiceMock: PlaceService = jasmine.createSpyObj('PlaceService', [
    'getPlaceInfo',
    'updatePlaces',
    'createPlace',
    'getAllPlaces'
  ]);

  placeServiceMock.places$ = new Subject<Place[]>();
  placeServiceMock.createPlace = () => of(locationAddressAndGeoDtoMock);
  placeServiceMock.getAllPlaces = () => of();
  const filterPlaceServiceMock: FilterPlaceService = jasmine.createSpyObj('FilterPlaceService', ['updateFiltersDto']);
  filterPlaceServiceMock.filtersDto$ = new BehaviorSubject<any>({ status: PlaceStatus.APPROVED });
  filterPlaceServiceMock.isFavoriteFilter$ = new BehaviorSubject<boolean>(true);
  localStorageServiceMock.languageSubject.unsubscribe = jasmine.createSpy();

  const favoritePlaceServiceMock: FavoritePlaceService = jasmine.createSpyObj('FavoritePlaceService', [
    'updateFavoritePlaces',
    'deleteFavoritePlace',
    'addFavoritePlace'
  ]);

  const placeMock: AllAboutPlace = {
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
    modifiedDate: null,
    isFavorite: true
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
  favoritePlaceServiceMock.favoritePlaces$ = new BehaviorSubject<Place[]>([]);
  const matDialogFake = jasmine.createSpyObj('matDialog', ['open']);
  matDialogFake.open.and.returnValue({ afterClosed: () => of(parametersToSend) });

  const mockGoogleScript = { $isRenderingMap: of(false) };
  const mockPlaceResult = {
    name: 'Test Place',
    place_id: 'abc123',
    geometry: {
      location: {
        lat: () => 49.840224,
        lng: () => 24.022174
      }
    }
  } as google.maps.places.PlaceResult;
  const fakeGoogleMap = {
    setCenter: jasmine.createSpy('setCenter')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlacesComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, InfiniteScrollModule],
      providers: [
        {
          provide: LocalStorageService,
          useValue: localStorageServiceMock
        },
        {
          provide: FilterPlaceService,
          useValue: filterPlaceServiceMock
        },
        {
          provide: PlaceService,
          useValue: placeServiceMock
        },
        {
          provide: FavoritePlaceService,
          useValue: favoritePlaceServiceMock
        },
        {
          provide: MatDialog,
          useValue: matDialogFake
        },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: GoogleScript, useValue: mockGoogleScript }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    window.google = {
      maps: {
        places: {
          PlacesService: jasmine.createSpy('PlacesService').and.callFake(function (map) {
            this.map = map;
          })
        }
      }
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct parameters', () => {
    component.ngOnInit();
    if (!component.userId) {
      tagsArray = tagsArray.filter((item) => item.nameEn !== 'Saved places');
    }
    expect(component.tagList).toEqual(tagsArray);
  });

  it('should toggle the favorite status of a place correctly', () => {
    component.toggleFavoriteFromSideBar(placeMock);
    expect(placeMock.isFavorite).toBeFalsy();
    component.toggleFavoriteFromSideBar(placeMock);
    expect(placeMock.isFavorite).toBeTruthy();
  });

  it(`should select a place from the sidebar and trigger the 'selectPlace' method`, () => {
    const spy = spyOn(component, 'selectPlace');
    component.selectPlaceFromSideBar(placeMock);
    expect(spy).toHaveBeenCalled();
  });

  it('should set isRenderingMap and call updateFilters when map becomes idle', fakeAsync(() => {
    const updateFiltersSpy = spyOn(component, 'updateFilters');

    component['$destroy'] = new Subject<boolean>();
    component['isRenderingMap'] = true;

    component.onMapIdle();
    tick(1000);

    expect(component['isRenderingMap']).toBeFalse();
    expect(updateFiltersSpy).toHaveBeenCalled();
  }));

  it('should clear activePlace and activePlaceDetails when closePlaceInformation is called', () => {
    component.activePlace = placeMock;
    component.activePlaceDetails = mockPlaceResult;

    component.closePlaceInformation();

    expect(component.activePlace).toBeUndefined();
    expect(component.activePlaceDetails).toBeUndefined();
  });

  it('should create googlePlacesService if map.googleMap exists', () => {
    component.map = { googleMap: fakeGoogleMap } as any;

    component.ngAfterViewInit();

    expect(component._googlePlacesService).toBeDefined();
    expect(window.google.maps.places.PlacesService).toHaveBeenCalledWith(fakeGoogleMap);
  });

  it('should not create googlePlacesService if map.googleMap is null', () => {
    component.map = { googleMap: null } as any;

    component.ngAfterViewInit();

    expect(component._googlePlacesService).toBeUndefined();
    expect(window.google.maps.places.PlacesService).not.toHaveBeenCalled();
  });

  it('should not create googlePlacesService if map is undefined', () => {
    component.map = undefined;

    component.ngAfterViewInit();

    expect(component._googlePlacesService).toBeUndefined();
    expect(window.google.maps.places.PlacesService).not.toHaveBeenCalled();
  });

  afterEach(() => {
    delete window.google;
    spyOn(component, 'ngOnDestroy').and.callFake(() => {});
    fixture.destroy();
  });
});
