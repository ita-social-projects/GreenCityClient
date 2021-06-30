import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { HabitService } from './habit.service';

describe('HabitService', () => {
  const habitLink = 'https://greencity.azurewebsites.net/habit';
  let habitService: HabitService;
  let httpMock: HttpTestingController;

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['languageBehaviourSubject']);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HabitService, { provide: LocalStorageService, useValue: localStorageServiceMock }]
    });
    habitService = TestBed.get(HabitService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: HabitService = TestBed.get(HabitService);
    expect(service).toBeTruthy();
  });

  it('should get language', () => {
    let mockLang = null;
    localStorageServiceMock.languageBehaviourSubject.subscribe((lang) => {
      mockLang = lang;
    });
    expect(mockLang).toBe('en');
  });

  it('should return all habits', () => {
    const habits = {
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

    habitService.getAllHabits(1, 1).subscribe((data) => {
      expect(data).toBe(habits);
    });

    const req = httpMock.expectOne(`${habitLink}?lang=en&page=1&size=1`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(habits);
  });

  it('should return habit by id', () => {
    const habit = {
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
        },
        {
          id: 4,
          text: 'Microfiber cloths',
          status: 'ACTIVE'
        },
        {
          id: 5,
          text: 'Bamboo kitchen dish cloths',
          status: 'ACTIVE'
        },
        {
          id: 6,
          text: 'Cotton napkins',
          status: 'ACTIVE'
        },
        {
          id: 7,
          text: 'Reusable beeswax wrap',
          status: 'ACTIVE'
        },
        {
          id: 8,
          text: 'Linen cocktail napkins',
          status: 'ACTIVE'
        },
        {
          id: 9,
          text: 'Everyday cotton napkins',
          status: 'ACTIVE'
        },
        {
          id: 10,
          text: 'Organic Cotton Dish Towels',
          status: 'ACTIVE'
        }
      ]
    };

    habitService.getHabitById(1).subscribe((data) => {
      expect(data.habitTranslation.name).toBe('Use a towel instead of paper towels and napkins');
    });

    const req = httpMock.expectOne(`${habitLink}/1?lang=en`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(habit);
  });

  it('should return habit shopping list', () => {
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
      },
      {
        id: 14,
        text: 'Water Filter Bottle',
        status: 'ACTIVE'
      },
      {
        id: 15,
        text: 'Flat reusable bottle',
        status: 'ACTIVE'
      },
      {
        id: 16,
        text: 'Watter bottle with a straw',
        status: 'ACTIVE'
      }
    ];

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
    const tags = ['clothes', 'eco', 'green', 'natural'];
    habitService.getHabitsTags().subscribe((data) => {
      expect(data).not.toBeNull();
      expect(data).toEqual(tags);
    });
    const req = httpMock.expectOne(`${habitLink}/tags?lang=en`);
    expect(req.request.method).toBe('GET');
    req.flush(tags);
  });

  it('should return habits by tag and lang', () => {
    const habitList = {
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

    habitService.getHabitsByTagAndLang(1, 1, ['test']).subscribe((data) => {
      expect(data).not.toBeNull();
      expect(data).toEqual(habitList);
    });

    const req = httpMock.expectOne(`${habitLink}/tags/search?lang=en
                                              &page=1&size=1&sort=asc&tags=test`);
    expect(req.request.method).toBe('GET');
    req.flush(habitList);
  });
});
