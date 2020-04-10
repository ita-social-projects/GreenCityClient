import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SignInNewComponent } from '../sign-in-new/sign-in-new.component';
import { SignInIcons } from 'src/assets/img/icon/sign-in/sign-in-icons';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {
  private closeBtn = SignInIcons;
  private mainSignInImage = SignInIcons;
  private googleImage = SignInIcons;

  constructor(
    private matDialogRef: MatDialogRef<SignInNewComponent>,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
  }

  private onCloseRestoreWindow(): void {
    this.dialog.closeAll();
  }

  private onBackToSignIn(): void {
    this.dialog.open(SignInNewComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
    this.matDialogRef.close();
  }
}
