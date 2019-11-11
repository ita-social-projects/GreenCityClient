import { TestBed } from '@angular/core/testing';

import { HabitStatisticService } from './habit-statistic.service';

describe('HabitStatisticService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HabitStatisticService = TestBed.get(HabitStatisticService);
    expect(service).toBeTruthy();
  });
});
