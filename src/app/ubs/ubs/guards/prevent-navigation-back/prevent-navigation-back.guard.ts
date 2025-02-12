import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
  canNavigate: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PreventNavigationBackGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private readonly dialog: MatDialog) {}

  canDeactivate(component: CanComponentDeactivate): boolean {
    if (this.dialog.openDialogs.length) {
      this.dialog.closeAll();
      history.pushState(null, '');
      return false;
    }
    return true;
  }
}
