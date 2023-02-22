import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { HabitService } from './habit.service';
import { environment } from '@environment/environment.js';

describe('HabitService', () => {
  const habitLink = `${environment.backendLink}habit`;
  const backendLink = environment.backendLink;
  let habitService: HabitService;
  let httpMock: HttpTestingController;
  let langMock = null;
  const habitsMock = {
    page: [
      {
        defaultDuration: 14,
        habitTranslation: {
          description: 'Description',
          habitItem: 'Item',
          languageCode: 'en',
          name: 'Use a reusable water bottle'
        },
        id: 2,
        image: './assets/img/habit-circle-bg-shape.png',
        complexity: 1,
        tags: [],
        shoppingListItems: null
      }
    ],
    totalElements: 31,
    currentPage: 1,
    totalPages: 31
  };
  const habitMock = {
    defaultDuration: 14,
    habitTranslation: {
      description: 'Description',
      habitItem: 'Item',
      languageCode: 'en',
      name: 'Use a towel instead of paper towels and napkins'
    },
    id: 1,
    image: './assets/img/habit-circle-bg-shape.png',
    complexity: 1,
    tags: [],
    shoppingListItems: [
      {
        id: 1,
        text: 'Swedish cellulose dish cloths',
        status: 'ACTIVE'
      },
      {
        id: 2,
        text: 'Reusable bamboo paper towels',
        status: 'ACTIVE'
      },
      {
        id: 3,
        text: 'Wowables reusable & biodegradable paper towel',
        status: 'ACTIVE'
      }
    ]
  };
  const habitList = [
    {
      id: 11,
      text: 'Reusable stainless steel water bottle',
      status: 'ACTIVE'
    },
    {
      id: 12,
      text: 'Reusable glass water bottle',
      status: 'ACTIVE'
    },
    {
      id: 13,
      text: 'Collapsible Silicone Water Bottle',
      status: 'ACTIVE'
    }
  ];
  const tagsMock = [
    { id: 1, name: 'clothes', nameUa: 'одяг' },
    { id: 2, name: 'eco', nameUa: 'еко' },
    { id: 3, name: 'natural', nameUa: 'натуральний' }
  ];
  const habitListMock = {
    currentPage: 1,
    page: [
      {
        defaultDuration: 12,
        habitTranslation: {
          description: 'habit, which will be useful for environment',
          habitItem: 'bags',
          languageCode: 'en',
          name: 'habit for buying eco bags'
        },
        id: 1,
        image: './assets/img/habit-circle-bg-shape.png',
        tags: ['test'],
        isAssigned: true
      }
    ],
    totalElements: 1,
    totalPages: 1
  };

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['languageBehaviourSubject']);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HabitService, { provide: LocalStorageService, useValue: localStorageServiceMock }]
    });
    habitService = TestBed.inject(HabitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: HabitService = TestBed.inject(HabitService);
    expect(service).toBeTruthy();
  });

  it('should get language', () => {
    localStorageServiceMock.languageBehaviourSubject.subscribe((lang) => {
      langMock = lang;
    });
    expect(langMock).toBe('en');
  });

  it('should return all habits', () => {
    habitService.getAllHabits(1, 1).subscribe((data) => {
      expect(data).toBe(habitsMock);
    });

    const req = httpMock.expectOne(`${habitLink}?lang=en&page=1&size=1`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(habitsMock);
  });

  it('should return habit by id', () => {
    habitService.getHabitById(1).subscribe((data) => {
      expect(data).toBe(habitMock);
    });

    const req = httpMock.expectOne(`${habitLink}/1?lang=en`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(habitMock);
  });

  it('should return habit shopping list', () => {
    habitService.getHabitShoppingList(2).subscribe((data) => {
      expect(data).toBe(habitList);
    });

    const req = httpMock.expectOne(`${habitLink}/2/shopping-list?lang=en`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(habitList);
  });

  it('should return habit tags', () => {
    habitService.getAllTags().subscribe((data) => {
      expect(data).not.toBeNull();
      expect(data).toEqual(tagsMock);
    });
    const req = httpMock.expectOne(`${backendLink}tags/v2/search?type=HABIT`);
    expect(req.request.method).toBe('GET');
    req.flush(tagsMock);
  });

  it('should return habits by tag and lang', () => {
    habitService.getHabitsByTagAndLang(1, 1, ['test']).subscribe((data) => {
      expect(data).not.toBeNull();
      expect(data).toEqual(habitListMock);
    });

    const req = httpMock.expectOne(`${habitLink}/tags/search?lang=en
                                              &page=1&size=1&sort=asc&tags=test`);
    expect(req.request.method).toBe('GET');
    req.flush(habitListMock);
  });
});
