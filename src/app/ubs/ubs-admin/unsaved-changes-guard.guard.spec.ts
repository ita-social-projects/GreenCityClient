import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of, isObservable, ObservableLike } from 'rxjs';
import { UnsavedChangesGuard, CanComponentDeactivate } from './unsaved-changes-guard.guard';
import { UbsAdminGoBackModalComponent } from './components/ubs-admin-go-back-modal/ubs-admin-go-back-modal.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('UnsavedChangesGuard', () => {
  let guard: UnsavedChangesGuard;
  let dialog: MatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnsavedChangesGuard, { provide: MatDialog, useClass: MatDialogMock }]
    });

    guard = TestBed.inject(UnsavedChangesGuard);
    dialog = TestBed.inject(MatDialog);
  });

  describe('canDeactivate', () => {
    it('should return true if component.canDeactivate is not defined', (done) => {
      const component: CanComponentDeactivate = undefined;
      const result = guard.canDeactivate(component);

      if (result instanceof Observable) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          done();
        });
      } else {
        expect(result).toBe(true);
        done();
      }
    });

    it('should return true if component.canDeactivate is true', (done) => {
      const component: CanComponentDeactivate = {
        canDeactivate: () => of(true),
        getDataForGuard: () => ({ orderIds: [1, 2, 3] })
      };

      const result = guard.canDeactivate(component);

      if (result instanceof Observable) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          done();
        });
      }
    });
  });

  describe('openConfirmDialog', () => {
    it('should open the dialog with the correct component and data', () => {
      const data = { orderIds: [1, 2, 3] };
      spyOn(dialog, 'open').and.callThrough();

      guard.openConfirmDialog(data).subscribe();

      expect(dialog.open).toHaveBeenCalledWith(UbsAdminGoBackModalComponent, {
        width: 'auto',
        data: data
      });
    });

    it('should return an observable that resolves to the value from afterClosed', () => {
      const data = { orderIds: [1, 2, 3] };

      guard.openConfirmDialog(data).subscribe((result) => {
        expect(result).toBe(true);
      });
    });
  });
});
