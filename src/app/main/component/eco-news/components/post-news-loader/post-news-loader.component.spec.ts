import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { PostNewsLoaderComponent } from './post-news-loader.component';

describe('PostNewsLoaderComponent', () => {
  let component: PostNewsLoaderComponent;
  let fixture: ComponentFixture<PostNewsLoaderComponent>;

  const titleMock = jasmine.createSpyObj('Title', ['setTitle']);
  titleMock.setTitle = () => true;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PostNewsLoaderComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: Title, useValue: titleMock }]
    }).compileComponents();
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
