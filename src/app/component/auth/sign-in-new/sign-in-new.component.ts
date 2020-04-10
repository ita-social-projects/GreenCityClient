import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angularx-social-login';
import { GoogleSignInService } from '../../../service/auth/google-sign-in.service';
import { UserSuccessSignIn } from '../../../model/user-success-sign-in';
import { HttpErrorResponse } from '@angular/common/http';
import { UserOwnSignInService } from '../../../service/auth/user-own-sign-in.service';
import { Router } from '@angular/router';
import { SignInIcons } from 'src/assets/img/icon/sign-in/sign-in-icons';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RestorePasswordComponent } from '../restore-password/restore-password.component';

@Component({
  selector: 'app-sign-in-new',
  templateUrl: './sign-in-new.component.html',
  styleUrls: ['./sign-in-new.component.scss']
})
export class SignInNewComponent implements OnInit {
  private closeBtn = SignInIcons;
  private mainSignInImage = SignInIcons;
  private googleImage = SignInIcons;
  private hideShowPasswordImage = SignInIcons;

  constructor(
    private matDialogRef: MatDialogRef<SignInNewComponent>,
    private userOwnSignInService: UserOwnSignInService,
    private router: Router,
    private authService: AuthService,
    private googleService: GoogleSignInService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {}

  private closeSignInWindow(): void {
    this.matDialogRef.close();
  }

  private onOpenForgotWindow(): void {
    this.dialog.open(RestorePasswordComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: 'custom-dialog-container',
    });
    this.matDialogRef.close();
  }

  private showHidePassword(input: HTMLInputElement, src: HTMLImageElement): void {
    input.type = input.type === 'password' ? 'text' : 'password';
    src.src = input.type === 'password' ? this.hideShowPasswordImage.hidePassword : this.hideShowPasswordImage.showPassword;
  }
}
