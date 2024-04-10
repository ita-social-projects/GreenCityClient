import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate } from '@angular/router';
import { ComponentCanDeactivate } from '@global-service/pending-changes-guard/pending-changes.guard';

@Injectable({
  providedIn: 'root'
})
export class PreventNavigationBackGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(private dialog: MatDialog) {}

  canDeactivate(component: ComponentCanDeactivate): boolean {
    if (this.dialog.openDialogs.length) {
      this.dialog.closeAll();
      history.pushState(null, '');
      return false;
    } else {
      return true;
    }
  }
}
