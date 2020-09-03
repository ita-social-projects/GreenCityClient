import { TestBed } from '@angular/core/testing';

import { AllHabitsService } from './all-habits.service';

describe('AllHabitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllHabitsService = TestBed.get(AllHabitsService);
    expect(service).toBeTruthy();
  });
});
