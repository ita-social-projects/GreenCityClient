import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsListGalleryViewComponent } from './news-list-gallery-view.component';

describe('NewsListGalleryViewComponent', () => {
  let component: NewsListGalleryViewComponent;
  let fixture: ComponentFixture<NewsListGalleryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsListGalleryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsListGalleryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
