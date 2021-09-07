import { authImages, ubsAuthImages } from './../../../../image-pathes/auth-images';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit {
  public authImages: { mainImage: string; openEye: string; cross: string; hiddenEye: string; google: string };
  public authPage: string;

  constructor(
    private localStorageService: LocalStorageService,
    private announcer: LiveAnnouncer,
    public matDialogRef: MatDialogRef<AuthModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.setAuthImage();
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

  private setAuthImage(): void {
    if (this.localStorageService.getUbsRegistration() === 'false') {
      this.authImages = authImages;
    } else {
      this.authImages = ubsAuthImages;
    }
  }
}
