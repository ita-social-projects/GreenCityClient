import { MatSnackBarComponent } from './../../component/errors/mat-snack-bar/mat-snack-bar.component';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { ConfirmRestorePasswordGuard } from './confirm-restore-password.guard';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ConfirmRestorePasswordGuard', () => {
  let guard: ConfirmRestorePasswordGuard;
  const fakeToken = 'MTY1NDQzODU2NzIyMS41MGFjNWYyMS00ZmVhLTQ5NGItYjZhZi0xYmNlMTZjZTczNjQ';
  const routerMock = {
    navigateByUrl: jasmine.createSpy('navigateByUrl')
  };
  const snackBarMock = jasmine.createSpyObj('snackBar', ['openSnackBar']);
  const dialogMock = jasmine.createSpyObj('dialog', ['open']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBarComponent, useValue: snackBarMock }
      ],
      imports: [BrowserDynamicTestingModule, MatSnackBarModule]
    });
    guard = TestBed.inject(ConfirmRestorePasswordGuard);
  });

  it('should create guard', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return false if no token and navigate to the ubs page', () => {
      const next = {
        queryParams: { token: null },
        pathFromRoot: [{}, { routeConfig: { path: 'ubs' } }]
      };
      const res = guard.canActivate(next as any);
      expect(res).toBeFalsy();
      expect(guard.isUbs).toBeTruthy();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/ubs');
    });

    it('should return false if no token and navigate to the root page', () => {
      const next = {
        queryParams: { token: null },
        pathFromRoot: [{}, { routeConfig: { path: '' } }]
      };
      const res = guard.canActivate(next as any);
      expect(res).toBeFalsy();
      expect(guard.isUbs).toBeFalsy();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should return false if time is expired and navigate to the ubs page', () => {
      const next = {
        queryParams: { token: fakeToken },
        pathFromRoot: [{}, { routeConfig: { path: 'ubs' } }]
      };
      const openSingInWindowSpy = spyOn(guard as any, 'openSingInWindow').and.callThrough();
      guard.currenDate = 9654355131775;
      const res = guard.canActivate(next as any);
      expect(res).toBeFalsy();
      expect(guard.isUbs).toBeTruthy();
      expect(openSingInWindowSpy).toHaveBeenCalled();
      expect(dialogMock.open).toHaveBeenCalled();
      expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('sendNewLetter');
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/ubs');
    });

    it('should return false time is expired and navigate to the root page', () => {
      const next = {
        queryParams: { token: fakeToken },
        pathFromRoot: [{}, { routeConfig: { path: '' } }]
      };
      const openSingInWindowSpy = spyOn(guard as any, 'openSingInWindow').and.callThrough();
      guard.currenDate = 9654355131775;
      const res = guard.canActivate(next as any);
      expect(res).toBeFalsy();
      expect(guard.isUbs).toBeFalsy();
      expect(openSingInWindowSpy).toHaveBeenCalled();
      expect(dialogMock.open).toHaveBeenCalled();
      expect(snackBarMock.openSnackBar).toHaveBeenCalledWith('sendNewLetter');
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
    });

    it('should return true', () => {
      const next = {
        queryParams: { token: fakeToken },
        pathFromRoot: [{}, { routeConfig: { path: '' } }]
      };
      guard.currenDate = 1654355131775;
      const res = guard.canActivate(next as any);
      expect(res).toBeTruthy();
    });
  });
});
