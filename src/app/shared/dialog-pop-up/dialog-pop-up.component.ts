import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PopUpsStyles } from 'src/app/ubs/ubs-admin/components/ubs-admin-employee/ubs-admin-employee-table/employee-models.enum';

@Component({
  selector: 'app-dialog-pop-up',
  templateUrl: './dialog-pop-up.component.html',
  styleUrls: ['./dialog-pop-up.component.scss']
})
export class DialogPopUpComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  popupTitle: string;
  popupSubtitle: string;
  popupConfirm: string;
  popupCancel: string;
  setBtnStyleRed: boolean;
  setBtnStyleGreen: boolean;
  setBtnStyleLightGreen: boolean;
  isItrefund = false;
  іsPermissionConfirm = false;
  isCancelButtonShow = false;

  constructor(
    private matDialogRef: MatDialogRef<DialogPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

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
    this.isCancelButtonShow = !this.isItrefund || !this.іsPermissionConfirm;
  }

  private setTitles(): void {
    this.popupTitle = this.data.popupTitle;
    this.popupSubtitle = this.data.popupSubtitle;
    this.popupConfirm = this.data.popupConfirm;
    this.popupCancel = this.data.popupCancel;
    this.setBtnStyleGreen = this.data.style === PopUpsStyles.green;
    this.setBtnStyleRed = this.data.style === PopUpsStyles.red;
    this.setBtnStyleLightGreen = this.data.style === PopUpsStyles.lightGreen;
    this.isItrefund = this.data.isItrefund;
    this.іsPermissionConfirm = this.data.іsPermissionConfirm;
  }

  public userReply(reply: boolean): void {
    this.matDialogRef.close(reply);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
