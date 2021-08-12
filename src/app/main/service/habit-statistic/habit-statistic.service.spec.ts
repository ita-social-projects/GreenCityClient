import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HabitStatisticService } from './habit-statistic.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HabitDto } from '@global-models/habit/HabitDto';
import { AvailableHabitDto } from '@global-models/habit/AvailableHabitDto';
import { NewHabitDto } from '@global-models/habit/NewHabitDto';

describe('HabitStatisticService', () => {
  let service: HabitStatisticService;
  const PLACEHOLDER = '';
  const EMPTY_ARRAY = [];

  const habitStatMock: HabitDto = {} as HabitDto;
  const habitStatArrayMock: HabitDto[] = [habitStatMock];

  const availHabitMock: AvailableHabitDto = {} as AvailableHabitDto;
  const availHabitArrayMock: AvailableHabitDto[] = [availHabitMock];

  const newHabitMock: NewHabitDto = {} as NewHabitDto;
  const newHabitArrayMock: NewHabitDto[] = [newHabitMock];

  const argsWithIdMock = { id: 4 };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HabitStatisticService]
    })
  );

  beforeEach(() => {
    service = TestBed.inject(HabitStatisticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('basic functional testing', () => {
    it('should load data into dataStore.habitStatistics in loadHabitStatistics method', fakeAsync(() => {
      // @ts-ignore
      const spy = spyOn(service.http, 'get').and.returnValue(of(habitStatArrayMock));
      service.loadHabitStatistics('english');
      tick(50);

      expect(spy).toHaveBeenCalled();
      // @ts-ignore
      expect(service.dataStore.habitStatistics).toEqual(habitStatArrayMock);
    }));

    it('should load data into dataStore.availableHabits in loadAvailableHabits method', fakeAsync(() => {
      // @ts-ignore
      const spy = spyOn(service.http, 'get').and.returnValue(of(availHabitArrayMock));
      service.loadAvailableHabits('english');
      tick(50);

      expect(spy).toHaveBeenCalled();
      // @ts-ignore
      expect(service.dataStore.availableHabits).toEqual(availHabitArrayMock);
    }));

    it('should update newHabit field in setNewHabitsState method', () => {
      const newHabitStub = new NewHabitDto(argsWithIdMock.id);
      service.setNewHabitsState(argsWithIdMock);
      // @ts-ignore
      expect(service.dataStore.newHabits).toContain(newHabitStub);

      service.setNewHabitsState(argsWithIdMock);
      // @ts-ignore
      expect(service.dataStore.newHabits).not.toContain(newHabitStub);
    });

    it('should execute clearDataStore method inside createHabits', fakeAsync(() => {
      const spy = spyOn(service, 'clearDataStore');
      // @ts-ignore
      spyOn(service.http, 'post').and.returnValue(of(service.dataStore.newHabits));
      service.createHabits('english');
      tick(50);

      expect(spy).toHaveBeenCalled();
    }));

    it('should execute both loadAvailableHabits and loadHabitStatistics in deleteHabit', fakeAsync(() => {
      const statisticSpy = spyOn(service, 'loadHabitStatistics');
      const availableSpy = spyOn(service, 'loadAvailableHabits');
      // @ts-ignore
      spyOn(service.http, 'delete').and.returnValue(of(PLACEHOLDER));
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
      // @ts-ignore
      service.dataStore.habitStatistics = habitStatArrayMock;
      const habitStatLength = service.getNumberOfHabits();

      expect(habitStatLength).toEqual(habitStatArrayMock.length);
    });

    it('should reset newHabits in clearDataStore', () => {
      // @ts-ignore
      service.dataStore.newHabits = newHabitArrayMock;
      service.clearDataStore('english');

      // @ts-ignore
      expect(service.dataStore.newHabits).toEqual(EMPTY_ARRAY);
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
      // @ts-ignore
      service.dataStore.habitStatistics = habitStatArrayMock;
      // @ts-ignore
      service.dataStore.availableHabits = availHabitArrayMock;
      // @ts-ignore
      service.dataStore.newHabits = newHabitArrayMock;
      service.onLogout();

      // @ts-ignore
      expect(service.dataStore.habitStatistics).toEqual(EMPTY_ARRAY);
      // @ts-ignore
      expect(service.dataStore.availableHabits).toEqual(EMPTY_ARRAY);
      // @ts-ignore
      expect(service.dataStore.newHabits).toEqual(EMPTY_ARRAY);
    });
  });
});
