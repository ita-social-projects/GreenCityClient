import { EcoNewsService } from '../../../services/eco-news.service';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoNewsWidgetComponent } from './eco-news-widget.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NewsListGalleryViewComponent } from 'src/app/shared/news-list-gallery-view/news-list-gallery-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EcoNewsWidgetComponent', () => {
  let component: EcoNewsWidgetComponent;
  let fixture: ComponentFixture<EcoNewsWidgetComponent>;

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';
  const mockData = {
    id: 1,
    imagePath: defaultImagePath,
    title: 'test',
    text: 'test',
    author: {
      id: 1,
      name: 'test'
    },
    tags: ['test'],
    creationDate: '11111'
  };
  const ecoNewsServiceMock = jasmine.createSpyObj('EcoNewsService', ['getRecommendedNews']);
  ecoNewsServiceMock.getRecommendedNews = () => of([mockData]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EcoNewsWidgetComponent, NewsListGalleryViewComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: EcoNewsService, useValue: ecoNewsServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoNewsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true on subscription', () => {
    component.newsIdSubscription();

    expect(component.recommendedNews[0]).toBe(mockData);
  });
});
