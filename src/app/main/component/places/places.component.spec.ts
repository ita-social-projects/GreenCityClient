import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesComponent } from './places.component';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { PlaceService } from '@global-service/place/place.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Place } from './models/place';
import { FilterPlaceService } from '@global-service/filtering/filter-place.service';
import { PlaceStatus } from '@global-models/placeStatus.model';

describe('PlacesComponent', () => {
  let component: PlacesComponent;
  let fixture: ComponentFixture<PlacesComponent>;
  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  const placeServiceMock: PlaceService = jasmine.createSpyObj('PlaceService', ['getPlaceInfo', 'updatePlaces']);
  placeServiceMock.places$ = new Subject<Place[]>();
  const filterPlaceServiceMock: FilterPlaceService = jasmine.createSpyObj('FilterPlaceService', ['updateFiltersDto']);
  filterPlaceServiceMock.filtersDto$ = new BehaviorSubject<any>({ status: PlaceStatus.APPROVED });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlacesComponent],
      imports: [TranslateModule.forRoot()],
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
        }
      ]
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
});
