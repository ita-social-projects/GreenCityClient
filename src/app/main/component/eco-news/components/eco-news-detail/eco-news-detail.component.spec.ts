import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoNewsDetailComponent } from './eco-news-detail.component';
import { EcoNewsWidgetComponent } from './eco-news-widget/eco-news-widget.component';
import { NewsListGalleryViewComponent } from '..';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform, Sanitizer } from '@angular/core';
import { DateLocalisationPipe } from '@pipe/date-localisation-pipe/date-localisation.pipe';

import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';
import { SafeHtmlPipe } from '@pipe/safe-html-pipe/safe-html.pipe';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Language } from '../../../../i18n/Language';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('EcoNewsDetailComponent', () => {
  let component: EcoNewsDetailComponent;
  let fixture: ComponentFixture<EcoNewsDetailComponent>;
  let httpMock: HttpTestingController;
  let route: ActivatedRoute;
  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';
  const mockEcoNewsModel: EcoNewsModel = {
    id: 3,
    imagePath: defaultImagePath,
    title: 'test title',
    content: 'some description',
    author: {
      id: 777,
      name: 'John Snow'
    },
    tags: ['Events', 'Education'],
    tagsEn: ['Events', 'Education'],
    tagsUa: ['Події', 'Освіта'],
    creationDate: '2020-06-16T18:08:00.604Z',
    likes: 0,
    countComments: 2,
    shortInfo: 'info',
    source: null
  };

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of({ pages: [mockEcoNewsModel], autorNews: [{ id: 4 }] });
  const sanitaizerMock = jasmine.createSpyObj('sanitaizer', ['bypassSecurityTrustHtml']);
  const fakeElement = document.createElement('div') as SafeHtml;
  sanitaizerMock.bypassSecurityTrustHtml.and.returnValue(fakeElement);

  const backLink = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage', 'getPreviousPage']);
  backLink.getCurrentLanguage = () => 'en' as Language;
  backLink.getPreviousPage = () => '/profile';
  backLink.userIdBehaviourSubject = new BehaviorSubject(4);
  backLink.languageSubject = of('ua');

  const ecoNewsServ = jasmine.createSpyObj('ecoNewsService', ['getEcoNewsById', 'postToggleLike', 'getIsLikedByUser']);
  ecoNewsServ.getEcoNewsById.and.returnValue(of(mockEcoNewsModel));
  ecoNewsServ.postToggleLike.and.returnValue(of({}));
  ecoNewsServ.getIsLikedByUser.and.returnValue(of(true));

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EcoNewsDetailComponent,
        EcoNewsWidgetComponent,
        NewsListGalleryViewComponent,
        TranslatePipeMock,
        DateLocalisationPipe,
        SafeHtmlPipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: EcoNewsService, useValue: ecoNewsServ },
        Sanitizer,
        { provide: DomSanitizer, useValue: sanitaizerMock },
        { provide: LocalStorageService, useValue: backLink },
        { provide: LanguageService, useValue: languageServiceMock }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    route = TestBed.inject(ActivatedRoute);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoNewsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.backRoute = '/news';
    component.newsItem = mockEcoNewsModel;
    (component as any).newsId = 3;
    (component as any).newsImage = ' ';
    component.tags = component.getAllTags();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should init four method', () => {
    const spy = spyOn(component as any, 'getUserId');
    const spy1 = spyOn(component as any, 'getIsLiked');
    const spy2 = spyOn(component as any, 'setNewsId');
    const spy3 = spyOn(component as any, 'getEcoNewsById');

    component.userId = 3;
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledWith((component as any).newsId);
  });

  it('userId null should not call getIsLiked method', () => {
    const spy = spyOn(component as any, 'getUserId');
    const spy1 = spyOn(component as any, 'getIsLiked');

    component.userId = null;
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledTimes(0);
  });

  it('ngOnInit newsId null should not call getEcoNewsById method', () => {
    const spy = spyOn(component as any, 'getEcoNewsById');

    (component as any).newsId = null;
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should set newsId', () => {
    route.snapshot.params.id = 1;
    (component as any).setNewsId();
    expect((component as any).newsId).toBe(1);
  });

  it('getEcoNewsById should get newsItem by id', () => {
    component.newsItem = null;
    component.getEcoNewsById((component as any).newsId);
    expect(component.newsItem).toEqual(mockEcoNewsModel);
  });

  it('should set backRoute', () => {
    component.backRoute = backLink.getPreviousPage();
    expect(component.backRoute).toEqual('/profile');
  });

  it('getAllTags should return array of ua tags', () => {
    languageServiceMock.getLangValue.and.returnValue(['Події', 'Освіта']);
    component.newsItem.tagsUa = ['Події', 'Освіта'];
    expect(component.getAllTags()).toEqual(['Події', 'Освіта']);
  });

  it('getAllTags should return array of tags', () => {
    component.currentLang = 'en';
    languageServiceMock.getLangValue.and.returnValue(['Events', 'Education']);
    component.newsItem.tags = ['Events', 'Education'];
    expect(component.getAllTags()).toEqual(['Events', 'Education']);
  });

  it('should set newsImage if we have imagePath to default image', () => {
    component.newsItem.imagePath = defaultImagePath;
    component.checkNewsImage();
    expect((component as any).newsImage).toBe(defaultImagePath);
  });

  it('should set newsImage if imagePath not exist to default image', () => {
    component.newsItem.imagePath = ' ';
    (component as any).images.largeImage = 'url';
    component.checkNewsImage();
    expect((component as any).newsImage).toBe('url');
  });

  it('checkNewsImage should return news image src', () => {
    component.newsItem.imagePath = defaultImagePath;
    expect(component.checkNewsImage()).toBe((component as any).newsImage);
  });

  it('should return FB social share link and call open method', () => {
    const spy = spyOn(window, 'open');
    component.onSocialShareLinkClick('fb');
    expect(spy).toHaveBeenCalledWith(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
  });

  it('should return linkedin social share link and call open method', () => {
    const spy = spyOn(window, 'open');
    component.onSocialShareLinkClick('linkedin');
    expect(spy).toHaveBeenCalledWith(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank');
  });

  it('should return twitter social share link and call open method', () => {
    const spy = spyOn(window, 'open');
    const tags = component.tags;
    component.onSocialShareLinkClick('twitter');
    expect(spy).toHaveBeenCalledWith(
      `https://twitter.com/share?url=${window.location.href}&text=${mockEcoNewsModel.title}&hashtags=${tags.join(',')}`,
      '_blank'
    );
  });

  it('should get IsLiked', () => {
    (component as any).getIsLiked();
    expect(component.isLiked).toBe(true);
  });
});
