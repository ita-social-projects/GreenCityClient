import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { DragAndDropComponent } from '../../../shared/components/drag-and-drop/drag-and-drop.component';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { PostNewsLoaderComponent } from '../post-news-loader/post-news-loader.component';
import { CreateEditNewsComponent } from './create-edit-news.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ACTION_CONFIG, ACTION_TOKEN } from './action.constants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EcoNewsService } from '@eco-news-service/eco-news.service';

describe('CreateEditNewsComponent', () => {
  let component: CreateEditNewsComponent;
  let fixture: ComponentFixture<CreateEditNewsComponent>;

  let http: HttpTestingController;
  let createEcoNewsService: CreateEcoNewsService;
  let newsService: EcoNewsService;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateEditNewsComponent,
        PostNewsLoaderComponent,
        DragAndDropComponent,
      ],
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule,
        HttpClientTestingModule,
        MatSnackBarModule
      ],
      providers: [
        CreateEcoNewsService,
        EcoNewsService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ACTION_TOKEN, useValue: ACTION_CONFIG },
        MatSnackBarComponent
      ]
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

  });

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
    const url = `https://greencity.azurewebsites.net/econews/${id}`;

    newsService.getEcoNewsById(id).subscribe((data) => {
      expect(data).toEqual(expectedData);
    });

    const req = http.expectOne(url);
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
    const url = `https://greencity.azurewebsites.net/econews/${id}`;
    newsService.getEcoNewsById(id).subscribe((data) => {
      expect(component.setActiveFilters).toHaveBeenCalledWith(data);
    });

    const req = http.expectOne(url);
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
  }));

});
