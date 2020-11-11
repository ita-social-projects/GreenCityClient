import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ERRORS_MeSSAGE_TOKEN} from '../../../constants/errors/error.constans';
import {ErrorMessageInterface} from '@global-models/errors/error-message.interface';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  public closeDiaglog = './assets/img/icon/close.png';
  public errorsMessage: string;

  constructor(private matDialogRef: MatDialogRef<ErrorComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              @Inject(ERRORS_MeSSAGE_TOKEN) public config: { [name: string]: ErrorMessageInterface}) { }

  ngOnInit() {
    this.errorsMessage = this.data.message ? this.data.message : this.config.error.message;
  }

  public closePopup(): void {
    this.matDialogRef.close();
  }

}
