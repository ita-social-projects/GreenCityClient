import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-warning-pop-up',
  templateUrl: './warning-pop-up.component.html',
  styleUrls: ['./warning-pop-up.component.scss']
})
export class WarningPopUpComponent implements OnInit {

  public popupTitle: string;
  public popupSubtitle: string;
  public popupConfirm: string;
  public popupCancel: string;

  constructor(private matDialogRef: MatDialogRef<WarningPopUpComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.setTitles();
    this.matDialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.userReply(false);
      }
      if (event.key === 'Enter') {
        this.userReply(true);
      }
    });
    this.matDialogRef.backdropClick().subscribe(() => this.userReply(false));
  }

  private setTitles(): void {
    this.popupTitle = this.data.popupTitle;
    this.popupSubtitle = this.data.popupSubtitle;
    this.popupConfirm = this.data.popupConfirm;
    this.popupCancel = this.data.popupCancel;
  }

  public userReply(reply: boolean): void {
    this.matDialogRef.close(reply);
  }
}
