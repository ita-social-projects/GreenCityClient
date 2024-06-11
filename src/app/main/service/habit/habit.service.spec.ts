import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { HabitService } from './habit.service';
import { environment } from '@environment/environment';
import { CUSTOMHABIT } from '@global-user/components/habit/mocks/habit-assigned-mock';
import { HABITLIST } from '@global-user/components/habit/mocks/habit-mock';
import {
  MOCK_CUSTOM_HABIT,
  MOCK_CUSTOM_HABIT_RESPONSE,
  MOCK_FRIEND_PROFILE_PICTURES,
  MOCK_HABITS,
  SHOPLIST
} from '@global-user/components/habit/mocks/shopping-list-mock';
import { TAGLIST } from '@global-user/components/habit/mocks/tags-list-mock';
import { HttpResponse } from '@angular/common/http';

describe('HabitService', () => {
  const habitLink = `${environment.backendLink}habit`;
  const backendLink = environment.backendLink;
  let habitService: HabitService;
  let httpMock: HttpTestingController;

  let langMock = null;

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('localStorageService', ['languageBehaviourSubject']);
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
    habitService.getHabitsByTagAndLang(1, 1, ['test'], 'en').subscribe((data) => {
      expect(data).not.toBeNull();
      expect(data).toEqual(HABITLIST);
    });

    const req = httpMock.expectOne(`${habitLink}/tags/search?lang=en&page=1&size=1&sort=asc&tags=test`);
    expect(req.request.method).toBe('GET');
    req.flush(HABITLIST);
  });

  it('should return an Observable HabitListInterface', () => {
    const filters = ['filter1', 'filter2'];
    const page = 1;
    const size = 10;
    const language = 'en';
    habitService.getHabitsByFilters(page, size, language, filters).subscribe((habits) => {
      expect(habits).toEqual(MOCK_HABITS);
    });
    const req = httpMock.expectOne(`${habitLink}/search?lang=${language}&page=${page}&size=${size}&sort=asc&${filters.join('&')}`);
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
});
