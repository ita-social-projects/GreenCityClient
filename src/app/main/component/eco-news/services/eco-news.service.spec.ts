import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from '@environment/environment.js';

import { EcoNewsService } from './eco-news.service';

describe('EcoNewsService', () => {
  let service: EcoNewsService;
  let httpTestingController: HttpTestingController;
  const newsMock = {
    countComments: 5,
    id: 13578,
    imagePath: null,
    title: '',
    text: '',
    author: { id: 312, name: 'taqcTestName' },
    tags: ['News', 'Events'],
    creationDate: '2021-11-25T22:32:30.555088+02:00',
    likes: 0,
    source: ''
  };
  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['languageBehaviourSubject']);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EcoNewsService, { provide: LocalStorageService, useValue: localStorageServiceMock }]
    })
  );

  beforeEach(() => {
    service = TestBed.inject(EcoNewsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all present tags', () => {
    const tagMock = [
      {
        id: 0,
        name: 'News',
        nameUa: 'Новини'
      }
    ];
    service.getAllPresentTags().subscribe((data) => {
      expect(data).toBe(tagMock);
    });

    const req = httpTestingController.expectOne(`${environment.backendLink}tags/v2/search?type=ECO_NEWS`);
    expect(req.request.method).toEqual('GET');
    req.flush(tagMock);
  });

  it('should return eco news list by current page', () => {
    service.getEcoNewsListByPage(0, 5).subscribe((data) => {
      expect(data).toBe(newsMock);
    });

    const req = httpTestingController.expectOne(`${environment.backendLink}econews?page=0&size=5`);
    expect(req.request.method).toEqual('GET');
    req.flush(newsMock);
  });

  it('should return eco news list by current tags', () => {
    const tagMock = ['News'];
    service.getNewsListByTags(0, 5, tagMock).subscribe((data) => {
      expect(data).toBe(newsMock);
    });

    const req = httpTestingController.expectOne(`${environment.backendLink}econews/tags?page=0&size=5&tags=${tagMock}`);
    expect(req.request.method).toEqual('GET');
    req.flush(newsMock);
  });

  it('should return news list', () => {
    const arr = [newsMock];
    service.getNewsList().subscribe((data) => {
      expect(data).toBe(arr);
    });

    const req = httpTestingController.expectOne(`${environment.backendLink}econews`);
    expect(req.request.method).toEqual('GET');
    req.flush(arr);
  });

  it('should return news list by id', () => {
    service.getEcoNewsById(13578).subscribe((data) => {
      expect(data).toBeDefined();
    });

    const req = httpTestingController.expectOne(`${environment.backendLink}econews/13578?lang=en`);
    expect(req.request.method).toEqual('GET');
  });

  it('should return recomended news list', () => {
    service.getRecommendedNews(13578).subscribe((data) => {
      expect(data).toBeDefined();
    });

    const req = httpTestingController.expectOne(`${environment.backendLink}econews/recommended?openedEcoNewsId=13578`);
    expect(req.request.method).toEqual('GET');
  });

  it('should post toggle Like', () => {
    service.postToggleLike(13578).subscribe((data) => {
      newsMock.likes = 1;
      expect(data).toBe(newsMock);
    });

    const req = httpTestingController.expectOne(`${environment.backendLink}econews/like?id=13578`);
    expect(req.request.method).toEqual('POST');
    req.flush(newsMock);
  });

  it('should post toggle Like', () => {
    service.getIsLikedByUser(13578).subscribe((data) => {
      newsMock.likes = 1;
      expect(data).toBe(newsMock);
    });

    const req = httpTestingController.expectOne(`${environment.backendLink}econews/isLikedByUser?econewsId=13578`);
    expect(req.request.method).toEqual('GET');
    req.flush(newsMock);
  });
});
