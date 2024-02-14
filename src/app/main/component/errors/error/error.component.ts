import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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
