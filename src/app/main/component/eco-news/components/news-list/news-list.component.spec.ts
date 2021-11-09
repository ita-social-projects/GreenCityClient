import { SharedMainModule } from '@shared/shared-main.module';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NewsListListViewComponent } from './news-list-list-view/news-list-list-view.component';
import { NewsListGalleryViewComponent } from '..';
import { ChangeViewButtonComponent } from './change-view-button/change-view-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsListComponent } from './news-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RemainingCountComponent } from '../remaining-count/remaining-count.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('NewsListComponent', () => {
  let component: NewsListComponent;
  let fixture: ComponentFixture<NewsListComponent>;

  let ecoNewsServiceMock: EcoNewsService;
  ecoNewsServiceMock = jasmine.createSpyObj('EcoNewsService', ['getAllPresentTags', 'getNewsListByTags', 'getEcoNewsListByPage']);
  ecoNewsServiceMock.getAllPresentTags = () =>
    of([
      { id: 1, name: 'News' },
      { id: 2, name: 'Ads' },
      { id: 3, name: 'Events' },
      { id: 4, name: 'Initiatives' },
      { id: 5, name: 'Education' }
    ]);
  ecoNewsServiceMock.getNewsListByTags = () => new Observable();
  ecoNewsServiceMock.getEcoNewsListByPage = () => new Observable();

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject', 'languageBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');

  let userOwnAuthServiceMock: UserOwnAuthService;
  userOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', ['getDataFromLocalStorage']);
  userOwnAuthServiceMock.getDataFromLocalStorage = () => true;
  userOwnAuthServiceMock.credentialDataSubject = new Subject();
  userOwnAuthServiceMock.isLoginUserSubject = new BehaviorSubject(true);

  beforeEach(async(() => {
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
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock }
      ]
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
    // @ts-ignore
    const spy = spyOn(component, 'getAllTags');
    // @ts-ignore
    component.setLocalizedTags();
    expect(spy).toHaveBeenCalled();
  });

  it('should add elements to current list if scroll', () => {
    // @ts-ignore
    const spy = spyOn(component, 'addElemsToCurrentList');
    component.onScroll();
    expect(component.scroll).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should change current page', () => {
    // @ts-ignore
    component.currentPage = 5;
    // @ts-ignore
    component.changeCurrentPage();
    // @ts-ignore
    expect(component.currentPage).toBe(6);
  });

  it('should change view', () => {
    component.changeView(true);
    expect(component.view).toBeTruthy();
  });

  it('should set list with news', () => {
    const listMock = {
      totalElements: 25,
      page: [
        {
          id: 11,
          imagePath: 'somepath',
          title: 'somestring',
          text: 'sometext',
          author: { id: 125, name: 'somename' },
          tags: [{ id: 77, name: 'stringname' }],
          creationDate: 'somedate',
          likes: 0,
          countComments: 2
        }
      ],
      currentPage: 1
    };
    component.scroll = false;
    // @ts-ignore
    component.setList(listMock);
    expect(component.remaining).toBe(25);
    expect(component.elements).toEqual(listMock.page);
    expect(component.elementsArePresent).toBeTruthy();
  });

  it('should set default number of news', () => {
    // @ts-ignore
    component.setDefaultNumberOfNews(12);
    expect(component.numberOfNews).toBe(12);
  });

  it('should check if user logged in', () => {
    let userID = null;
    // @ts-ignore
    component.userOwnAuthService.isLoginUserSubject.subscribe((id) => (userID = id));
    expect(userID).toBeDefined();
  });

  it('should filter data', () => {
    const mockTag = ['Ads'];
    // @ts-ignore
    const spy = spyOn(component, 'setNullList');
    component.getFilterData(mockTag);
    expect(spy).toHaveBeenCalled();
    expect(component.tagsList).toEqual(['Ads']);
  });

  it('should resize window and set view', () => {
    // @ts-ignore
    const spy = spyOn(component, 'getSessionStorageView');
    component.onResize();
    expect(spy).toHaveBeenCalled();
    expect(component.view).toBeDefined();
  });

  it('should get value from sessionStorage', () => {
    const store = { viewGallery: 'true' };
    const spy = spyOn(sessionStorage, 'getItem').and.callFake((key) => {
      return store[key];
    });
    // @ts-ignore
    component.getSessionStorageView();
    expect(spy('viewGallery')).toBe('true');
  });
});
