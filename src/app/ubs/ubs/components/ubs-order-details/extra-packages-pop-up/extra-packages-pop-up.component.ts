import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-extra-packages-pop-up',
  templateUrl: './extra-packages-pop-up.component.html',
  styleUrls: ['./extra-packages-pop-up.component.scss']
})
export class ExtraPackagesPopUpComponent {
  constructor(public dialogRef: MatDialogRef<ExtraPackagesPopUpComponent>) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
