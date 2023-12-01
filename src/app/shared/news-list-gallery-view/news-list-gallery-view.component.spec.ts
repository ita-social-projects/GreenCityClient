import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NewsListGalleryViewComponent } from './news-list-gallery-view.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from 'src/app/main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { FIRSTECONEWS } from 'src/app/main/component/eco-news/mocks/eco-news-mock';

describe('NewsListGalleryViewComponent', () => {
  let component: NewsListGalleryViewComponent;
  let fixture: ComponentFixture<NewsListGalleryViewComponent>;
  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);

  beforeEach(waitForAsync(() => {
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
    component.ecoNewsModel = FIRSTECONEWS;
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
    FIRSTECONEWS.imagePath = ' ';
    component.checkNewsImage();
    expect(component.newsImage).toBe(defaultImagePath);
  });
});
