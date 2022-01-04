import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { TranslateModule } from '@ngx-translate/core';

import { NewsListListViewComponent } from './news-list-list-view.component';

class MockRenderer {
  addClass(document: string, cssClass: string): boolean {
    return true;
  }
}

describe('NewsListListViewComponent', () => {
  let component: NewsListListViewComponent;
  let fixture: ComponentFixture<NewsListListViewComponent>;
  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';
  const ecoNewsMock: EcoNewsModel = {
    countComments: 2,
    id: 1,
    imagePath: defaultImagePath,
    title: 'string',
    text: 'string',
    author: {
      id: 1,
      name: 'string'
    },
    tags: [{ name: 'test', id: 1 }],
    creationDate: '11',
    likes: 0
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [NewsListListViewComponent],
      providers: [{ provide: Renderer2, useClass: MockRenderer }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListListViewComponent);
    component = fixture.componentInstance;
    component.ecoNewsModel = ecoNewsMock;
    component.profileIcons.newsDefaultPictureList = defaultImagePath;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get default image', () => {
    ecoNewsMock.imagePath = ' ';
    component.ecoNewsModel = ecoNewsMock;
    component.checkNewsImage();
    expect(component.newsImage).toBe(defaultImagePath);
  });
});
