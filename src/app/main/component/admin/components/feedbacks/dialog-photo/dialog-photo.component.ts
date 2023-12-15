import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ModalService } from '../../../../core/components/propose-cafe/_modal/modal.service';

@Component({
  selector: 'app-dialog-photo',
  templateUrl: './dialog-photo.component.html',
  styleUrls: ['./dialog-photo.component.scss']
})
export class DialogPhotoComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<DialogPhotoComponent>,
    private modalService: ModalService
  ) {}
}
