import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { NonAdminGuard } from './non-admin.guard';

describe('nonAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => NonAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
