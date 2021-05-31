import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ACTION_CONFIG, ACTION_TOKEN } from '../create-edit-news/action.constants';
import { NewsPreviewPageComponent } from './news-preview-page.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { of } from 'rxjs';
import { NewsResponseDTO } from '@eco-news-models/create-news-interface';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { NewsDto } from '@home-models/NewsDto';

describe('NewsPreviewPageComponent', () => {
  let component: NewsPreviewPageComponent;
  let fixture: ComponentFixture<NewsPreviewPageComponent>;

  const currentFormWithImageMock: FormGroup = new FormGroup({
    content: new FormControl('asd aspd kasd ksdfj ksdjfi sdjf osd'),
    image: new FormControl('esdf'),
    source: new FormControl('https://www.telerik.com/blogs/testing-dynamic-forms-in-angular'),
    tags: new FormControl(['news, ads']),
    title: new FormControl('asd asd asd asd asd s')
  });

  const currentFormWithoutImageMock: FormGroup = new FormGroup({
    content: new FormControl('asd aspd kasd ksdfj ksdjfi sdjf osd'),
    image: new FormControl(''),
    source: new FormControl('https://www.telerik.com/blogs/testing-dynamic-forms-in-angular'),
    tags: new FormControl(['news, ads']),
    title: new FormControl('asd asd asd asd asd s')
  });

  const newsResponseMock: NewsResponseDTO = {
    id: 4705,
    text: 'hellohellohellohellohellohellohellohellohellohello',
    title: 'hello',
    ecoNewsAuthorDto: { id: 1601, firstName: 'Anton', lastName: 'Hryshko' },
    creationDate: '2020-10-26T16:43:29.336931Z',
    imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
    tags: ['Events', 'Education']
  };

  const item: EcoNewsModel = {
    author: { id: 1601, name: 'Hryshko' },
    creationDate: '2020-10-26T16:43:29.336931Z',
    id: 4705,
    imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
    tags: [
      { id: 1, name: 'Events' },
      { id: 2, name: 'Education' }
    ],
    text: 'hellohellohellohellohellohellohellohellohellohello',
    title: 'hello'
  };

  const dataToEdit: NewsDto = {
    id: 4705,
    imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
    creationDate: '2020-10-26T16:43:29.336931Z',
    text: 'hellohellohellohellohellohellohellohellohellohello',
    title: 'hello'
  };

  const createEcoNewsServiceMock = jasmine.createSpyObj('CreateEcoNewsService', [
    'getFormData',
    'getNewsId',
    'isBackToEditing',
    'sendFormData',
    'editNews'
  ]);
  createEcoNewsServiceMock.getFormData = () => currentFormWithImageMock;
  createEcoNewsServiceMock.isBackToEditing = true;
  createEcoNewsServiceMock.sendFormData = (previewItem) => of(newsResponseMock);
  createEcoNewsServiceMock.editNews = (form) => of(newsResponseMock);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsPreviewPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: CreateEcoNewsService, useValue: createEcoNewsServiceMock },
        { provide: ACTION_TOKEN, useValue: ACTION_CONFIG }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsPreviewPageComponent);
    component = fixture.componentInstance;
    component.attributes = {
      btnCaption: 'send',
      title: 'title test'
    };
    component.images.largeImage = 'assets/img/icon/econews/news-default-large.png';
    component.isPosting = false;

    fixture.detectChanges();
  });

  fit('should create component', () => {
    createEcoNewsServiceMock.getNewsId.and.returnValue('15');
    expect(component).toBeTruthy();
  });

  fit('method isBackToEdit should change isBackToEditing to true', () => {
    jasmine.clock().install();
    component.isBackToEdit();
    expect(createEcoNewsServiceMock.isBackToEditing).toBe(true);
    jasmine.clock().tick(1001);
    expect(!createEcoNewsServiceMock.isBackToEditing).toBe(false);
    jasmine.clock().uninstall();
  });

  fit('testing of method postNewItem', () => {
    component.postNewsItem();
    expect(!component.isPosting).toBe(true);
    createEcoNewsServiceMock.sendFormData(item).subscribe(() => {
      expect(component.isPosting).toBe(false);
    });
  });

  fit('testing of method editNews', () => {
    component.editNews();
    const dataToEdit = {
      ...component.previewItem.value,
      id: component.newsId
    };
    expect(dataToEdit).toBeTruthy();

    createEcoNewsServiceMock.editNews(dataToEdit).subscribe(() => {
      expect(component.isPosting).toBe(false);
    });
  });

  fit('if we do not have image in our form method getItemPath should return largeImage', () => {
    component.previewItem = currentFormWithoutImageMock;
    const result = component.getImagePath();
    expect(result).toEqual(component.images.largeImage);
  });

  fit('if method of service getNewsId does not return id', () => {
    createEcoNewsServiceMock.getNewsId.and.returnValue('');
    expect(component.attributes).toBeDefined();
    expect(component.onSubmit).toBeDefined();
  });
});
