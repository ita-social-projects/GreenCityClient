import { TestBed, async, inject } from '@angular/core/testing';

import { ConfirmRestorePasswordGuard } from './confirm-restore-password.guard';

describe('ConfirmRestorePasswordGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmRestorePasswordGuard]
    });
  });

  it('should ...', inject([ConfirmRestorePasswordGuard], (guard: ConfirmRestorePasswordGuard) => {
    expect(guard).toBeTruthy();
  }));
});
