import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  title = 'confirmation-dialog.title';
  text = 'confirmation-dialog.text';
  confirm = 'confirmation-dialog.buttons.confirm';
  cancel = 'confirmation-dialog.buttons.cancel';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; text?: string; confirm?: string; cancel?: string },
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {
    this.title = data?.title ?? this.title;
    this.text = data?.text;
    this.confirm = data?.confirm ?? this.confirm;
    this.cancel = data?.cancel ?? this.cancel;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.dialogRef.close(true);
  }
}
