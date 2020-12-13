import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';

import { NewsListListViewComponent } from './news-list-list-view.component';

describe('NewsListListViewComponent', () => {
  let component: NewsListListViewComponent;
  let fixture: ComponentFixture<NewsListListViewComponent>;
  const ecoNewsMock: EcoNewsModel = {
    id: 1,
    imagePath: 'string',
    title: 'string',
    text: 'string',
    author: {
        id: 1,
        name: 'string'
    },
    tags: ['test'],
    creationDate: '11',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsListListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListListViewComponent);
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
