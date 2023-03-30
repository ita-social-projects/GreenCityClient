import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PlacesComponent } from './places.component';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { PlaceService } from '@global-service/place/place.service';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { Place } from './models/place';
import { FilterPlaceService } from '@global-service/filtering/filter-place.service';
import { PlaceStatus } from '@global-models/placeStatus.model';
import { FavoritePlaceService } from '@global-service/favorite-place/favorite-place.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatePlaceModel, OpeningHoursDto } from './models/create-place.model';
import { Location } from '@angular-material-extensions/google-maps-autocomplete/lib/interfaces/location.interface';

describe('PlacesComponent', () => {
  let component: PlacesComponent;
  let fixture: ComponentFixture<PlacesComponent>;

  const tagsArray = [
    { id: 1, name: 'Events', nameUa: 'Події' },
    { id: 2, name: 'Education', nameUa: 'Освіта' }
  ];

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageSubject'
  ]);

  localStorageServiceMock.languageSubject = new Subject();

  const locationAddressAndGeoDtoMock: any = {
    locationAddressAndGeoDto: {
      lat: 33.2,
      lng: 33.4
    }
  };

  const fakeLocation: Location = {
    latitude: 33.2,
    longitude: 33.4
  };

  const placeServiceMock: PlaceService = jasmine.createSpyObj('PlaceService', ['getPlaceInfo', 'updatePlaces', 'createPlace']);
  placeServiceMock.places$ = new Subject<Place[]>();
  placeServiceMock.getAllPresentTags = () => of(tagsArray);
  placeServiceMock.createPlace = () => of(locationAddressAndGeoDtoMock);

  const filterPlaceServiceMock: FilterPlaceService = jasmine.createSpyObj('FilterPlaceService', ['updateFiltersDto']);
  filterPlaceServiceMock.filtersDto$ = new BehaviorSubject<any>({ status: PlaceStatus.APPROVED });
  filterPlaceServiceMock.isFavoriteFilter$ = new BehaviorSubject<boolean>(true);

  const favoritePlaceServiceMock: FavoritePlaceService = jasmine.createSpyObj('FavoritePlaceService', [
    'updateFavoritePlaces',
    'deleteFavoritePlace',
    'addFavoritePlace'
  ]);
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlacesComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule],
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
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should called subscribeToLangChange method one time', () => {
    const subscribeToLangChangeSpy = spyOn(component as any, 'subscribeToLangChange');
    component.ngOnInit();
    expect(subscribeToLangChangeSpy).toHaveBeenCalledTimes(1);
  });

  it(`bindLang should be called in ngOnInit`, () => {
    spyOn(component, 'bindLang');
    component.ngOnInit();
    expect(component.bindLang).toHaveBeenCalled();
  });

  it('should initialize with correct parameters', () => {
    component.ngOnInit();

    expect(component.tagList).toEqual(tagsArray);
  });

  it('Should open popup, and after closed receive data', () => {
    const spy = spyOn(component, 'onLocationSelected');
    component.openTimePickerPopUp();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(fakeLocation);
  });
});
