import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NewsListGalleryViewComponent } from './news-list-gallery-view.component';

describe('NewsListGalleryViewComponent', () => {
  let component: NewsListGalleryViewComponent;
  let fixture: ComponentFixture<NewsListGalleryViewComponent>;
  const ecoNewsMock: EcoNewsModel = {
    id: 1,
    imagePath: 'string',
    title: 'string',
    text: 'string',
    author: {
      id: 1,
      name: 'string'
    },
    tags: [{ id: 1, name: 'test' }],

    creationDate: '11',
    likes: 0,
    countComments: 2
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [NewsListGalleryViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListGalleryViewComponent);
    component = fixture.componentInstance;
    component.ecoNewsModel = ecoNewsMock;
    component.profileIcons.newsDefaultPictureList = 'defaultImagePath';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get default image', () => {
    ecoNewsMock.imagePath = ' ';
    component.ecoNewsModel = ecoNewsMock;
    component.checkNewsImage();
    expect(component.newsImage).toBe('defaultImagePath');
  });
});
