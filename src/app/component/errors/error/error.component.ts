import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  public closeDiaglog = './assets/img/icon/close.png';

  constructor(private matDialogRef: MatDialogRef<ErrorComponent>) { }

  ngOnInit() {
  }

  public closePopup(): void {
    this.matDialogRef.close();
  }

}
