import { TestBed } from '@angular/core/testing';

import { UbsUserGuardGuard } from './ubs-user-guard.guard';

describe('UbsUserGuardGuard', () => {
  let guard: UbsUserGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UbsUserGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
