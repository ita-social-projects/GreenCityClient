import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubs-admin-go-back-modal',
  templateUrl: './ubs-admin-go-back-modal.component.html',
  styleUrls: ['./ubs-admin-go-back-modal.component.scss']
})
export class UbsAdminGoBackModalComponent {
  constructor(private router: Router, private dialogRef: MatDialogRef<UbsAdminGoBackModalComponent>) {}

  doNotDiscardChanges(): void {
    this.dialogRef.close();
  }

  discardChanges(): void {
    this.dialogRef.close();
    this.dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['/orders']);
    });
  }
}
