import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { EcoNewsWidgetComponent } from './eco-news-widget.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NewsListGalleryViewComponent } from '../../news-list/news-list-gallery-view/news-list-gallery-view.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';

describe('EcoNewsWidgetComponent', () => {
  let component: EcoNewsWidgetComponent;
  let fixture: ComponentFixture<EcoNewsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EcoNewsWidgetComponent,
        NewsListGalleryViewComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoNewsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true on subscription', inject([EcoNewsService], (setvice: EcoNewsService) => {
    const mockData = {
      id: 1,
      imagePath: 'test',
      title: 'test',
      text: 'test',
      author: {
          id: 1,
          name: 'test',
      },
      tags: ['test'],
      creationDate: 'test'
    };

    const spy = spyOn(setvice, 'getRecommendedNews').and.returnValue(of(mockData));
    component.newsIdSubscription();

    expect(spy).toHaveBeenCalled();
  }));
});
