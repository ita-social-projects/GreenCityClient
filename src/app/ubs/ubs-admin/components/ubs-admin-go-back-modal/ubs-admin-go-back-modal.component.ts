import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminTableService } from '@ubs/ubs-admin/services/admin-table.service';

@Component({
  selector: 'app-ubs-admin-go-back-modal',
  templateUrl: './ubs-admin-go-back-modal.component.html',
  styleUrls: ['./ubs-admin-go-back-modal.component.scss']
})
export class UbsAdminGoBackModalComponent {
  constructor(
    private dialogRef: MatDialogRef<UbsAdminGoBackModalComponent>,
    public adminTableService: AdminTableService,
    @Inject(MAT_DIALOG_DATA) public data: { orderIds: number[] }
  ) {}

  doNotDiscardChanges(): void {
    this.dialogRef.close(false);
  }

  discardChanges(): void {
    this.adminTableService.cancelEdit(this.data.orderIds).subscribe();
    this.dialogRef.close(true);
  }
}
