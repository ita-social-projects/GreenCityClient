import { TestBed } from '@angular/core/testing';

import { UpdateHabitsService } from './update-habits.service';

describe('UpdateHabitsService', () => {
  let service: UpdateHabitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateHabitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
