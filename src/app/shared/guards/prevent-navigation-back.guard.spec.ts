import { TestBed } from '@angular/core/testing';

import { PreventNavigationBackGuard } from './prevent-navigation-back.guard';

describe('PreventNavigationBack2Guard', () => {
  let guard: PreventNavigationBackGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventNavigationBackGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
