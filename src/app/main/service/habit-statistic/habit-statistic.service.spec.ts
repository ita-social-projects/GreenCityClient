import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HabitStatisticService } from './habit-statistic.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NewHabitDto } from '@global-models/habit/NewHabitDto';
import { habitStatisticLink } from '../../links';
import {
  AVAIL_HABIT_ARRAY_MOCK,
  HABIT_STATISTIC_DTO,
  HABIT_STATISTICS,
  NEW_HABIT_ARRAY_MOCK
} from '@global-user/components/habit/mocks/habit-mock';

describe('HabitStatisticService', () => {
  let service: HabitStatisticService;
  let httpMock: HttpTestingController;
  const PLACEHOLDER = '';
  const EMPTY_ARRAY = [];
  const argsWithIdMock = { id: 4 };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HabitStatisticService]
    })
  );

  beforeEach(() => {
    service = TestBed.inject(HabitStatisticService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('basic functional testing', () => {
    it('should load data into dataStore.habitStatistics in loadHabitStatistics method', fakeAsync(() => {
      const spy = spyOn((service as any).http, 'get').and.returnValue(of(NEW_HABIT_ARRAY_MOCK));
      service.loadHabitStatistics('english');
      tick(50);

      expect(spy).toHaveBeenCalled();
      expect((service as any).dataStore.habitStatistics).toEqual(NEW_HABIT_ARRAY_MOCK);
    }));

    it('should load data into dataStore.availableHabits in loadAvailableHabits method', fakeAsync(() => {
      const spy = spyOn((service as any).http, 'get').and.returnValue(of(AVAIL_HABIT_ARRAY_MOCK));
      service.loadAvailableHabits('english');
      tick(50);

      expect(spy).toHaveBeenCalled();
      expect((service as any).dataStore.availableHabits).toEqual(AVAIL_HABIT_ARRAY_MOCK);
    }));

    it('should update newHabit field in setNewHabitsState method', () => {
      const newHabitStub = new NewHabitDto(argsWithIdMock.id);
      service.setNewHabitsState(argsWithIdMock);

      expect((service as any).dataStore.newHabits).toContain(newHabitStub);

      service.setNewHabitsState(argsWithIdMock);

      expect((service as any).dataStore.newHabits).not.toContain(newHabitStub);
    });

    it('should execute clearDataStore method inside createHabits', fakeAsync(() => {
      const spy = spyOn(service, 'clearDataStore');

      spyOn((service as any).http, 'post').and.returnValue(of((service as any).dataStore.newHabits));
      service.createHabits('english');
      tick(50);

      expect(spy).toHaveBeenCalled();
    }));

    it('should execute both loadAvailableHabits and loadHabitStatistics in deleteHabit', fakeAsync(() => {
      const statisticSpy = spyOn(service, 'loadHabitStatistics');
      const availableSpy = spyOn(service, 'loadAvailableHabits');

      spyOn((service as any).http, 'delete').and.returnValue(of(PLACEHOLDER));
      service.deleteHabit(1, 'english');
      tick(50);

      expect(statisticSpy).toHaveBeenCalled();
      expect(availableSpy).toHaveBeenCalled();
    }));

    it('getUserLog should return Observable', (done) => {
      spyOn(service, 'getUserLog').and.returnValue(of(PLACEHOLDER));
      service.getUserLog().subscribe((data) => {
        expect(data).toEqual(PLACEHOLDER);
        done();
      });
    });

    it('should return habitStatistics length', () => {
      (service as any).dataStore.habitStatistics = NEW_HABIT_ARRAY_MOCK;
      const habitStatLength = service.getNumberOfHabits();

      expect(habitStatLength).toEqual(NEW_HABIT_ARRAY_MOCK.length);
    });

    it('should reset newHabits in clearDataStore', () => {
      (service as any).dataStore.newHabits = NEW_HABIT_ARRAY_MOCK;
      service.clearDataStore('english');

      expect((service as any).dataStore.newHabits).toEqual(EMPTY_ARRAY);
    });

    it('should execute loadAvailableHabits and loadHabitStatistics inside clearDataStore', fakeAsync(() => {
      const statisticSpy = spyOn(service, 'loadHabitStatistics');
      const availableSpy = spyOn(service, 'loadAvailableHabits');
      service.clearDataStore('english');
      tick(50);

      expect(statisticSpy).toHaveBeenCalled();
      expect(availableSpy).toHaveBeenCalled();
    }));

    it('should reset newHabits, availableHabits, habitStatistics fields inside onLogout', () => {
      (service as any).dataStore.habitStatistics = NEW_HABIT_ARRAY_MOCK;
      (service as any).dataStore.availableHabits = AVAIL_HABIT_ARRAY_MOCK;
      (service as any).dataStore.newHabits = NEW_HABIT_ARRAY_MOCK;
      service.onLogout();

      expect((service as any).dataStore.habitStatistics).toEqual(EMPTY_ARRAY);
      expect((service as any).dataStore.availableHabits).toEqual(EMPTY_ARRAY);
      expect((service as any).dataStore.newHabits).toEqual(EMPTY_ARRAY);
    });
  });

  it('should update habit statistic', () => {
    const habitStatisticDto = HABIT_STATISTIC_DTO;
    service.updateHabitStatistic(habitStatisticDto);
    const req = httpMock.expectOne(`${habitStatisticLink}${habitStatisticDto.id}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(habitStatisticDto);
  });

  it('should create habit statistic', () => {
    const habitStatistics = HABIT_STATISTICS;
    service.createHabitStatistic(habitStatistics);
    const req = httpMock.expectOne(`${habitStatisticLink}`);
    expect(req.request.method).toBe('POST');
    req.flush(habitStatistics);
  });
});
