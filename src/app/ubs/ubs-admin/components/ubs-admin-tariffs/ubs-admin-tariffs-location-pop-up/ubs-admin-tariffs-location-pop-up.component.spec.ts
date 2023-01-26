import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { Locations } from '../../../models/tariffs.interface';
import { TariffsService } from '../../../services/tariffs.service';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';

import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up.component';

describe('UbsAdminTariffsLocationPopUpComponent ', () => {
  let component: UbsAdminTariffsLocationPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsLocationPopUpComponent>;

  const mockRegion = [
    {
      regionId: 0,
      regionTranslationDtos: [
        {
          regionName: 'Фейк область',
          languageCode: 'ua'
        },
        {
          regionName: 'Fake region',
          languageCode: 'en'
        }
      ],
      locationsDto: [
        {
          locationTranslationDtoList: [
            {
              locationName: 'Фейк1',
              languageCode: 'ua'
            },
            {
              locationName: 'Fake1',
              languageCode: 'en'
            }
          ]
        },
        {
          locationTranslationDtoList: [
            {
              locationName: 'Фейк2',
              languageCode: 'ua'
            },
            {
              locationName: 'Fake2',
              languageCode: 'en'
            }
          ]
        }
      ]
    }
  ];

  const mockCities = [
    {
      locationTranslationDtoList: [
        {
          locationName: 'Фейк1',
          languageCode: 'ua'
        },
        {
          locationName: 'Fake1',
          languageCode: 'en'
        }
      ]
    },
    {
      locationTranslationDtoList: [
        {
          locationName: 'Фейк2',
          languageCode: 'ua'
        },
        {
          locationName: 'Fake2',
          languageCode: 'en'
        }
      ]
    }
  ];

  const localItem = {
    location: 'фейк',
    englishLocation: 'fake',
    latitute: 0,
    longitude: 0
  };

  const editedItem = {
    location: 'фейк',
    englishLocation: 'fake',
    locationId: 0
  };

  const fakeLocations: Locations = {
    locationsDto: [
      {
        latitude: 0,
        locationStatus: 'фейк1',
        locationId: 159,
        locationTranslationDtoList: [
          {
            languageCode: 'ua',
            locationName: 'fake'
          }
        ],
        longitude: 0
      }
    ],
    regionId: 1,
    regionTranslationDtos: [
      {
        regionName: 'fake',
        languageCode: 'ua'
      }
    ]
  };

  const eventMockCity = {
    option: {
      value: {
        latitude: 0,
        locationId: 1,
        locationStatus: 'ACTIVE',
        locationTranslationDtoList: [
          { locationName: 'фейк', languageCode: 'ua' },
          { locationName: 'fake', languageCode: 'en' }
        ],
        longitude: 0
      }
    }
  };

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['firstNameBehaviourSubject', 'languageBehaviourSubject']);
  localStorageServiceMock.firstNameBehaviourSubject = new BehaviorSubject('user');
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ locations: { locations: [fakeLocations] } }));

  const tariifsServiceMock = jasmine.createSpyObj('tariiffsService', ['getJSON']);
  tariifsServiceMock.getJSON.and.returnValue(of('fake'));

  const inputsMock = { nativeElement: { value: 'fake' } };

  const googleScriptMock = jasmine.createSpyObj('googleService', ['load']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, ReactiveFormsModule, MatAutocompleteModule],
      declarations: [UbsAdminTariffsLocationPopUpComponent],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: TariffsService, useValue: tariifsServiceMock },
        { provide: GoogleScript, useValue: googleScriptMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsLocationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.input = inputsMock;
    component.locations = mockRegion;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return a list of cities', () => {
    component.selectCities(mockRegion);
    expect(component.cities).toEqual(['Фейк1', 'Фейк2']);
  });

  it('should return a list of cities in english', () => {
    component.selectCities(mockRegion);
    expect(component.enCities).toEqual(['Fake1', 'Fake2']);
  });

  it('should get a list of cities when region is selected', () => {
    component.selectCities(mockRegion);
    expect(component.filteredCities).toEqual(mockCities);
  });

  it('should return a id of selected region', () => {
    component.selectCities(mockRegion);
    expect(component.regionId).toEqual(0);
  });

  it('should not return a list of cities if region is empty', () => {
    component.selectCities([]);
    expect(component.cities).toEqual([]);
  });

  it('should call add city', () => {
    const spy = spyOn(component, 'addCity');
    component.addCity();
    expect(spy).toHaveBeenCalled();
  });

  it('should not add city if input is empty', () => {
    component.location.setValue('');
    component.englishLocation.setValue('');
    component.selectedCities = [];
    component.addCity();
    expect(component.selectedCities.length).toBe(0);
  });

  it('should not add edited city if input is empty', () => {
    component.location.setValue('');
    component.englishLocation.setValue('');
    component.editedCities = [];
    component.addEditedCity();
    expect(component.editedCities.length).toBe(0);
  });

  it('should not add city if city exists', () => {
    component.cities = ['fake'];
    component.location.setValue('fake');
    component.englishLocation.setValue('enFake');
    component.selectedCities = [];
    component.addCity();
    expect(component.selectedCities.length).toBe(0);
    expect(component.location.value).toBeTruthy();
    expect(component.englishLocation.value).toBeTruthy();
  });

  it('should not add city if city not edited', () => {
    component.cities = ['фейк'];
    component.enCities = ['fake'];
    component.location.setValue('фейк');
    component.englishLocation.setValue('fake');
    component.editedCities = [];
    component.addEditedCity();
    expect(component.editedCities.length).toBe(0);
    expect(component.location.value).toBeTruthy();
    expect(component.englishLocation.value).toBeTruthy();
    expect(component.editedCityExist).toBe(true);
  });

  it('should not add city if city is not selected', () => {
    component.citySelected = false;
    component.addCity();
    expect(component.selectedCities.length).toBe(0);
    expect(component.location.value).toBe('');
    expect(component.englishLocation.value).toBe('');
  });

  it('should not add city if edited city  is not selected', () => {
    component.editedCityExist = true;
    component.addEditedCity();
    expect(component.editedCities.length).toBe(0);
    expect(component.location.value).toBe('');
    expect(component.englishLocation.value).toBe('');
  });

  it('should call getLocations from ngOnInit', () => {
    const spy = spyOn(component, 'getLocations');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should add new city when current language is ua', () => {
    component.input.nativeElement.value = 'фейк';
    component.location.setValue('фейк');
    component.englishLocation.setValue('fake');
    component.cities = [];
    component.selectedCities = [];
    component.currentLatitude = 0;
    component.currentLongitude = 0;
    component.citySelected = true;
    component.currentLang = 'ua';
    const uaLocation = component.currentLang === 'ua' ? component.location.value : component.englishLocation.value;
    const enLocation = component.currentLang === 'ua' ? component.englishLocation.value : component.location.value;
    component.addCity();
    expect(component.selectedCities.length).toBe(1);
    expect(component.location.value).toBe('');
    expect(component.englishLocation.value).toBe('');
    expect(uaLocation).toBe('фейк');
    expect(enLocation).toBe('fake');
  });

  it('should add new city when current language is en', () => {
    component.input.nativeElement.value = 'фейк';
    component.location.setValue('Київ');
    component.englishLocation.setValue('Kyiv');
    component.cities = [];
    component.selectedCities = [];
    component.citySelected = true;
    component.currentLang = 'en';
    const uaLocation = component.currentLang === 'ua' ? component.location.value : component.englishLocation.value;
    const enLocation = component.currentLang === 'ua' ? component.englishLocation.value : component.location.value;
    component.addCity();
    expect(uaLocation).toBe('Kyiv');
    expect(enLocation).toBe('Київ');
  });

  it('should add new edited city', () => {
    component.location.setValue('фейк');
    component.englishLocation.setValue('fake');
    component.editedCities = [];
    component.editLocationId = 0;
    component.addEditedCity();
    expect(component.editedCities.length).toBe(1);
    expect(component.location.value).toBe('');
    expect(component.englishLocation.value).toBe('');
  });

  it('should set value of region', () => {
    component.placeService = { getDetails: () => {} } as any;
    const spy = spyOn(component, 'setTranslation');
    const eventMock = {
      name: 'fakeName',
      place_id: 'fakeId'
    };
    component.setValueOfRegion(eventMock);
    expect(component.region.value).toBe('fakeName');
    expect(spy).toHaveBeenCalled();
  });

  it('should check language and return value', () => {
    const result = component.checkLanguage('uaVal', 'enVal');
    expect(result).toBe('uaVal');
  });

  it('should filter options', () => {
    const mockRegions = ['Фейк1', 'Фейк2'];
    const result = component._filter('Фейк1', mockRegions);
    expect(result).toEqual(['Фейк1']);
  });

  it('should translate and set text to input', () => {
    component.translate('фейк', component.englishLocation);
    expect(tariifsServiceMock.getJSON).toHaveBeenCalled();
    expect(component.englishLocation.value).toEqual('f');
  });

  it('should call getJSON on translate', () => {
    component.translate('фейк', component.englishLocation);
    expect(tariifsServiceMock.getJSON).toHaveBeenCalledWith('фейк', 'uk', 'en');
  });

  it('should set ua lang on translate', () => {
    const lang = component.currentLang === 'ua' ? 'uk' : 'en';
    component.translate('фейк', component.englishLocation);
    expect(lang).toBe('uk');
  });

  it('should set ua langTranslate on translate', () => {
    const langTranslate = component.currentLang === 'ua' ? 'en' : 'uk';
    component.translate('фейк', component.englishLocation);
    expect(langTranslate).toBe('en');
  });

  it('should find new region', () => {
    const spy = spyOn(component, 'selectCities');
    component.regionSelected = false;
    component.region.setValue('Fake region');
    expect(component.regionExist).toEqual(true);
    expect(spy).toHaveBeenCalledWith(mockRegion);
  });

  it('should call selectCities with empty value', () => {
    const spy = spyOn(component, 'selectCities');
    component.region.setValue('New region');
    component.locations = [];
    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should not find new region if regionSelected is true', () => {
    component.regionSelected = true;
    component.region.setValue('Fake region');
    expect(component.regionExist).toEqual(false);
  });

  it('should not find new region if inputs length is less than 3', () => {
    component.regionSelected = false;
    component.region.setValue('F');
    expect(component.regionExist).toEqual(false);
  });

  it('should check if city invalid', () => {
    component.location.setValue('Fake city');
    component.citySelected = false;
    expect(component.cityInvalid).toEqual(true);
  });

  it('should not check if city invalid if citySelected is true', () => {
    component.location.setValue('Fake city');
    component.citySelected = true;
    expect(component.cityInvalid).toEqual(true);
  });

  it('should not check if city invalid if inputs length is less than 3', () => {
    component.location.setValue('F');
    component.citySelected = false;
    expect(component.cityInvalid).toEqual(false);
  });

  it('should delete city from the list', () => {
    component.selectedCities.push(localItem);
    component.deleteCity(0);
    expect(component.selectedCities.length).toEqual(0);
  });

  it('should delete edited city from the list', () => {
    component.editedCities.push(localItem);
    component.deleteEditedCity(0);
    expect(component.editedCities.length).toEqual(0);
  });

  it('should set english region name', () => {
    const mockEvent = {
      option: {
        value: 'Фейк область'
      }
    };
    component.selectedEditRegion(mockEvent);
    expect(component.englishRegion.value).toEqual(['Fake region']);
  });

  it('should set english city name', () => {
    component.selectCitiesEdit(eventMockCity);
    expect(component.location.value).toEqual('фейк');
    expect(component.englishLocation.value).toEqual('fake');
    expect(component.editLocationId).toEqual(1);
  });

  it('component function addAdress should add locations', () => {
    component.selectedCities.push(localItem);
    component.addLocation();
    expect(component.createdCards.length).toBe(1);
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should edit location in the store', () => {
    component.editedCities.push(editedItem);
    component.editLocation();
    expect(component.newLocationName.length).toBe(1);
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should get locations', () => {
    component.getLocations();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('method onCancel should invoke destroyRef.close()', () => {
    component.selectedCities.push(localItem);
    component.editedCities.push(editedItem);
    matDialogMock.open.and.returnValue(fakeMatDialogRef as any);
    component.onCancel();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
    expect(matDialogMock.open).toHaveBeenCalledWith(ModalTextComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        name: 'cancel',
        text: 'modal-text.cancel-message',
        action: 'modal-text.yes'
      }
    });
  });

  it('method onCancel should invoke destroyRef.close() if selectedCities or editedCities is empty', () => {
    component.selectedCities = [];
    component.editedCities = [];
    component.onCancel();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });
});
