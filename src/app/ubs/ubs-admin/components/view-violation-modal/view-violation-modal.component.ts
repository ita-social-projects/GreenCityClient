import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IViolation } from '@ubs/ubs-admin/models/violation.model';
import { OrderService } from '@ubs/ubs-admin/services/order.service';
import { first } from 'rxjs/operators';
import { ShowImgsPopUpComponent } from '@ubs/shared/components/show-imgs-pop-up/show-imgs-pop-up.component';
import { ViolationLevel } from '@ubs/ubs/violation-level.enum';

@Component({
  selector: 'app-view-violation-modal',
  templateUrl: './view-violation-modal.component.html',
  styleUrls: ['./view-violation-modal.component.scss']
})
export class ViewViolationModalComponent implements OnInit {
  violationDetails: IViolation;
  readonly ViolationLevel = ViolationLevel;
  private orderId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<ViewViolationModalComponent>,
    private orderService: OrderService,
    private dialog: MatDialog
  ) {
    this.orderId = data;
  }

  ngOnInit(): void {
    this.orderService
      .getViolationOfCurrentOrder(this.orderId)
      .pipe(first())
      .subscribe((violation) => {
        this.violationDetails = violation;
      });
  }

  openImg(imgIndex: number): void {
    this.dialog.open(ShowImgsPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'custom-img-pop-up',
      data: {
        imgIndex,
        images: this.violationDetails.images.map((img) => ({ src: img }))
      }
    });
  }
}
