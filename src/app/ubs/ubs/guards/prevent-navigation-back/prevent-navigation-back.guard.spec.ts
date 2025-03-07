import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { PreventNavigationBackGuard, CanComponentDeactivate } from './prevent-navigation-back.guard';

describe('preventNavigationBackGuard', () => {
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll'], { openDialogs: [] });

    TestBed.configureTestingModule({
      providers: [{ provide: MatDialog, useValue: dialogSpy }]
    });
  });

  it('should allow navigation when no dialogs are open', () => {
    Object.defineProperty(dialogSpy, 'openDialogs', { get: () => [] });
    const mockComponent: CanComponentDeactivate = { canNavigate: () => true };
    const spy = spyOn(history, 'pushState');

    const result = TestBed.runInInjectionContext(() => PreventNavigationBackGuard(mockComponent, {} as any, {} as any, {} as any));

    expect(result).toBeTrue();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should prevent navigation and close dialogs when dialogs are open', () => {
    Object.defineProperty(dialogSpy, 'openDialogs', { get: () => [{}] });
    const mockComponent: CanComponentDeactivate = { canNavigate: () => false };
    const spy = spyOn(history, 'pushState');

    const result = TestBed.runInInjectionContext(() => PreventNavigationBackGuard(mockComponent, {} as any, {} as any, {} as any));

    expect(result).toBeFalse();
    expect(dialogSpy.closeAll).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(null, '');
  });
});
