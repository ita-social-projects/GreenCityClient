import { TestBed } from '@angular/core/testing';

import { PreventNavigationBackGuard } from './prevent-navigation-back.guard';
import { MatDialog } from '@angular/material/dialog';

describe('PreventNavigationBackGuard', () => {
  let guard: PreventNavigationBackGuard;
  class MatDialogMock {
    closeAll() {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useClass: MatDialogMock }]
    });
    guard = TestBed.inject(PreventNavigationBackGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
