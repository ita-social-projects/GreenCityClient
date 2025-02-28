import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canNavigate: () => boolean;
}

export const PreventNavigationBackGuard: CanDeactivateFn<CanComponentDeactivate> = (component, currentRoute, currentState, nextState) => {
  const dialog = inject(MatDialog);

  if (dialog.openDialogs.length) {
    dialog.closeAll();
    history.pushState(null, '');
    return false;
  }
  return true;
};
