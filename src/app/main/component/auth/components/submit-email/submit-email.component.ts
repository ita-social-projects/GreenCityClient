import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-submit-email',
  templateUrl: './submit-email.component.html',
  styleUrls: ['./submit-email.component.scss']
})
export class SubmitEmailComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<SubmitEmailComponent>) {}

  ngOnInit() {
    setTimeout(() => {
      this.dialogRef.close();
    }, 15000);
  }
}
