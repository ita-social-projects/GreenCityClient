import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  public closeDiaglog = './assets/img/icon/close.png';

  constructor(private matDialogRef: MatDialogRef<ErrorComponent>) {}

  public closePopup(): void {
    this.matDialogRef.close();
  }
}
