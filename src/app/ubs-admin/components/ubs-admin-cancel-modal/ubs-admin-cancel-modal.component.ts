import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-cancel-modal',
  templateUrl: './ubs-admin-cancel-modal.component.html',
  styleUrls: ['./ubs-admin-cancel-modal.component.scss']
})
export class UbsAdminCancelModalComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<UbsAdminCancelModalComponent>) {}

  ngOnInit() {}

  discard(): void {
    this.dialogRef.close();
  }
}
