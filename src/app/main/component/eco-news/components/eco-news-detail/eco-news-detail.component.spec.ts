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
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { DateLocalisationPipe } from '@pipe/date-localisation-pipe/date-localisation.pipe';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('EcoNewsDetailComponent', () => {
  let component: EcoNewsDetailComponent;
  let fixture: ComponentFixture<EcoNewsDetailComponent>;
  let localStorageService: LocalStorageService;
  let ecoNewsService: EcoNewsService;
  let httpMock: HttpTestingController;
  let route: ActivatedRoute;
  const mockEcoNewsModel: EcoNewsModel = {
    id: 1,
    imagePath: 'test',
    title: 'test title',
    text: 'some description',
    author: {
      id: 777,
      name: 'John Snow'
    },
    tags: [
      { id: 1, name: 'Events' },
      { id: 2, name: 'Education' }
    ],
    creationDate: '2020-06-16T18:08:00.604Z',
    likes: 0,
    countComments: 2
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EcoNewsDetailComponent, EcoNewsWidgetComponent, NewsListGalleryViewComponent, TranslatePipeMock, DateLocalisationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [LocalStorageService, EcoNewsService]
    }).compileComponents();

    localStorageService = TestBed.inject(LocalStorageService);
    ecoNewsService = TestBed.inject(EcoNewsService);
    httpMock = TestBed.inject(HttpTestingController);
    route = TestBed.inject(ActivatedRoute);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoNewsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should init three method', () => {
    spyOn(component as any, 'setNewsId');
    spyOn(component as any, 'canUserEditNews');
    spyOn(component as any, 'setNewsIdSubscription');
    component.ngOnInit();

    expect((component as any).setNewsId).toHaveBeenCalledTimes(1);
    expect((component as any).canUserEditNews).toHaveBeenCalledTimes(1);
    expect((component as any).setNewsIdSubscription).toHaveBeenCalledTimes(1);
  });

  it('setNewsItem should compare edited item with EcoNewsModel interface', () => {
    const nestedNewsItem = {
      authorId: 777,
      authorName: 'John Snow'
    };
    component.setNewsItem(mockEcoNewsModel);
    expect(component.newsItem).toEqual({ ...mockEcoNewsModel, ...nestedNewsItem });
  });

  it('checkNewsImage should return existing image src', () => {
    component.newsItem = mockEcoNewsModel;
    component.newsItem.imagePath = 'test';
    const imagePath = component.checkNewsImage();
    expect(imagePath).toEqual('test');
  });

  it('checkNewsImage should return default image src', () => {
    component.newsItem = mockEcoNewsModel;
    component.newsItem.imagePath = ' ';
    const imagePath = component.checkNewsImage();
    expect(imagePath).toEqual('assets/img/icon/econews/news-default-large.png');
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
    component.newsItem = mockEcoNewsModel;
    const spy = spyOn(window, 'open');
    component.onSocialShareLinkClick('twitter');
    expect(spy).toHaveBeenCalledWith(
      `https://twitter.com/share?url=${window.location.href}&text=${mockEcoNewsModel.title}&hashtags=${mockEcoNewsModel.tags.join(',')}`,
      '_blank'
    );
  });

  it('canUserEditNews should return true if the user can edit news', () => {
    localStorageService.userIdBehaviourSubject.next(3);
    localStorageService.userIdBehaviourSubject.subscribe((id: number) => {
      component.userId = id;
      expect(component.userId).toEqual(3);
    });
  });

  // it('fetchNewsItem should return item by id', async () => {
  //   const id = '1';

  //   spyOn(component, 'setNewsItem');
  //   (component as any).newsItemSubscription = ecoNewsService.getEcoNewsById(id).subscribe((item: EcoNewsModel) => {
  //     component.setNewsItem(item);
  //     expect(component.setNewsItem).toHaveBeenCalledWith(item);
  //   });

  //   const request = httpMock.expectOne(`https://greencity.azurewebsites.net/econews/${id}?lang=en`);
  //   request.flush(mockEcoNewsModel);

  //   expect((component as any).newsItemSubscription).not.toEqual(undefined);
  // });
});
