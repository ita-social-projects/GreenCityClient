import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {GoogleSignInService} from '../../../service/auth/google-sign-in.service';
import {AuthService} from 'angularx-social-login';
import {Router} from '@angular/router';
import {UserOwnSignInService} from '../../../service/auth/user-own-sign-in.service';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {

  constructor(
    private matDialogRef: MatDialogRef<RestorePasswordComponent>,
    private userOwnSignInService: UserOwnSignInService,
    private router: Router,
    private authService: AuthService,
    private googleService: GoogleSignInService
  ) { }

  ngOnInit() {
  }
  private CloseRestoreWindow(): void {
    this.matDialogRef.close();
  }

}
