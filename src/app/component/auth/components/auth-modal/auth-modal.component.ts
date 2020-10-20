import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { authImages } from 'src/app/image-pathes/auth-images';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit {
  public authImages = authImages;
  public authPage: string;

  constructor(private matDialogRef: MatDialogRef<AuthModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data ) { }

  ngOnInit(): void {
    this.setAuthPage();
  }

  public setAuthPage(): void {
    this.authPage = this.data.popUpName;
  }

  public changeAuthPage(page: string): void {
    this.authPage = page;
  }

  public closeWindow(): void {
    this.matDialogRef.close();
  }
}
