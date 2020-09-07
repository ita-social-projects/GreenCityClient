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
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform} from '@angular/core';

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
    tags: ['ads', 'events'],
    creationDate: '2020-06-16T18:08:00.604Z',
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EcoNewsDetailComponent,
        EcoNewsWidgetComponent,
        NewsListGalleryViewComponent,
        TranslatePipeMock
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        LocalStorageService,
        EcoNewsService
      ]
    })
      .compileComponents();

    localStorageService = TestBed.get(LocalStorageService);
    ecoNewsService = TestBed.get(EcoNewsService);
    httpMock = TestBed.get(HttpTestingController);
    route = TestBed.get(ActivatedRoute);
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

  it('ngOnDestroy should destroy two method ', () => {
    spyOn((component as any).newsIdSubscription, 'unsubscribe');
    spyOn((component as any).newsItemSubscription, 'unsubscribe');
    component.ngOnDestroy();

    expect((component as any).newsIdSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    expect((component as any).newsItemSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('setNewsItem should compare edited item with EcoNewsModel interface', () => {

    const nestedNewsItem = { ...mockEcoNewsModel.author };
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

  it('canUserEditNews should return true if the user can edit news', () => {
    localStorageService.userIdBehaviourSubject.next(3);
    localStorageService.userIdBehaviourSubject.subscribe(
      (id: number) => {
        component.userId = id;
        expect(component.userId).toEqual(3);
      });
  });

  it('fetchNewsItem should return item by id', async () => {
    const id = 1;

    spyOn(component, 'setNewsItem');
    (component as any).newsItemSubscription = ecoNewsService.getEcoNewsById(id).subscribe(
      (item: EcoNewsModel) => {
        component.setNewsItem(item);
        expect(component.setNewsItem).toHaveBeenCalledWith(item);
      });

    const request = httpMock.expectOne(`https://greencity.azurewebsites.net/econews/${id}`);
    request.flush(mockEcoNewsModel);

    expect((component as any).newsItemSubscription).not.toEqual(undefined);

  });
});
