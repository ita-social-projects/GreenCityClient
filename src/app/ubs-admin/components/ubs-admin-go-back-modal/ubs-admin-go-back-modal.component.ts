import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-go-back-modal',
  templateUrl: './ubs-admin-go-back-modal.component.html',
  styleUrls: ['./ubs-admin-go-back-modal.component.scss']
})
export class UbsAdminGoBackModalComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<UbsAdminGoBackModalComponent>) {}

  ngOnInit() {}

  discard(): void {
    this.dialogRef.close();
  }
}
