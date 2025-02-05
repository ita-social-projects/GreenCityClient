import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class PreventNavigationBackGuard {
  constructor(private readonly dialog: MatDialog) {}

  canNavigate(): boolean {
    if (this.dialog.openDialogs.length) {
      this.dialog.closeAll();
      history.pushState(null, '');
      return false;
    } else {
      return true;
    }
  }
}
