import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostNewsLoaderComponent } from './post-news-loader.component';

describe('PostNewsLoaderComponent', () => {
  let component: PostNewsLoaderComponent;
  let fixture: ComponentFixture<PostNewsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostNewsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostNewsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
