import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentCanDeactivate } from '@global-service/pending-changes-guard/pending-changes.guard';

export const PreventNavigationBackGuard: CanDeactivateFn<ComponentCanDeactivate> = () => {
  const dialog = inject(MatDialog);

  if (dialog.openDialogs.length) {
    dialog.closeAll();
    history.pushState(null, '');
    return false;
  }

  return true;
};
