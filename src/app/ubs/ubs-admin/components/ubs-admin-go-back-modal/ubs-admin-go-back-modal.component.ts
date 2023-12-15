import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubs-admin-go-back-modal',
  templateUrl: './ubs-admin-go-back-modal.component.html',
  styleUrls: ['./ubs-admin-go-back-modal.component.scss']
})
export class UbsAdminGoBackModalComponent {
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<UbsAdminGoBackModalComponent>
  ) {}

  doNotDiscardChanges(): void {
    this.dialogRef.close();
  }

  discardChanges(): void {
    this.dialogRef.close();
    this.router.navigate(['ubs-admin', 'orders']);
  }
}
