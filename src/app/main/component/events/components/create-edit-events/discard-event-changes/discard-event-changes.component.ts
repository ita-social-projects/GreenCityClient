import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-discard-event-changes',
  templateUrl: 'discard-event-changes.component.html',
  styleUrls: ['discard-event-changes.component.scss']
})
export class DiscardEventChangesComponent {
  cancelChanges: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string, private dialogRef: MatDialogRef<DiscardEventChangesComponent>) {}

  public continueEditing(isCancel) {
    this.dialogRef.close({ data: { isCancel } });
  }
}
