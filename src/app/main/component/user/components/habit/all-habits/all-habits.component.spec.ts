import { SharedMainModule } from '@shared/shared-main.module';
import { HabitAssignInterface } from './../../../../../interface/habit/habit-assign.interface';
import { HabitAssignService } from './../../../../../service/habit-assign/habit-assign.service';
import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HabitsListViewComponent } from './components/habits-list-view/habits-list-view.component';
import { LocalStorageService } from '../../../../../service/localstorage/local-storage.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';

import { AllHabitsComponent } from './all-habits.component';
import { HabitService } from '../../../../../service/habit/habit.service';
import { HabitListInterface } from '../../../../../interface/habit/habit.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter, Injectable } from '@angular/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Language } from '../../../../../i18n/Language';

@Injectable()
class TranslationServiceStub {
  public onLangChange = new EventEmitter<any>();
  public onTranslationChange = new EventEmitter<any>();
  public onDefaultLangChange = new EventEmitter<any>();
  public addLangs(langs: string[]) {}
  public getLangs() {
    return 'en-us';
  }
  public getBrowserLang() {
    return '';
  }
  public getBrowserCultureLang() {
    return '';
  }
  public use(lang: string) {
    return '';
  }
  public get(key: any): any {
    return of(key);
  }
  public setDefaultLang() {
    return true;
  }
}

