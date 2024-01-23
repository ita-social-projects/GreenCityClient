import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { HabitService } from './habit.service';
import { environment } from '@environment/environment.js';
import { CUSTOMHABIT } from '@global-user/components/habit/mocks/habit-assigned-mock';
import { HABITLIST } from '@global-user/components/habit/mocks/habit-mock';
import { SHOPLIST } from '@global-user/components/habit/mocks/shopping-list-mock';
import { TAGLIST } from '@global-user/components/habit/mocks/tags-list-mock';

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
});
