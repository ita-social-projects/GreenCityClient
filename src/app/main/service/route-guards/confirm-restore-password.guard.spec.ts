import { MatSnackBarComponent } from './../../component/errors/mat-snack-bar/mat-snack-bar.component';
import { MatDialog, MatSnackBarModule } from '@angular/material';
import { Router } from '@angular/router';
import { TestBed, async, inject } from '@angular/core/testing';
import { ConfirmRestorePasswordGuard } from './confirm-restore-password.guard';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('ConfirmRestorePasswordGuard', () => {
  beforeEach(() => {
    const router = {
      navigate: jasmine.createSpy('navigate')
  };
    TestBed.configureTestingModule({
      providers: [
      ConfirmRestorePasswordGuard, {provide: Router, useValue: router},
      {provide: MatDialog, useValue: {}}, {provide: MatSnackBarComponent, useValue: {}}
      ],
      imports: [
      BrowserDynamicTestingModule, MatSnackBarModule
      ]
    });
  });

  it('should create guard', inject([ConfirmRestorePasswordGuard], (snackBar: MatSnackBarComponent, router: Router, dialog: MatDialog) => {
    const guard = new ConfirmRestorePasswordGuard(router, dialog, snackBar);
    expect(guard).toBeTruthy();
  }));
});
