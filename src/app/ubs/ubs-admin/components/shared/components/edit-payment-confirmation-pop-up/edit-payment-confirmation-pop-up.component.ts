import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-payment-confirmation-pop-up',
  templateUrl: './edit-payment-confirmation-pop-up.component.html',
  styleUrls: ['./edit-payment-confirmation-pop-up.component.scss']
})
export class EditPaymentConfirmationPopUpComponent implements OnInit, OnDestroy {
  public destroy$: Subject<boolean> = new Subject<boolean>();
  popupTitle: string;
  popupConfirm: string;
  popupCancel: string;

  constructor(private matDialogRef: MatDialogRef<EditPaymentConfirmationPopUpComponent>, @Inject(MAT_DIALOG_DATA) public modalData: any) {}

  ngOnInit(): void {
    this.setTitles();

    this.matDialogRef
      .keydownEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.key === 'Escape') {
          this.userReply(false);
        }
        if (event.key === 'Enter') {
          this.userReply(true);
        }
      });
    this.matDialogRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.userReply(false);
      });
  }

  public setTitles(): void {
    this.popupTitle = this.modalData.popupTitle;
    this.popupConfirm = this.modalData.popupConfirm;
    this.popupCancel = this.modalData.popupCancel;
  }

  public userReply(res: boolean): void {
    this.matDialogRef.close(res);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
