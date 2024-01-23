import { SharedMainModule } from '@shared/shared-main.module';
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter, Injectable } from '@angular/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Language } from '../../../../../i18n/Language';
import { HABITLIST } from '../mocks/habit-mock';
import { CUSTOMHABIT, DEFAULTHABIT, HABITSASSIGNEDLIST } from '../mocks/habit-assigned-mock';
import { FIRSTTAGITEM, SECONDTAGITEM, TAGLIST } from '../mocks/tags-list-mock';
import { EditProfileModel } from '@global-user/models/edit-profile.model';

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
  assignHabitServiceMock.getAssignedHabits = () => of(HABITSASSIGNEDLIST);

  let habitServiceMock: HabitService;
  habitServiceMock = jasmine.createSpyObj('HabitService', ['getAllHabits', 'getHabitsByFilters', 'getAllTags']);
  habitServiceMock.getAllHabits = () => of(HABITLIST);
  habitServiceMock.getHabitsByFilters = () => of(HABITLIST);
  habitServiceMock.getAllTags = () => of(TAGLIST);

  const userData = {
    userLocationDto: {
      cityUa: 'string'
    },
    name: 'string',
    userCredo: 'string',
    profilePicturePath: defaultImagePath,
    rating: null,
    showEcoPlace: true,
    showLocation: true,
    showShoppingList: true,
    socialNetworks: [{ id: 1, url: defaultImagePath }]
  } as any;

  let profileServiceMock: ProfileService;
  profileServiceMock = jasmine.createSpyObj('ProfileService', ['getUserInfo']);
  profileServiceMock.getUserInfo = () => of();

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
});
