import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  constructor(private matDialogRef: MatDialogRef<DialogPopUpComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

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

  private setTitles(): void {
    this.popupTitle = this.data.popupTitle;
    this.popupSubtitle = this.data.popupSubtitle;
    this.popupConfirm = this.data.popupConfirm;
    this.popupCancel = this.data.popupCancel;
    this.setBtnStyleGreen = this.data.style === 'green';
    this.setBtnStyleRed = this.data.style === 'red';
  }

  public userReply(reply: boolean): void {
    this.matDialogRef.close(reply);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
