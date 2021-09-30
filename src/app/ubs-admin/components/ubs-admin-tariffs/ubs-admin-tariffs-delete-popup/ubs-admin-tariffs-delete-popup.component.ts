import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TariffsService } from '../../../services/tariffs.service';
import { Bag } from '../../../models/tariffs.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-tariffs-delete-popup',
  templateUrl: './ubs-admin-tariffs-delete-popup.component.html',
  styleUrls: ['./ubs-admin-tariffs-delete-popup.component.scss']
})
export class UbsAdminTariffsDeletePopupComponent implements OnDestroy {
  receivedData: Bag;
  private destroy: Subject<boolean> = new Subject<boolean>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Bag, private tariffsService: TariffsService, public dialog: MatDialog) {
    this.receivedData = data;
  }

  deleteService(receivedData) {
    this.tariffsService
      .deleteService(receivedData.bagData.id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialog.closeAll();
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
