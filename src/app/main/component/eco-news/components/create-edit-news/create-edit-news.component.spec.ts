import { NewsResponseDTO } from './../../models/create-news-interface';
import { CreateEditNewsComponent } from './create-edit-news.component';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { PostNewsLoaderComponent } from '..';
import { TranslateModule } from '@ngx-translate/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DragAndDropComponent } from '@shared/components/drag-and-drop/drag-and-drop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ACTION_CONFIG, ACTION_TOKEN } from './action.constants';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { of } from 'rxjs';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { FormBuilder } from '@angular/forms';
import { CreateEditNewsFormBuilder } from './create-edit-news-form-builder';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { routes } from 'src/app/main/app-routing.module';
import { Location } from '@angular/common';
import { HomepageComponent, TipsListComponent } from 'src/app/component/home/components';
import { SearchAllResultsComponent } from 'src/app/component/layout/components';
import { ConfirmRestorePasswordComponent } from '@global-auth/confirm-restore-password/confirm-restore-password.component';
import { By } from '@angular/platform-browser';

describe('CreateEditNewsComponent', () => {
  let component: CreateEditNewsComponent;
  let fixture: ComponentFixture<CreateEditNewsComponent>;
  let ecoNewsServiceMock: EcoNewsService;
  let createEcoNewsServiceMock: CreateEcoNewsService;
  let createEditNewsFormBuilderMock: CreateEditNewsFormBuilder;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  let router: Router;
  let location: Location;
  const url = `https://greencity.azurewebsites.net/econews`;
  const item: EcoNewsModel = {
    author: { id: 1601, name: 'Hryshko' },
    creationDate: '2020-10-26T16:43:29.336931Z',
    id: 4705,
    imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
    tags: [
      { id: 1, name: 'Events' },
      { id: 2, name: 'Education' },
    ],
    text: 'hellohellohellohellohellohellohellohellohellohello',
    title: 'hello',
  };
  let http: HttpTestingController;
  const newsResponseMock: NewsResponseDTO = {
    id: 4705,
    text: 'hellohellohellohellohellohellohellohellohellohello',
    title: 'hello',
    ecoNewsAuthorDto: { id: 1601, firstName: 'Anton', lastName: 'Hryshko' },
    creationDate: '2020-10-26T16:43:29.336931Z',
    imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
    tags: ['Events', 'Education'],
  };

  const validNews = {
    title: 'newstitle',
    content: 'contentcontentcontentcontentcontentcontentcontent',
    tags: ['News'],
    source: '',
    image: '',
  };
  const inValidNews = {
    title: '',
    content: '',
    tags: [],
    source: '',
    image: '',
  };

  const emptyForm = () => {
    return new FormGroup({
      title: new FormControl(''),
      content: new FormControl(''),
      tags: new FormArray([]),
      image: new FormControl(''),
      source: new FormControl(''),
    });
  };

  const tagsArray = [
    { id: 1, name: 'Events' },
    { id: 2, name: 'Education' },
  ];

  createEcoNewsServiceMock = jasmine.createSpyObj('CreateEcoNewsService', [
    'sendFormData',
    'editNews',
    'setForm',
    'getNewsId',
    'getFormData',
  ]);
  createEcoNewsServiceMock.sendFormData = (form) => of(newsResponseMock);
  createEcoNewsServiceMock.getFormData = () => emptyForm();
  createEcoNewsServiceMock.editNews = (form) => of(newsResponseMock);
  createEcoNewsServiceMock.setForm = (form) => of();
  createEcoNewsServiceMock.getNewsId = () => '15';

  ecoNewsServiceMock = jasmine.createSpyObj('EcoNewsService', ['getEcoNewsById', 'getAllPresentTags']);
  ecoNewsServiceMock.getEcoNewsById = (id) => {
    return of(item);
  };
  ecoNewsServiceMock.getAllPresentTags = () => of(tagsArray);

  createEditNewsFormBuilderMock = jasmine.createSpyObj('CreateEditNewsFormBuilder', ['getSetupForm', 'getEditForm']);
  createEditNewsFormBuilderMock.getSetupForm = () => {
    return new FormGroup({
      title: new FormControl(''),
      content: new FormControl(''),
      tags: new FormArray([]),
      image: new FormControl(''),
      source: new FormControl(''),
    });
  };

  createEditNewsFormBuilderMock.getEditForm = (data) => {
    return new FormGroup({
      title: new FormControl(data.title),
      content: new FormControl(data.content),
      tags: new FormArray(data.tags),
      image: new FormControl(data.imagePath),
      source: new FormControl(data.source),
    });
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateEditNewsComponent,
        PostNewsLoaderComponent,
        DragAndDropComponent,
        HomepageComponent,
        TipsListComponent,
        SearchAllResultsComponent,
        ConfirmRestorePasswordComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes(routes),
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ACTION_TOKEN, useValue: ACTION_CONFIG },
        { provide: EcoNewsService, useValue: ecoNewsServiceMock },
        { provide: CreateEcoNewsService, useValue: createEcoNewsServiceMock },
        { provide: CreateEditNewsFormBuilder, useValue: createEditNewsFormBuilderMock },
        MatSnackBarComponent,
        FormBuilder,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    router.initialNavigation();
    http = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('navigate to "news" redirects you to /news', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.createNews();
    tick(5000);
    fixture.detectChanges();
    fixture.ngZone.run(() => {
      fixture.whenStable().then(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/news']);
      });
    });
  }));

  it('navigate to "news" redirects you to /news', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.editNews();
    tick(5000);
    fixture.detectChanges();
    fixture.ngZone.run(() => {
      fixture.whenStable().then(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/news']);
      });
    });
  }));

  it('fakeAsync works', fakeAsync(() => {
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 10);
    });
    let done = false;
    promise.then(() => (done = true));
    tick(50);
    expect(done).toBeTruthy();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get econews by id', () => {
    ecoNewsServiceMock.getEcoNewsById('4705').subscribe((data: EcoNewsModel) => {
      expect(data).toBeTruthy();
      expect(data).toEqual(item);
    });
  });

  it('should set empty form after init', () => {
    const testForm = {
      title: '',
      content: '',
      tags: [],
      image: '',
      source: '',
    };
    component.ngOnInit();
    expect(component.form.value).toEqual(testForm);
  });

  it('should POST econews', () => {
    createEcoNewsServiceMock.sendFormData(item).subscribe((data) => {
      expect(data).toEqual(newsResponseMock);
      expect(component.isPosting).toBeFalsy();
    });
  });

  it(`should have filter array as arr`, () => {
    const arr = [
      { name: 'Events', isActive: false },
      { name: 'Education', isActive: false },
    ];
    expect(component.filters).toEqual(arr);
  });

  it('should addFilters', () => {
    spyOn(component, 'toggleIsActive');
    const filter = {
      name: 'News',
      isActive: false,
    };

    component.toggleIsActive(filter, true);
    expect(component.toggleIsActive).toHaveBeenCalled();
  });

  it('should call toggleIsActive with filter object', () => {
    spyOn(component, 'toggleIsActive');
    const filter = {
      name: 'News',
      isActive: false,
    };

    component.toggleIsActive(filter, true);
    expect(component.toggleIsActive).toHaveBeenCalledWith(filter, true);
  });

  it('should call getNewsIdFromQueryParams method in ngOnInit', () => {
    spyOn(component, 'getNewsIdFromQueryParams');
    component.ngOnInit();
    expect(component.getNewsIdFromQueryParams).toHaveBeenCalled();
  });

  it('should change isArrayEmpty to false property after adding tag', () => {
    component.isArrayEmpty = true;
    const filter = {
      name: 'News',
      isActive: false,
    };

    component.addFilters(filter);
    expect(component.isArrayEmpty).toBe(false);
  });

  it('should change isArrayEmpty property to true after deleting tag', () => {
    const filter = {
      name: 'News',
      isActive: false,
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
      { name: 'Ads', isActive: false },
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

  function updateForm(news) {
    component.form.controls.title.setValue(news.title);
    component.form.controls.content.setValue(news.content);
    (component.form.controls.tags as FormArray).push(new FormControl(news.tags[0]));
    component.form.controls.image.setValue(news.image);
    component.form.controls.source.setValue(news.source);
  }

  it('isValid should be true when form is valid', fakeAsync(() => {
    updateForm(validNews);
    expect(component.form.valid).toBeTruthy();
  }));

  it('should set isArrayEmpty to false', () => {
    const expectedData = {
      author: { id: 1601, name: 'Hryshko' },
      creationDate: '2020-10-26T16:43:29.336931Z',
      id: 4705,
      imagePath: 'https://storage.cloud.google.com/staging.greencity-c5a3a.appspot.com/35fce8fe-7949-48b8-bf8c-0d9a768ecb42',
      source: '',
      tags: [
        { id: 1, name: 'Events' },
        { id: 2, name: 'Education' },
      ],
      text: 'hellohellohellohellohellohellohellohellohellohello',
      title: 'hello',
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
});
