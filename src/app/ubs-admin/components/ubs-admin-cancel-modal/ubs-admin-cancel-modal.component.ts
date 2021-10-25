import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-cancel-modal',
  templateUrl: './ubs-admin-cancel-modal.component.html',
  styleUrls: ['./ubs-admin-cancel-modal.component.scss']
})
export class UbsAdminCancelModalComponent {
  constructor(private dialogRef: MatDialogRef<UbsAdminCancelModalComponent>) {}

  discard() {
    this.dialogRef.close(true);
  }

  doNotDiscard() {
    this.dialogRef.close(false);
  }
}
