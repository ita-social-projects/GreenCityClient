import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListComponent } from './events-list.component';

import { EventsService } from '../../services/events.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { eventStatusList, OptionItem, TagsArray, tempLocationList, eventTimeList } from '../../models/event-consts';
import { By } from '@angular/platform-browser';
import { MatOption } from '@angular/material/core';
import { FormControl } from '@angular/forms';

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;

  const MockReqest = {
    page: [],
    totalElements: 4
  };

  const MockData = {
    eventState: {},
    eventsList: [],
    visitedPages: [],
    totalPages: 0,
    pageNumber: 0,

    error: null
  };

  const timeFilterControl = new FormControl();
  const locationFilterControl = new FormControl();
  const statusFilterControl = new FormControl();
  const typeFilterControl = new FormControl();

  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['getEvents']);
  EventsServiceMock.getEvents = () => of(MockReqest);

  const UserOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', ['getDataFromLocalStorage', 'credentialDataSubject']);
  UserOwnAuthServiceMock.credentialDataSubject = of({ userId: 3 });

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(MockData);

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    of(valEn);
  };
  let matDialogService: jasmine.SpyObj<MatDialog>;
  matDialogService = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListComponent],
      imports: [TranslateModule.forRoot(), NgxPaginationModule, RouterTestingModule, MatDialogModule],
      providers: [
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: UserOwnAuthService, useValue: UserOwnAuthServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: MatDialog, useValue: matDialogService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    UserOwnAuthServiceMock.getDataFromLocalStorage.calls.reset();
    const spy = spyOn(component as any, 'checkUserSingIn');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(UserOwnAuthServiceMock.getDataFromLocalStorage).toHaveBeenCalledTimes(1);
  });

  it('checkUserSingIn', () => {
    (component as any).checkUserSingIn();
    expect(component.isLoggedIn).toBe(3 as any);
  });

  it('should reset all filters', () => {
    component.eventTimeList = eventTimeList;
    component.typeList = TagsArray;
    component.statusList = eventStatusList;
    component.eventLocationList = tempLocationList;
    const spy = spyOn(component, 'resetAll');
    component.resetAll();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.selectedFilters).toEqual([]);
  });

  it('should check weather deleteOneFilter works correctly', () => {
    component.selectedFilters = [
      { nameEn: 'one', nameUa: 'один' },
      { nameEn: 'two', nameUa: 'два' },
      { nameEn: 'three', nameUa: 'три' }
    ];
    const filterRemoved = [{ nameEn: 'three', nameUa: 'три' }];
    const res = [
      { nameEn: 'one', nameUa: 'один' },
      { nameEn: 'two', nameUa: 'два' }
    ];

    component.eventTimeList = eventTimeList;
    component.typeList = TagsArray;
    component.statusList = eventStatusList;
    component.eventLocationList = tempLocationList;

    const spy = spyOn(component, 'deleteOneFilter');
    component.deleteOneFilter(filterRemoved, 1);
    component.selectedFilters.pop();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.selectedFilters).toEqual(res);
  });

  it('should check weather showFavourite works correctly', () => {
    component.bookmarkSelected = false;
    component.showFavourite();
    expect(component.bookmarkSelected).toEqual(true);
  });

  it('should select all options and push them to selectedFilters when allSelectedFlags is true', () => {
    component.allSelectedFlags['dropdown1'] = true;

    const options = fixture.debugElement.queryAll(By.directive(MatOption));
    options.forEach((option) => {
      spyOn(option.componentInstance, 'select');
      spyOn(component.selectedFilters, 'push');

      option.triggerEventHandler('click', null);

      expect(option.componentInstance.select).toHaveBeenCalled();
      expect(component.selectedFilters.push).toHaveBeenCalledWith(option.componentInstance.value);
    });
  });

  it('should deselect all options and remove them from selectedFilters when allSelectedFlags is false', () => {
    component.allSelectedFlags['dropdown1'] = false;

    const options = fixture.debugElement.queryAll(By.directive(MatOption));
    options.forEach((option) => {
      spyOn(option.componentInstance, 'deselect');
      spyOn(component.selectedFilters, 'filter');

      option.triggerEventHandler('click', null);

      expect(option.componentInstance.deselect).toHaveBeenCalled();
      expect(component.selectedFilters.filter).toHaveBeenCalledWith((value) => value !== option.componentInstance.value);
    });
  });

  it('should subscribe to form control changes for all form controls', () => {
    component.timeFilterControl = timeFilterControl;
    component.locationFilterControl = locationFilterControl;
    component.statusFilterControl = statusFilterControl;
    component.typeFilterControl = typeFilterControl;

    const spy = spyOn(component, 'updateSelectedFilters');

    component.subscribeOnFormControlsChanges();

    timeFilterControl.setValue('Some value');
    locationFilterControl.setValue('Some value');
    statusFilterControl.setValue('Some value');
    typeFilterControl.setValue('Some value');

    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('should remove existing filter when deselected', () => {
    component.selectedFilters = ['filter1', 'filter2'];
    const mockEvent = { isUserInput: true, source: { selected: false } };
    component.updateSelectedFilters('filter1', mockEvent);
    expect(component.selectedFilters).toEqual(['filter2']);
  });

  it('should add new filter when selected', () => {
    component.selectedFilters = ['filter1', 'filter2'];
    const mockEvent = { isUserInput: true, source: { selected: true } };
    component.updateSelectedFilters('filter3', mockEvent);
    expect(component.selectedFilters).toEqual(['filter1', 'filter2', 'filter3']);
  });

  it('should not modify selectedFilters when no user input', () => {
    component.selectedFilters = ['filter1', 'filter2'];
    const mockEvent = { isUserInput: false, source: { selected: true } };
    component.updateSelectedFilters('filter3', mockEvent);
    expect(component.selectedFilters).toEqual(['filter1', 'filter2']);
  });

  it('should not modify selectedFilters when already deselected', () => {
    component.selectedFilters = ['filter1', 'filter2'];
    const mockEvent = { isUserInput: true, source: { selected: false } };
    component.updateSelectedFilters('filter3', mockEvent);
    expect(component.selectedFilters).toEqual(['filter1', 'filter2']);
  });

  it('should not modify selectedFilters when already selected', () => {
    component.selectedFilters = ['filter1', 'filter2'];
    const mockEvent = { isUserInput: true, source: { selected: true } };
    component.updateSelectedFilters('filter2', mockEvent);
    expect(component.selectedFilters).toEqual(['filter1', 'filter2']);
  });

  it('should check weather search works correctly', () => {
    component.searchToggle = false;
    component.search();
    expect(component.searchToggle).toEqual(true);
  });
});
