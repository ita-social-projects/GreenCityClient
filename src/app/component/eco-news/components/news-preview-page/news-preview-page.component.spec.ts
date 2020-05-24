import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsPreviewPageComponent } from './news-preview-page.component';

describe('NewsPreviewPageComponent', () => {
  let component: NewsPreviewPageComponent;
  let fixture: ComponentFixture<NewsPreviewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsPreviewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsPreviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
