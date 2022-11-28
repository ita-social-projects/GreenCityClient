import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  title = 'confirmation-dialog.title';
  text = 'confirmation-dialog.text';
  confirm = 'confirmation-dialog.buttons.confirm';
  cancel = 'confirmation-dialog.buttons.cancel';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; text?: string; confirm?: string; cancel?: string },
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {
    this.title = data?.title ?? this.title;
    this.text = data?.text ?? this.text;
    this.confirm = data?.confirm ?? this.confirm;
    this.cancel = data?.cancel ?? this.cancel;
  }

  ngOnInit(): void {
    // This is intentional
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.dialogRef.close(true);
  }
}
