import { TestBed } from '@angular/core/testing';
import { PreventNavigationBackGuard } from './prevent-navigation-back.guard';
import { MatDialog } from '@angular/material/dialog';
import { ComponentCanDeactivate } from '@global-service/pending-changes-guard/pending-changes.guard';

describe('PreventNavigationBackGuard', () => {
  let guard: PreventNavigationBackGuard;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['openDialogs', 'closeAll']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogSpyObj }]
    });
    guard = TestBed.inject(PreventNavigationBackGuard);
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow navigation back when dialogs are not open', () => {
    dialogSpyObj.openDialogs = [];
    const spy = spyOn(history, 'pushState');
    const result = guard.canDeactivate({} as ComponentCanDeactivate);
    expect(result).toBeTruthy();
    expect(dialogSpyObj.closeAll).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalledWith(null, '');
  });

  it('should prevent navigation back and close dialogs when dialogs are open', () => {
    dialogSpyObj.openDialogs = [{}];
    const spy = spyOn(history, 'pushState');
    const result = guard.canDeactivate({} as ComponentCanDeactivate);
    expect(result).toBeFalsy();
    expect(dialogSpyObj.closeAll).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(null, '');
  });
});
