import { LanguageService } from './../../i18n/language.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HabitAssignService } from './habit-assign.service';
import { habitAssignLink } from '../../links';
import {
  listOfHabits,
  newHabit,
  assignResponce,
  modifiedAssignResponce,
  HabitsForDate,
  habitsWithTheSameHabitId
} from '../../mocks/habit-assign-mock';

describe('HabitService', () => {
  let service: HabitAssignService;
  let httpMock: HttpTestingController;
  const languageServiceMock = jasmine.createSpyObj('LanguageService', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage = () => 'en';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HabitAssignService, { provide: LanguageService, useValue: languageServiceMock }],
      imports: [HttpClientTestingModule]
    }),
      (httpMock = TestBed.get(HttpTestingController));
    service = TestBed.get(HabitAssignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get data', () => {
    service.getAssignedHabits().subscribe((data) => {
      expect(data).toEqual(listOfHabits);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/allForCurrentUser?lang=${service.language}`);
    expect(req.request.method).toBe('GET');
    req.flush(listOfHabits);
  });
  it('should assign habit', () => {
    service.assignHabit(1).subscribe((habit) => {
      expect(habit).toEqual(assignResponce);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/1`);
    expect(req.request.method).toBe('POST');
    req.flush(assignResponce);
  });
  it('should set status for habit', () => {
    service.setHabitStatus(1, 'INPROGRESS').subscribe((habit) => {
      expect(habit).not.toBe(null);
      expect(habit).toEqual(modifiedAssignResponce);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/1`, 'INPROGRESS');
    expect(req.request.method).toBe('PATCH');
    req.flush(modifiedAssignResponce);
  });
  fit('should return habit by habit id', () => {
    service.getAssignedHabitById(2).subscribe((habit) => {
      expect(habit[0].habit.id).toBe(2);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/2/active?lang=${service.language}`);
    expect(req.request.method).toBe('GET');
    req.flush(listOfHabits);
  });
  it('should return assigned habits by habitId', () => {
    service.getAssignsByHabitId(3).subscribe((habits) => {
      expect(habits).toEqual(habitsWithTheSameHabitId);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/3/all?lang=${service.language}`);
    expect(req.request.method).toBe('GET');
    req.flush(habitsWithTheSameHabitId);
  });
  it('should assign habit with durration', () => {
    service.assignHabitWithDuration(1, 7).subscribe((habit) => {
      expect(habit).toEqual(assignResponce);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/1/custom`, '7');
    expect(req.request.method).toBe('POST');
    req.flush(assignResponce);
  });
  it('should enroll by habit', () => {
    service.enrollByHabit(3, '2021-05-07').subscribe((habit) => {
      expect(habit).toEqual(newHabit);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/3/enroll/2021-05-07?lang=${service.language}`);
    expect(req.request.method).toBe('POST');
    req.flush(newHabit);
  });
  it('should unenroll by habit', () => {
    service.unenrollByHabit(3, '2021-05-07').subscribe((habit) => {
      expect(habit).toEqual(newHabit);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/3/unenroll/2021-05-07`);
    expect(req.request.method).toBe('POST');
    req.flush(newHabit);
  });
  it('should get assigned habit by id', () => {
    service.getHabitAssignById(1).subscribe((habit) => {
      expect(listOfHabits[0].id).toBe(1);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/1?lang=${service.language}`);
    expect(req.request.method).toBe('GET');
    req.flush(listOfHabits);
  });
  it('should get assigned habits by date', () => {
    service.getHabitAssignByDate('2021-02-04').subscribe((habits) => {
      expect(habits[0].createDateTime).toEqual(new Date('2021-02-04'));
    });
    const req = httpMock.expectOne(`${habitAssignLink}/active/2021-02-04?lang=${service.language}`);
    expect(req.request.method).toBe('GET');
    req.flush(listOfHabits);
  });
  it('should get assigned habits by period', () => {
    service.getAssignHabitsByPeriod('2021-05-20', '2021-05-30').subscribe((habits) => {
      expect(habits).toEqual(HabitsForDate);
    });
    const req = httpMock.expectOne(`${habitAssignLink}/activity/2021-05-20/to/2021-05-30?lang=${service.language}`);
    expect(req.request.method).toBe('GET');
    req.flush(HabitsForDate);
  });
  afterEach(() => {
    httpMock.verify();
  });
});
