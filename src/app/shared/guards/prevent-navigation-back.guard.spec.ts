import { TestBed } from '@angular/core/testing';

import { PreventNavigationBackGuard } from './prevent-navigation-back.guard';
import { MatDialog } from '@angular/material/dialog';

class MatDialogMock {
  closeAll() {}
}

describe('PreventNavigationBackGuard', () => {
  let guard: PreventNavigationBackGuard;

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
