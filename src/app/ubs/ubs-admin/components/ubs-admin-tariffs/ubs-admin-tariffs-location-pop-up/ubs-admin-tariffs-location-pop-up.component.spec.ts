import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TariffsService } from '../../../services/tariffs.service';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';

import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up.component';

describe('UbsAdminTariffsLocationPopUpComponent ', () => {
  let component: UbsAdminTariffsLocationPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsLocationPopUpComponent>;

  const mockRegion = [
    {
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

  const localItem = {
    location: 'фейк',
    englishLocation: 'fake',
    latitute: 0,
    longitude: 0
  };

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(true, true);

  const tariifsServiceMock = jasmine.createSpyObj('tariiffsService', ['getJSON']);
  tariifsServiceMock.getJSON.and.returnValue(of('fake'));

  const inputsMock = { nativeElement: { value: 'fake' } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, ReactiveFormsModule],
      declarations: [UbsAdminTariffsLocationPopUpComponent],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: Store, useValue: storeMock },
        { provide: TariffsService, useValue: tariifsServiceMock }
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

  it('should not return a list of cities if region is empty', () => {
    component.selectCities([]);
    expect(component.cities).toEqual([]);
  });

  it('should not add city if input is empty', () => {
    component.location.setValue('');
    component.englishLocation.setValue('');
    component.selectedCities = [];
    component.addCity();
    expect(component.selectedCities.length).toBe(0);
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

  it('should not add city if city is not selected', () => {
    component.citySelected = false;
    component.addCity();
    expect(component.selectedCities.length).toBe(0);
    expect(component.location.value).toBe('');
    expect(component.englishLocation.value).toBe('');
  });

  it('should call getLocations from ngOnInit', () => {
    const spy = spyOn(component, 'getLocations');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should add new city', () => {
    component.input.nativeElement.value = 'фейк';
    component.location.setValue('фейк');
    component.englishLocation.setValue('fake');
    component.cities = [];
    component.selectedCities = [];
    component.currentLatitude = 0;
    component.currentLongitude = 0;
    component.citySelected = true;
    component.addCity();
    expect(component.selectedCities.length).toBe(1);
    expect(component.location.value).toBe('');
    expect(component.englishLocation.value).toBe('');
  });

  it('should set value of region', () => {
    const spy = spyOn(component, 'translate');
    const eventMock = {
      name: 'fakeName'
    };
    component.setValueOfRegion(eventMock);
    expect(component.region.value).toBe('fakeName');
    expect(spy).toHaveBeenCalled();
  });

  it('should translate and set text to input', () => {
    component.translate('фейк', component.englishLocation);
    expect(tariifsServiceMock.getJSON).toHaveBeenCalled();
    expect(component.englishLocation.value).toEqual('f');
  });

  it('should find new region', () => {
    const spy = spyOn(component, 'selectCities');
    component.locations = mockRegion;
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
    component.locations = mockRegion;
    component.regionSelected = true;
    component.region.setValue('Fake region');
    expect(component.regionExist).toEqual(false);
  });

  it('should not find new region if inputs length is less than 3', () => {
    component.locations = mockRegion;
    component.regionSelected = false;
    component.region.setValue('F');
    expect(component.regionExist).toEqual(false);
  });

  it('should check if city exists', () => {
    component.location.setValue('Fake city');
    component.citySelected = false;
    expect(component.cityExist).toEqual(true);
  });

  it('should not check if city exists if citySelected is true', () => {
    component.location.setValue('Fake city');
    component.citySelected = true;
    expect(component.cityExist).toEqual(true);
  });

  it('should not check if city exists if inputs length is less than 3', () => {
    component.location.setValue('F');
    component.citySelected = false;
    expect(component.cityExist).toEqual(false);
  });

  it('should delete city from the list', () => {
    component.selectedCities.push(localItem);
    component.deleteCity(0);
    expect(component.selectedCities.length).toEqual(0);
  });

  it('component function addAdress should add locations', () => {
    component.selectedCities.push(localItem);
    component.addLocation();
    expect(component.createdCards.length).toBe(1);
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should get locations', () => {
    component.getLocations();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('method onNoClick should invoke destroyRef.close()', () => {
    matDialogMock.open.and.returnValue(fakeMatDialogRef as any);
    component.onNoClick();
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
});
