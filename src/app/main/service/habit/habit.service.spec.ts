import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { HabitService } from './habit.service';
import { environment } from '@environment/environment';
import { CUSTOMHABIT } from '@global-user/components/habit/mocks/habit-assigned-mock';
import { CRITERIA, CRITERIA_FILTER, CRITERIA_TAGS, HABITLIST } from '@global-user/components/habit/mocks/habit-mock';
import {
  MOCK_CUSTOM_HABIT,
  MOCK_CUSTOM_HABIT_RESPONSE,
  MOCK_FRIEND_PROFILE_PICTURES,
  MOCK_HABITS,
  SHOPLIST
} from '@global-user/components/habit/mocks/shopping-list-mock';
import { TAGLIST } from '@global-user/components/habit/mocks/tags-list-mock';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { HabitPageable } from '@global-user/components/habit/models/interfaces/custom-habit.interface';

export function makeCall(habitService: HabitService, criteria: HabitPageable) {
  habitService.getHabitsByFilters(criteria).subscribe((data) => {
    expect(data).not.toBeNull();
    expect(data).toEqual(HABITLIST);
  });
}

describe('HabitService', () => {
  const habitLink = `${environment.backendLink}habit`;
  const backendLink = environment.backendLink;
  let habitService: HabitService;
  let httpMock: HttpTestingController;

  let langMock = null;

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('localStorageService', [
    'languageBehaviourSubject',
    'getAccessToken'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');
  (localStorageServiceMock.getAccessToken as jasmine.Spy).and.returnValue('accessToken');

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
      expect(data).toBe(HABITLIST);
    });

    const req = httpMock.expectOne(`${habitLink}?lang=en&page=1&size=1`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(HABITLIST);
  });

  it('should return habit by id', () => {
    habitService.getHabitById(1).subscribe((data) => {
      expect(data).toBe(CUSTOMHABIT);
    });

    const req = httpMock.expectOne(`${habitLink}/1?lang=en`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(CUSTOMHABIT);
  });

  it('should return habit shopping list', () => {
    habitService.getHabitShoppingList(2).subscribe((data) => {
      expect(data).toBe(SHOPLIST);
    });

    const req = httpMock.expectOne(`${habitLink}/2/shopping-list?lang=en`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    expect(req.request.method).toBe('GET');
    req.flush(SHOPLIST);
  });

  it('should return habit tags', () => {
    habitService.getAllTags().subscribe((data) => {
      expect(data).not.toBeNull();
      expect(data).toEqual(TAGLIST);
    });
    const req = httpMock.expectOne(`${backendLink}tags/v2/search?type=HABIT`);
    expect(req.request.method).toBe('GET');
    req.flush(TAGLIST);
  });

  it('should return habits by tag and lang', () => {
    const params = new HttpParams()
      .set('lang', CRITERIA_TAGS.lang)
      .set('page', CRITERIA_TAGS.page.toString())
      .set('size', CRITERIA_TAGS.size.toString())
      .set('sort', CRITERIA_TAGS.sort)
      .set('excludeAssigned', CRITERIA_TAGS.excludeAssigned.toString())
      .set('tags', CRITERIA_TAGS.tags.join(','));

    const expectedUrl = `${habitLink}/tags/search?${params.toString()}`;

    habitService.getHabitsByTagAndLang(CRITERIA_TAGS).subscribe((data) => {
      expect(data).not.toBeNull();
      expect(data).toEqual(HABITLIST);
    });
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(HABITLIST);
  });

  it('should return an Observable HabitListInterface', () => {
    const params = new HttpParams()
      .set('lang', CRITERIA_FILTER.lang)
      .set('page', CRITERIA_FILTER.page.toString())
      .set('size', CRITERIA_FILTER.size.toString())
      .set('sort', CRITERIA_FILTER.sort)
      .set('filters', CRITERIA_FILTER.filters.join(','));
    const expectedUrl = `${habitLink}/search?${params.toString()}`;

    habitService.getHabitsByFilters(CRITERIA_FILTER).subscribe((habits) => {
      expect(habits).toEqual(MOCK_HABITS);
    });
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_HABITS);
  });

  it('should add a custom habit', () => {
    const habit = MOCK_CUSTOM_HABIT;
    const lang = 'en';
    const mockResponse = MOCK_CUSTOM_HABIT_RESPONSE;

    habitService.addCustomHabit(habit, lang).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${habitLink}/custom`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should change a custom habit', () => {
    const habit = MOCK_CUSTOM_HABIT;
    const lang = 'en';
    const id = 1;
    const mockResponse = MOCK_CUSTOM_HABIT_RESPONSE;

    habitService.changeCustomHabit(habit, lang, id).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${habitLink}/update/${id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should get friends tracking the same habit by habit id', () => {
    const id = 1;
    const mockResponse = MOCK_FRIEND_PROFILE_PICTURES;
    habitService.getFriendsTrakingSameHabitByHabitId(id).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${habitLink}/${id}/friends/profile-pictures`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should delete custom habit', () => {
    const id = CUSTOMHABIT.id;
    habitService.deleteCustomHabit(id).subscribe();
    const req = httpMock.expectOne(`${habitLink}/delete/${id}`);
    req.flush(new HttpResponse({ status: 200 }));

    expect(req.request.method).toBe('DELETE');
    httpMock.verify();
  });

  it('should correctly transform HabitPageable to HttpParams', () => {
    const params = habitService['getHttpParams'](CRITERIA_FILTER);
    const expectedParams = new HttpParams()
      .set('lang', 'en')
      .set('page', '1')
      .set('size', '10')
      .set('sort', 'asc')
      .set('filters', 'filter1,filter2');
    expect(params.toString()).toBe(expectedParams.toString());
  });

  it('should handle null and undefined values', () => {
    const criteria: HabitPageable = {
      page: 1,
      size: null,
      lang: undefined,
      filters: ['filter1'],
      sort: 'asc'
    };
    const params = habitService['getHttpParams'](criteria);
    const expectedParams = new HttpParams()
      .set('lang', 'en')
      .set('page', '1')
      .set('size', '6')
      .set('sort', 'asc')
      .set('filters', 'filter1');
    expect(params.toString()).toBe(expectedParams.toString());
  });

  it('should handle empty arrays correctly', () => {
    const params = habitService['getHttpParams'](CRITERIA);
    const expectedParams = new HttpParams().set('lang', 'en').set('page', '1').set('size', '1').set('sort', 'asc');
    expect(params.toString()).toBe(expectedParams.toString());
  });

  it('should include isCustomHabit=true when set to true', () => {
    const criteria: HabitPageable = {
      page: 1,
      size: 10,
      lang: 'en',
      sort: 'asc',
      excludeAssigned: false,
      filters: ['filter1,isCustomHabit=true'],
      tags: ['tag1']
    };

    const params = habitService['getHttpParams'](criteria);
    const expectedParams = new HttpParams()
      .set('lang', 'en')
      .set('page', '1')
      .set('size', '10')
      .set('sort', 'asc')
      .set('excludeAssigned', 'false')
      .set('filters', 'filter1')
      .set('isCustomHabit', 'true')
      .set('tags', 'tag1');
    const expectedUrl = `${habitLink}/search?${params.toString()}`;

    expect(params.toString()).toBe(expectedParams.toString());
    makeCall(habitService, criteria);
    const req = httpMock.expectOne((request) => {
      return request.urlWithParams === expectedUrl;
    });
    expect(req.request.method).toBe('GET');
    req.flush(HABITLIST);
  });

  it('should include isCustomHabit=false when set to false', () => {
    const criteria: HabitPageable = {
      page: 1,
      size: 10,
      lang: 'en',
      sort: 'asc',
      excludeAssigned: false,
      filters: ['filter2,isCustomHabit=false'],
      tags: ['tag2']
    };
    const params = habitService['getHttpParams'](criteria);
    const expectedParams = new HttpParams()
      .set('lang', 'en')
      .set('page', '1')
      .set('size', '10')
      .set('sort', 'asc')
      .set('excludeAssigned', 'false')
      .set('filters', 'filter2')
      .set('isCustomHabit', 'false')
      .set('tags', 'tag2');

    expect(params.toString()).toBe(expectedParams.toString());
    makeCall(habitService, criteria);
    const req = httpMock.expectOne((request) => {
      return request.urlWithParams === `${habitLink}/search?${params.toString()}`;
    });
    expect(req.request.method).toBe('GET');
    req.flush(HABITLIST);
  });

  it('should not include isCustomHabit when omitted', () => {
    const criteria: HabitPageable = {
      lang: 'en',
      page: 1,
      size: 10,
      sort: 'asc',
      excludeAssigned: false,
      filters: ['filter3'],
      tags: ['tag3']
    };
    const params = habitService['getHttpParams'](criteria);
    const expectedParams = new HttpParams()
      .set('lang', 'en')
      .set('page', '1')
      .set('size', '10')
      .set('sort', 'asc')
      .set('excludeAssigned', 'false')
      .set('filters', 'filter3')
      .set('tags', 'tag3');

    const expectedUrl = `${habitLink}/search?${params.toString()}`;
    expect(params.toString()).toBe(expectedParams.toString());
    makeCall(habitService, criteria);
    const req = httpMock.expectOne((request) => request.urlWithParams === expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(HABITLIST);
  });

  it('should not include isCustomHabit when set to null', () => {
    const criteria: HabitPageable = {
      lang: 'en',
      page: 1,
      size: 10,
      sort: 'asc',
      excludeAssigned: false,
      filters: ['filter4'],
      tags: ['tag4']
    };
    const params = habitService['getHttpParams'](criteria);
    const expectedParams = new HttpParams()
      .set('lang', 'en')
      .set('page', '1')
      .set('size', '10')
      .set('sort', 'asc')
      .set('excludeAssigned', 'false')
      .set('filters', 'filter4')
      .set('tags', 'tag4');

    expect(params.toString()).toBe(expectedParams.toString());
    const expectedUrl = `${habitLink}/search?${params.toString()}`;
    makeCall(habitService, criteria);
    const req = httpMock.expectOne((request) => request.urlWithParams === expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(HABITLIST);
  });
});
