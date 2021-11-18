import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-order-cancellation-reason',
  templateUrl: './add-order-cancellation-reason.component.html',
  styleUrls: ['./add-order-cancellation-reason.component.scss']
})
export class AddOrderCancellationReasonComponent implements OnInit {
  closeButton = './assets/img/profile/icons/cancel.svg';
  date = new Date();
  constructor(private dialogRef: MatDialogRef<AddOrderCancellationReasonComponent>) {}

  ngOnInit(): void {}

  closePopup() {
    this.dialogRef.close(true);
    console.log('close');
  }
}
