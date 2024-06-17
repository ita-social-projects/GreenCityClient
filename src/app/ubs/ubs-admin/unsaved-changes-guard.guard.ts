import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UbsAdminGoBackModalComponent } from './components/ubs-admin-go-back-modal/ubs-admin-go-back-modal.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
  getDataForGuard: () => any;
}

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard {
  constructor(private dialog: MatDialog) {}

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    return component?.canDeactivate ? component.canDeactivate() : true;
  }

  openConfirmDialog(data: { orderIds: number[] }): Observable<boolean> {
    const dialogRef = this.dialog.open(UbsAdminGoBackModalComponent, {
      width: 'auto',
      data: data
    });

    return dialogRef.afterClosed();
  }
}
