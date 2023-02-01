import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NewsListGalleryViewComponent } from './news-list-gallery-view.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from 'src/app/main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';

fdescribe('NewsListGalleryViewComponent', () => {
  let component: NewsListGalleryViewComponent;
  let fixture: ComponentFixture<NewsListGalleryViewComponent>;
  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';
  const ecoNewsMock: EcoNewsModel = {
    id: 1,
    imagePath: defaultImagePath,
    title: 'string',
    content: 'string',
    author: {
      id: 1,
      name: 'string'
    },
    tags: ['test'],
    tagsEn: ['test'],
    tagsUa: ['test'],

    creationDate: '11',
    likes: 0,
    countComments: 2,
    shortInfo: 'info',
    source: null
  };

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [NewsListGalleryViewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: LanguageService, useValue: languageServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListGalleryViewComponent);
    component = fixture.componentInstance;
    component.ecoNewsModel = ecoNewsMock;
    component.profileIcons.newsDefaultPictureList = defaultImagePath;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set current Language and tags onInit', () => {
    languageServiceMock.getLangValue.and.returnValue(['Події', 'Освіта']);
    component.ngOnInit();
    expect(component.currentLang).toBe('ua');
    expect(component.tags).toEqual(['Події', 'Освіта']);
  });

  it('should get default image', () => {
    ecoNewsMock.imagePath = ' ';
    component.checkNewsImage();
    expect(component.newsImage).toBe(defaultImagePath);
  });
});
