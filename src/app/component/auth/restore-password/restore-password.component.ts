import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {GoogleSignInService} from '../../../service/auth/google-sign-in.service';
import {AuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {UserOwnSignInService} from '../../../service/auth/user-own-sign-in.service';
import {SignInNewComponent} from '../sign-in-new/sign-in-new.component';
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
    private matDialogRef: MatDialogRef<RestorePasswordComponent, SignInNewComponent>,
    // private userOwnSignInService: UserOwnSignInService,
    // private router: Router,
    // private authService: AuthService,
    // private googleService: GoogleSignInService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }
  private CloseRestoreWindow(): void {
    this.dialog.closeAll();
  }

}
