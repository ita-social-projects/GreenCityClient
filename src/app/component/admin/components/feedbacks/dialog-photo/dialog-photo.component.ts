import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ModalService } from '../../../../core/components/propose-cafe/_modal/modal.service';

@Component({
  selector: 'app-dialog-photo',
  templateUrl: './dialog-photo.component.html',
  styleUrls: ['./dialog-photo.component.scss']
})
export class DialogPhotoComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data, private dialogRef: MatDialogRef<DialogPhotoComponent>,
              private modalService: ModalService) {
  }

}
