import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-go-back-modal',
  templateUrl: './ubs-admin-go-back-modal.component.html',
  styleUrls: ['./ubs-admin-go-back-modal.component.scss']
})
export class UbsAdminGoBackModalComponent {
  constructor(private dialogRef: MatDialogRef<UbsAdminGoBackModalComponent>) {}

  discard(): void {
    this.dialogRef.close();
  }
}
