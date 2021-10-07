import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TariffsService } from '../../../services/tariffs.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-tariffs-delete-popup',
  templateUrl: './ubs-admin-tariffs-delete-popup.component.html',
  styleUrls: ['./ubs-admin-tariffs-delete-popup.component.scss']
})
export class UbsAdminTariffsDeletePopupComponent implements OnDestroy {
  receivedData;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private tariffsService: TariffsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsDeletePopupComponent>
  ) {
    this.receivedData = data;
  }

  deleteTariffForService(receivedData) {
    this.tariffsService
      .deleteTariffForService(receivedData.bagData.id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close({});
      });
  }

  deleteService(receivedData) {
    this.tariffsService
      .deleteService(receivedData.serviceData.id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close({});
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