describe('AllHabitsComponent', () => {
  let component: AllHabitsComponent;
  let fixture: ComponentFixture<AllHabitsComponent>;
  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';
  const assignedHabitsMock: Array<HabitAssignInterface> = [
    {
      createDateTime: new Date('2021-06-19T16:35:18.048839Z'),
      duration: 14,
      habit: {
        defaultDuration: 14,
        amountAcquiredUsers: 1,
        habitTranslation: {
          description: 'Test',
          habitItem: 'Test',
          languageCode: 'en',
          name: 'Test'
        },
        id: 506,
        image: '',
        tags: []
      },
      habitStatusCalendarDtoList: [],
      habitStreak: 0,
      id: 154,
      lastEnrollmentDate: new Date('2021-06-19T16:35:18.04885Z'),
      status: 'INPROGRESS',
      userId: 7835,
      workingDays: 0,
      shoppingListItems: []
    }
  ];

  const habitsMockData: HabitListInterface = {
    currentPage: 0,
    page: [
      {
        defaultDuration: 1,
        amountAcquiredUsers: 1,
        habitTranslation: {
          description: 'test',
          habitItem: 'test, best',
          languageCode: 'en',
          name: 'test'
        },
        id: 0,
        image: defaultImagePath,
        tags: ['test']
      },
      {
        defaultDuration: 1,
        amountAcquiredUsers: 1,
        habitTranslation: {
          description: 'test2',
          habitItem: 'test2',
          languageCode: 'en',
          name: 'test2'
        },
        id: 1,
        image: defaultImagePath,
        tags: ['test2']
      }
    ],
    totalElements: 2,
    totalPages: 1
  };

  const mockData = new BehaviorSubject<any>(habitsMockData);
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', [
    'userIdBehaviourSubject',
    'languageBehaviourSubject',
    'getCurrentLanguage',
    'getHabitsGalleryView',
    'setHabitsGalleryView',
    'getUserId'
  ]);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
  localStorageServiceMock.getUserId = () => 1;

  let assignHabitServiceMock: HabitAssignService;
  assignHabitServiceMock = jasmine.createSpyObj('HabitAssignService', ['getAssignedHabits']);
  assignHabitServiceMock.getAssignedHabits = () => of(assignedHabitsMock);

  let habitServiceMock: HabitService;
  habitServiceMock = jasmine.createSpyObj('HabitService', ['getAllHabits', 'getHabitsByTagAndLang']);
  habitServiceMock.getAllHabits = () => of(habitsMockData);
  habitServiceMock.getHabitsByTagAndLang = () => of(habitsMockData);
  habitServiceMock.getAllTags = () => of([{ id: 2, name: 'eco', nameUa: 'еко' }]);

  const userData = {
    city: 'string',
    name: 'string',
    userCredo: 'string',
    profilePicturePath: defaultImagePath,
    rating: null,
    showEcoPlace: true,
    showLocation: true,
    showShoppingList: true,
    socialNetworks: [{ id: 1, url: defaultImagePath }]
  };

  let profileServiceMock: ProfileService;
  profileServiceMock = jasmine.createSpyObj('ProfileService', ['getUserInfo']);
  profileServiceMock.getUserInfo = () => of(userData);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllHabitsComponent, HabitsListViewComponent],
      imports: [TranslateModule.forRoot(), SharedMainModule, InfiniteScrollModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: HabitService, useValue: habitServiceMock },
        { provide: HabitAssignService, useValue: assignHabitServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: TranslateService, useClass: TranslationServiceStub },
        { provide: ProfileService, useValue: profileServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllHabitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call methods OnInit', () => {
    const spy1 = spyOn(component, 'onResize');
    const spy2 = spyOn(component, 'checkHabitsView');
    const spy3 = spyOn(component as any, 'getAllHabitsTags');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should get Habits tags list on getAllHabitsTags', () => {
    component.tagList = [];
    (component as any).getAllHabitsTags();
    expect(component.tagList).toEqual([{ id: 2, name: 'eco', nameUa: 'еко' }]);
  });

  it('onDisplayModeChange() setting false value', () => {
    component.onDisplayModeChange(false);
    expect(localStorageServiceMock.setHabitsGalleryView).toHaveBeenCalledWith(false);
    expect(component.galleryView).toEqual(false);
  });

  it('onDisplayModeChange() setting true value', () => {
    component.onDisplayModeChange(true);
    expect(localStorageServiceMock.setHabitsGalleryView).toHaveBeenCalledWith(true);
    expect(component.galleryView).toEqual(true);
  });

  it('checkHabitsView() getting false value', () => {
    localStorageServiceMock.getHabitsGalleryView = () => false;
    component.checkHabitsView();
    expect(component.galleryView).toEqual(false);
  });

  it('checkHabitsView() getting true value', () => {
    localStorageServiceMock.getHabitsGalleryView = () => true;
    component.checkHabitsView();
    expect(component.galleryView).toEqual(true);
  });

  it('should call method setHabitsList on getAllHabits', () => {
    const spy = spyOn(component as any, 'setHabitsList');
    (component as any).getAllHabits(0, 6);
    expect(spy).toHaveBeenCalledWith(0, habitsMockData);
  });

  it('should call method setHabitsList on getHabitsByTags', () => {
    const spy = spyOn(component as any, 'setHabitsList');
    (component as any).getHabitsByTags(0, 6, ['tag']);
    expect(spy).toHaveBeenCalledWith(0, habitsMockData);
  });

  it('should set values on setHabitsList', () => {
    const page = 0;
    (component as any).setHabitsList(page, habitsMockData);
    expect(component.isFetching).toBeFalsy();
    expect(component.habitsList).toEqual(habitsMockData.page);
    expect(component.totalHabits).toEqual(habitsMockData.totalElements);
    expect((component as any).totalPages).toEqual(habitsMockData.totalPages);
    expect((component as any).currentPage).toEqual(habitsMockData.currentPage);
    expect((component as any).isAllPages).toBeTruthy();
  });

  it('should set Habits List on setHabitsList when page is 1', () => {
    component.habitsList = habitsMockData.page;
    const result = [...component.habitsList, ...habitsMockData.page];
    (component as any).setHabitsList(1, habitsMockData);
    expect(component.habitsList).toEqual(result);
  });

  it('should not call method checkIfAssigned on setHabitsList if totalElements is zero', () => {
    habitsMockData.totalElements = 0;
    const spy = spyOn(component, 'checkIfAssigned');
    (component as any).setHabitsList(0, habitsMockData);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not set selectedTagsList on getFilterData if tagsList array is empty', () => {
    component.tagList = [];
    component.getFilterData([]);
    expect(component.selectedTagsList).toEqual([]);
  });

  it('should set selectedTagsList on getFilterData if tagsList array contains tags', () => {
    component.tagList = [{ id: 2, name: 'name', nameUa: 'nameUa' }];
    const tags = ['Reusable'];
    component.getFilterData(tags);
    expect(component.selectedTagsList).toEqual(['Reusable']);
  });

  it('should call getAllHabits on getFilterData if tags is empty array', () => {
    component.tagList = [{ id: 2, name: 'name', nameUa: 'nameUa' }];
    const spy1 = spyOn(component as any, 'getAllHabits');
    const spy2 = spyOn(component as any, 'getHabitsByTags');
    const tags = [];
    component.getFilterData(tags);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should call getHabitsByTags on getFilterData if tags array contains value', () => {
    component.tagList = [{ id: 2, name: 'name', nameUa: 'nameUa' }];
    const spy1 = spyOn(component as any, 'getHabitsByTags');
    const spy2 = spyOn(component as any, 'getAllHabits');
    const tags = ['Reusable'];
    component.getFilterData(tags);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should set isFatching false and dont call methods onScroll if isAllPages is true', () => {
    (component as any).isAllPages = true;
    const spy1 = spyOn(component as any, 'getAllHabits');
    const spy2 = spyOn(component as any, 'getHabitsByTags');
    component.onScroll();
    expect(component.isFetching).toBeFalsy();
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should set isFatching true and call method getAllHabits on onScroll', () => {
    (component as any).isAllPages = false;
    component.selectedTagsList = [];
    const spy1 = spyOn(component as any, 'getAllHabits');
    const spy2 = spyOn(component as any, 'getHabitsByTags');
    component.onScroll();
    expect(component.isFetching).toBeTruthy();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should call method getHabitsByTags on onScroll', () => {
    (component as any).isAllPages = false;
    component.selectedTagsList = ['tags'];
    const spy1 = spyOn(component as any, 'getHabitsByTags');
    const spy2 = spyOn(component as any, 'getAllHabits');
    component.onScroll();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });
});
