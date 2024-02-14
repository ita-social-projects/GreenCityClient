import { SharedMainModule } from '@shared/shared-main.module';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NewsListListViewComponent } from './news-list-list-view/news-list-list-view.component';
import { NewsListGalleryViewComponent } from 'src/app/shared/news-list-gallery-view/news-list-gallery-view.component';
import { ChangeViewButtonComponent } from './change-view-button/change-view-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NewsListComponent } from './news-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RemainingCountComponent } from '../remaining-count/remaining-count.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Store } from '@ngrx/store';
import { Language } from '../../../../i18n/Language';

describe('NewsListComponent', () => {
  let component: NewsListComponent;
  let fixture: ComponentFixture<NewsListComponent>;

  const ecoNewsServiceMock: EcoNewsService = jasmine.createSpyObj('EcoNewsService', [
    'getAllPresentTags',
    'getNewsListByTags',
    'getEcoNewsListByPage'
  ]);
  ecoNewsServiceMock.getAllPresentTags = () =>
    of([
      { id: 1, name: 'News', nameUa: 'Новини' },
      { id: 2, name: 'Ads', nameUa: 'Реклама' },
      { id: 3, name: 'Events', nameUa: 'Події' },
      { id: 4, name: 'Initiatives', nameUa: 'Ініціативи' },
      { id: 5, name: 'Education', nameUa: 'Освіта' }
    ]);
  ecoNewsServiceMock.getNewsListByTags = () => new Observable();
  ecoNewsServiceMock.getEcoNewsListByPage = () => new Observable();

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'userIdBehaviourSubject',
    'languageBehaviourSubject',
    'setCurentPage',
    'getCurrentLanguage'
  ]);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;

  const userOwnAuthServiceMock: UserOwnAuthService = jasmine.createSpyObj('UserOwnAuthService', ['getDataFromLocalStorage']);
  userOwnAuthServiceMock.getDataFromLocalStorage = () => true;
  userOwnAuthServiceMock.credentialDataSubject = new Subject();
  userOwnAuthServiceMock.isLoginUserSubject = new BehaviorSubject(true);

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of({ ecoNews: {}, pages: [], pageNumber: 1, error: 'error' });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewsListComponent,
        ChangeViewButtonComponent,
        NewsListGalleryViewComponent,
        NewsListListViewComponent,
        RemainingCountComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        SharedMainModule,
        SharedModule,
        InfiniteScrollModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: EcoNewsService, useValue: ecoNewsServiceMock },
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock },
        { provide: Store, useValue: storeMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set localized tags', () => {
    const spy = spyOn(component as any, 'getAllTags');

    (component as any).setLocalizedTags();
    expect(spy).toHaveBeenCalled();
  });

  it('should add elements to current list if scroll', () => {
    spyOn(component, 'dispatchStore');
    component.onScroll();
    expect(component.dispatchStore).toHaveBeenCalledTimes(1);
  });

  it('should change view', () => {
    component.changeView(true);
    expect(component.view).toBeTruthy();
  });

  it('should set default number of news', () => {
    (component as any).setDefaultNumberOfNews(12);
    expect(component.numberOfNews).toBe(12);
  });

  it('should check if user logged in', () => {
    let userID = null;

    (component as any).userOwnAuthService.isLoginUserSubject.subscribe((id) => (userID = id));
    expect(userID).toBeDefined();
  });

  it('should filter data', () => {
    spyOn(component, 'getFilterData');
    component.getFilterData(['News']);
    expect(component.getFilterData).toHaveBeenCalledWith(['News']);
  });

  it('should resize window and set view', () => {
    const spy = spyOn(component as any, 'getSessionStorageView');
    component.onResize();
    expect(spy).toHaveBeenCalled();
    expect(component.view).toBeDefined();
  });

  it('should get value from sessionStorage', () => {
    const store = { viewGallery: 'true' };
    const spy = spyOn(sessionStorage, 'getItem').and.callFake((key) => {
      return store[key];
    });

    (component as any).getSessionStorageView();
    expect(spy('viewGallery')).toBe('true');
  });
});
