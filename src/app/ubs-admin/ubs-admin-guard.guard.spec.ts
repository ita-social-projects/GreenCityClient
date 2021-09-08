import { TestBed } from '@angular/core/testing';

import { UbsAdminGuardGuard } from './ubs-admin-guard.guard';

describe('UbsAdminGuardGuard', () => {
  let guard: UbsAdminGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UbsAdminGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
