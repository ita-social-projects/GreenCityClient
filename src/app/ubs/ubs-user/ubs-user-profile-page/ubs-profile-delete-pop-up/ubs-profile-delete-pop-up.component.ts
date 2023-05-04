import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ubs-profile-delete-pop-up',
  templateUrl: './ubs-profile-delete-pop-up.component.html',
  styleUrls: ['./ubs-profile-delete-pop-up.component.scss']
})
export class UbsProfileDeletePopUpComponent implements OnInit {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  popupTitle: string;
  popupSubtitle: string;
  popupConfirm: string;
  popupCancel: string;

  constructor(private matDialogRef: MatDialogRef<UbsProfileDeletePopUpComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.setTitles();

    this.matDialogRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onClickBtn(false);
      });
  }

  private setTitles(): void {
    this.popupTitle = this.data.popupTitle;
    this.popupSubtitle = this.data.popupSubtitle;
    this.popupConfirm = this.data.popupConfirm;
    this.popupCancel = this.data.popupCancel;
  }

  public onClickBtn(reply: boolean): void {
    this.matDialogRef.close(reply);
  }
}
