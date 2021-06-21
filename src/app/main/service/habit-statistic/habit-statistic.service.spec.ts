import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HabitStatisticService } from './habit-statistic.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HabitDto } from '@global-models/habit/HabitDto';
import { AvailableHabitDto } from '@global-models/habit/AvailableHabitDto';
import { NewHabitDto } from '@global-models/habit/NewHabitDto';

describe('HabitStatisticService', () => {
  const PLACEHOLDER = '';
  const EMPTY_ARRAY = [];
  let service: HabitStatisticService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HabitStatisticService]
    })
  );

  beforeEach(() => {
    service = TestBed.get(HabitStatisticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('basic functional testing', () => {
    it('should load data into dataStore.habitStatistics in loadHabitStatistics method', fakeAsync(() => {
      const habitStatMock = { id: 4 } as HabitDto;
      const spy = spyOn(service.http, 'get').and.returnValue(of([habitStatMock]));
      service.loadHabitStatistics('english');
      tick(50);
      expect(spy).toHaveBeenCalled();
      expect(service.dataStore.habitStatistics).toEqual([habitStatMock]);
    }));

    it('should load data into dataStore.availableHabits in loadAvailableHabits method', fakeAsync(() => {
      const availHabitMock = { id: 4 } as AvailableHabitDto;
      const spy = spyOn(service.http, 'get').and.returnValue(of([availHabitMock]));
      service.loadAvailableHabits('english');
      tick(50);
      expect(spy).toHaveBeenCalled();
      expect(service.dataStore.availableHabits).toEqual([availHabitMock]);
    }));

    it('should update newHabit field in setNewHabitsState method', () => {
      const args = {
        id: 4
      };
      const newHabitStub = new NewHabitDto(args.id);

      service.setNewHabitsState(args);
      expect(service.dataStore.newHabits).toEqual([newHabitStub]);

      service.setNewHabitsState(args);
      expect(service.dataStore.newHabits).not.toContain(newHabitStub);
    });

    it('should execute clearDataStore method inside createHabits', fakeAsync(() => {
      const spy = spyOn(service, 'clearDataStore');
      spyOn(service.http, 'post').and.returnValue(of(service.dataStore.newHabits));
      service.createHabits('english');
      tick(50);
      expect(spy).toHaveBeenCalled();
    }));

    it('should execute both loadAvailableHabits and loadHabitStatistics in deleteHabit', fakeAsync(() => {
      const statisticSpy = spyOn(service, 'loadHabitStatistics');
      const availableSpy = spyOn(service, 'loadAvailableHabits');
      spyOn(service.http, 'delete').and.returnValue(of(PLACEHOLDER));
      service.deleteHabit(1, 'english');
      tick(50);
      expect(statisticSpy).toHaveBeenCalled();
      expect(availableSpy).toHaveBeenCalled();
    }));

    it('getUserLog should return Observable', (done) => {
      spyOn(service, 'getUserLog').and.returnValue(of(PLACEHOLDER));
      return service.getUserLog().subscribe((data) => {
        expect(data).toEqual(PLACEHOLDER);
        done();
      });
    });

    it('should return habitStatistics length from getNumberOfHabits', () => {
      service.dataStore.habitStatistics = [{} as HabitDto, {} as HabitDto];
      expect(service.getNumberOfHabits()).toEqual(2);
    });

    it('should reset newHabits in clearDataStore', () => {
      service.dataStore.newHabits = [{} as NewHabitDto, {} as NewHabitDto];
      service.clearDataStore('english');
      expect(service.dataStore.newHabits).toEqual(EMPTY_ARRAY);
    });

    it('should execute loadAvailableHabits and loadHabitStatistics inside clearDataStore', fakeAsync(() => {
      const statisticSpy = spyOn(service, 'loadHabitStatistics');
      const availableSpy = spyOn(service, 'loadAvailableHabits');
      spyOn(service.http, 'delete').and.returnValue(of(PLACEHOLDER));
      service.clearDataStore('english');
      tick(50);
      expect(statisticSpy).toHaveBeenCalled();
      expect(availableSpy).toHaveBeenCalled();
    }));

    it('should reset newHabits, availableHabits, habitStatistics fields inside onLogout', () => {
      service.dataStore.newHabits = [{} as NewHabitDto];
      service.dataStore.availableHabits = [{} as AvailableHabitDto];
      service.dataStore.habitStatistics = [{} as HabitDto];
      service.onLogout();
      expect(service.dataStore.newHabits).toEqual(EMPTY_ARRAY);
      expect(service.dataStore.availableHabits).toEqual(EMPTY_ARRAY);
      expect(service.dataStore.habitStatistics).toEqual(EMPTY_ARRAY);
    });
  });
});
