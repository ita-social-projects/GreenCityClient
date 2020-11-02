import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { DragAndDropComponent } from '../../../shared/components/drag-and-drop/drag-and-drop.component';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick, getTestBed } from '@angular/core/testing';
import { PostNewsLoaderComponent } from '../post-news-loader/post-news-loader.component';
import { CreateEditNewsComponent } from './create-edit-news.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ACTION_CONFIG, ACTION_TOKEN } from './action.constants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { EcoNewsComponent } from '../../eco-news.component';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';

describe('CreateEditNewsComponent', () => {
  let component: CreateEditNewsComponent;
  let fixture: ComponentFixture<CreateEditNewsComponent>;

  let http: HttpTestingController;
  let createEcoNewsService: CreateEcoNewsService;
  let newsService: EcoNewsService;
  let httpClientSpy: { get: jasmine.Spy };
  const validNews = {
    title: 'newstitle',
    content: 'contentcontentcontentcontentcontentcontentcontent',
    tags: ['News'],
    source: '',
    image: ''
  };
  const inValidNews = {
    title: 'newstitle',
    content: 'content',
    tags: ['News'],
    source: '',
    image: ''
  };
  const url = `https://greencity.azurewebsites.net/econews`;
  let router: Router;
  const mockUserService = jasmine.createSpyObj('createEcoNewsService', ['sendFormData']);
  mockUserService.isBackToEditing = true;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateEditNewsComponent,
        PostNewsLoaderComponent,
        DragAndDropComponent,
        EcoNewsComponent
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        HttpClientModule,
        MatDialogModule,
        HttpClientTestingModule,
        MatSnackBarModule,
      ],
      providers: [
        CreateEcoNewsService,
        EcoNewsService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ACTION_TOKEN, useValue: ACTION_CONFIG },
        MatSnackBarComponent,
        FormBuilder,
        { provide: Router, useValue: [] },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    createEcoNewsService = TestBed.get(CreateEcoNewsService);
    newsService = TestBed.get(EcoNewsService);
    http = TestBed.get(HttpTestingController);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    spyOn(component, 'toggleIsActive');
    router = TestBed.get(Router);
    spyOn(router, 'navigate');
  });

  it('should go news ', async(() => {
    fixture.detectChanges();
    mockUserService.sendFormData.and.returnValue(of({}));
    component.createNews();
    fixture.ngZone.run(() => {
    expect(router.navigate).toHaveBeenCalledWith(['news']);
    });
  }));

  afterEach(() => {
    http.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have filter array as arr`, () => {
    const arr = [
      { name: 'News', isActive: false },
      { name: 'Events', isActive: false },
      { name: 'Education', isActive: false },
      { name: 'Initiatives', isActive: false },
      { name: 'Ads', isActive: false }
    ];
    expect(component.filters).toEqual(arr);
  });

  it('should render title in a h2 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.title h2').textContent)
      .toContain('Create news');
  });

  it('createEcoNewsService should be created', () => {
    expect(createEcoNewsService).toBeTruthy();
  });

  it('newsService should be created', () => {
    expect(newsService).toBeTruthy();
  });

  it('should have made one request to GET data from expected URL', () => {
    const id = '4705';
    const expectedData = {
      author: { id: 1601, name: 'Hryshko' },
      creationDate: '2020-10-26T16:43:29.336931Z',
      id: 4705,
      imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
      source: '',
      tags: ['Events', 'Education'],
      text: 'hellohellohellohellohellohellohellohellohellohello',
      title: 'hello'
    };

    newsService.getEcoNewsById(id).subscribe((data) => {
      expect(data).toEqual(expectedData);
    });

    const req = http.expectOne(url + `/${id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);
  });

  it('should addFilters', () => {
    const filter = {
      name: 'News',
      isActive: false
    };

    component.toggleIsActive(filter, true);
    expect(component.toggleIsActive).toHaveBeenCalled();
  });

  it('should call toggleIsActive with filter object', () => {
    const filter = {
      name: 'News',
      isActive: false
    };

    component.toggleIsActive(filter, true);
    expect(component.toggleIsActive).toHaveBeenCalledWith(filter, true);
  });

  it('should call getNewsIdFromQueryParams method in ngOnInit', () => {
    spyOn(component, 'getNewsIdFromQueryParams');
    component.ngOnInit();
    expect(component.getNewsIdFromQueryParams).toHaveBeenCalled();
  });

  it('should call setActiveFilters method after get request', () => {
    const id = '1';
    newsService.getEcoNewsById(id).subscribe((data) => {
      expect(component.setActiveFilters).toHaveBeenCalledWith(data);
    });

    const req = http.expectOne(url + `/${id}`);
    expect(req.request.method).toEqual('GET');
  });

  it('should change isArrayEmpty to false property after adding tag', () => {
    const filter = {
      name: 'News',
      isActive: false
    };

    component.addFilters(filter);
    expect(component.isArrayEmpty).toBe(false);
  });

  it('should change isArrayEmpty property to true after deleting tag', () => {
    const filter = {
      name: 'News',
      isActive: false
    };

    component.removeFilters(filter);
    expect(component.isArrayEmpty).toBe(true);
  });

  it('should ', fakeAsync(() => {
    const arr = [
      { name: 'News', isActive: false },
      { name: 'Events', isActive: false },
      { name: 'Education', isActive: false },
      { name: 'Initiatives', isActive: false },
      { name: 'Ads', isActive: false }
    ];

    component.ngOnInit();
    expect(component.isFilterValidation).toBe(false);
    component.addFilters(arr[0]);
    component.addFilters(arr[1]);
    component.addFilters(arr[2]);
    component.addFilters(arr[3]);
    tick(2000);
    expect(component.isFilterValidation).toBe(true);
    flush();
    expect(component.tags().length).toBe(3);
  }));

  it('Should open CancelPopup', () => {
    spyOn(component, 'openCancelPopup');

    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('.cancel');
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(component.openCancelPopup).toHaveBeenCalled();
  });

  function updateForm(news) {
    component.form.controls.title.setValue(news.title);
    component.form.controls.content.setValue(news.content);
    (component.form.controls.tags as FormArray).push(new FormControl(news.tags[0]));
    component.form.controls.image.setValue(news.image);
    component.form.controls.source.setValue(news.source);
  }

  it('isValid should be false when form is invalid', fakeAsync(() => {
    updateForm(inValidNews);
    expect(component.form.valid).toBeFalsy();
  }));

  it('isValid should be true when form is valid', fakeAsync(() => {
    updateForm(validNews);
    expect(component.form.valid).toBeTruthy();
  }));

  it('should update form', fakeAsync(() => {

    updateForm(validNews);
    component.onSubmit();

    const httpRequest = http.expectOne(url);
    expect(httpRequest.request.method).toBe('POST');

    expect(component.form.value).toEqual(validNews);
  }));

  it('should send POST request', fakeAsync(() => {

    updateForm(validNews);
    component.onSubmit();

    const httpRequest = http.expectOne(url);
    expect(httpRequest.request.method).toBe('POST');

  }));

  it('should get news id from CreateEcoNewsService', () => {
    const id = '1';
    const valueServiceSpy = jasmine.createSpyObj('CreateEcoNewsService', {getNewsId: '1'});
    component.ngOnInit();
    component.newsId = valueServiceSpy.getNewsId();
    fixture.detectChanges();
    expect(component.newsId).toBe(id);
  });

  it('should set isArrayEmpty to false', () => {
    const expectedData = {
      author: { id: 1601, name: 'Hryshko' },
      creationDate: '2020-10-26T16:43:29.336931Z',
      id: 4705,
      imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
      source: '',
      tags: ['Events', 'Education'],
      text: 'hellohellohellohellohellohellohellohellohellohello',
      title: 'hello'
    };
    component.setActiveFilters(expectedData);
    expect(component.isArrayEmpty).toBeFalsy();
  });

  it('should add filters', () => {
    const activeFilter = { name: 'News', isActive: false };
    const notActiveFilter = { name: 'News', isActive: true };
    component.addFilters(activeFilter);
    expect(component.isArrayEmpty).toBeFalsy();
    expect(component.tags().length).toBe(1);

    component.removeFilters(notActiveFilter);
    expect(component.tags().length).toBe(0);
  });

  fit('should ', () => {
    const expectedData = {
      author: { id: 1601, name: 'Hryshko' },
      creationDate: '2020-10-26T16:43:29.336931Z',
      id: 4705,
      imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
      source: '',
      tags: ['Events', 'Education'],
      text: 'hellohellohellohellohellohellohellohellohellohello',
      title: 'hello'
    };
    const id = '1';
    const valueServiceSpy = jasmine.createSpyObj('CreateEcoNewsService', {getFormData: expectedData});
    component.ngOnInit();
    component.formData = valueServiceSpy.getFormData();
    fixture.detectChanges();
    expect(spyOn(component, 'setActiveFilters')).toHaveBeenCalledWith(expectedData);
  });
});
