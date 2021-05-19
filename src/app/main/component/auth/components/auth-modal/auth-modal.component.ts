import { authImages } from './../../../../image-pathes/auth-images';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent implements OnInit {
  public authImages = authImages;
  public authPage: string;

  constructor(
    private announcer: LiveAnnouncer,
    public matDialogRef: MatDialogRef<AuthModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.setAuthPage();
    this.announce();
  }

  public announce() {
    this.announcer.announce('Welcome to login page', 'assertive');
  }

  public changeAuthPage(page: string): void {
    this.authPage = page;
  }

  public closeWindow(): void {
    this.matDialogRef.close();
  }

  private setAuthPage(): void {
    this.authPage = this.data.popUpName;
  }
}
