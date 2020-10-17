import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { authImages } from 'src/app/image-pathes/auth-images';
import { AuthModalServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  public authImages = authImages;
  public authPage: string;
  public authPageSubscript: Subscription;

  constructor(private matDialogRef: MatDialogRef<AuthModalComponent>,
              private authModalService: AuthModalServiceService ) { }

  ngOnInit(): void {
    this.setAuthPage();
  }

  ngOnDestroy(): void {
    this.authPageSubscript.unsubscribe();
  }

  public setAuthPage(): void {
    this.authPageSubscript = this.authModalService.authPopUpSubj.subscribe((pageName: string) => this.authPage = pageName);
  }

  public closeWindow(): void {
    this.matDialogRef.close();
  }
}
