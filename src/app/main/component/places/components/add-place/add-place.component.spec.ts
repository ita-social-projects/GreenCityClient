import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

import { AddPlaceComponent } from './add-place.component';
import { AddressInputComponent } from '../address-input/address-input.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { PlaceService } from '@global-service/place/place.service';
import { of } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FilterPlaceCategories } from '../../models/place';
import { NewsTagInterface } from '@user-models/news.model';
import { CreatePlaceModel, OpeningHoursDto } from '../../models/create-place.model';
import { WorkingTime } from '../../models/week-pick-model';
import { FilterModel } from '@shared/components/tag-filter/tag-filter.model';
import { tagsListPlacesData } from '../../models/places-consts';

describe('AddPlaceComponent', () => {
  let component: AddPlaceComponent;
  let fixture: ComponentFixture<AddPlaceComponent>;
  const mockedFilterCategories: FilterPlaceCategories[] = [
    { id: 1, name: 'Vegan products', nameUa: 'Вегетаріанські продукти' },
    { id: 2, name: 'Charging station', nameUa: 'Зарядні станції' },
    { id: 3, name: 'Bike parking', nameUa: 'Парковка для мотоциклів' },
    { id: 4, name: 'Cycling routes', nameUa: 'Велосипедні маршрути' },
    { id: 5, name: 'Hotels', nameUa: 'Готелі' },
    { id: 6, name: 'Shops', nameUa: 'Магазини' },
    { id: 7, name: 'Restaurants', nameUa: 'Ресторани' },
    { id: 8, name: 'Recycling points', nameUa: 'Станції приймання' },
    { id: 9, name: 'Events', nameUa: 'Події' },
    { id: 10, name: 'Bike rentals', nameUa: 'Оренда мотоциклів' }
  ];
  const tagsArray: Array<FilterModel> = tagsListPlacesData;
  const workingHour: WorkingTime = {
    dayOfWeek: 'Test',
    isSelected: true,
    timeFrom: '08:00',
    timeTo: '20:00'
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
  const mockedPlaceService = jasmine.createSpyObj('placeService', ['getAllFilterPlaceCategories', 'getAllPresentTags']);
  mockedPlaceService.getAllFilterPlaceCategories.and.returnValue(of(mockedFilterCategories));
  mockedPlaceService.getAllPresentTags.and.returnValue(of(tagsArray));
  const mockedLocalStorage = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage']);
  mockedLocalStorage.getCurrentLanguage.and.returnValue = 'en';

  const event = [workingHour, { dayOfWeek: 'false', isSelected: false, timeFrom: '08:00', timeTo: '20:00' }];
  const addressDataEvent = 'вулиця Героїв УПА, 76, Львів, Львівська область, 79000';

  beforeEach(async(() => {
    const matDialogRefStub = () => ({ close: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatMenuModule, HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [AddPlaceComponent, AddressInputComponent],
      providers: [
        DatePipe,
        { provide: MatDialogRef, useFactory: matDialogRefStub },
        { provide: PlaceService, useValue: mockedPlaceService },
        { provide: LocalStorageService, useValue: mockedLocalStorage }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('component should initialize with correct values', () => {
    const langSpy = spyOn(component, 'bindLang');
    const spy = spyOn(component, 'initForm');
    component.ngOnInit();
    expect(component.filterCategories).toEqual(mockedFilterCategories);
    expect(component.tagList).toEqual(tagsArray);
    expect(component.type.value).toEqual('');
    expect(component.type.value).toEqual('');
    expect(component.name.value).toEqual('');
    expect(spy).toHaveBeenCalled();
    expect(langSpy).toHaveBeenCalled();
  });

  it('component should initialize from with correct parameters', () => {
    component.initForm();
    expect(component.addPlaceForm.get('type').value).toEqual('');
    expect(component.addPlaceForm.get('name').value).toEqual('');
    expect(component.addPlaceForm.get('address').value).toEqual('');
  });

  it('pop up should close', () => {
    const spy = spyOn(component.matDialogRef, 'close');
    component.cancel();
    expect(spy).toHaveBeenCalled();
  });

  it('value of form should clear', () => {
    component.name.setValue('Test');
    component.type.setValue('Test');
    component.address.setValue('Test');
    component.clear('name');
    component.clear('type');
    component.clear('address');
    expect(component.name.value).toEqual('');
    expect(component.type.value).toEqual('');
    expect(component.address.value).toEqual('');
  });

  it('should get parameters from form', () => {
    const spy = spyOn(component.matDialogRef, 'close');

    component.name.setValue('Test');
    component.type.setValue('Test');
    component.address.setValue('Test');
    component.workingTime = [workingHour];

    component.addPlace();

    expect(spy).toHaveBeenCalledWith(parametersToSend);
  });

  it('component should initialized time of work', () => {
    component.getTimeOfWork(event);
    expect(component.workingTime).toEqual([workingHour]);
  });

  it('should call translate service', () => {
    const spy = spyOn(component.translate, 'setDefaultLang');
    component.bindLang('en');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('en');
  });

  it('component should emit address', () => {
    const spy = spyOn(component.getAddressData, 'emit');
    component.onLocationSelected(addressDataEvent);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(addressDataEvent);
  });
});
