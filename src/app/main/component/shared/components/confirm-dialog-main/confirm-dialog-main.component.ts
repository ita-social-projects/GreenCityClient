import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-main',
  templateUrl: './confirm-dialog-main.component.html',
  styleUrls: ['./confirm-dialog-main.component.scss']
})
export class ConfirmDialogMainComponent implements OnInit {
  public title: string;
  public subtitle: string;
  public name: string;
  public confirm: string;
  public cancel: string;

  constructor(@Inject(MAT_DIALOG_DATA) public resData, public dialogRef: MatDialogRef<ConfirmDialogMainComponent>) {}

  ngOnInit(): void {
    this.title = this.resData.data.title;
    this.subtitle = this.resData.data.subtitle;
    this.name = this.resData.data.name;
    this.confirm = this.resData.data.confirm;
    this.cancel = this.resData.data.cancel;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.dialogRef.close(true);
  }
}
