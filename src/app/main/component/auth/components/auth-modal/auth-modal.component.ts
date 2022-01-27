import { authImages, ubsAuthImages } from './../../../../image-pathes/auth-images';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PopupTitleData } from '../../models/authPop-upContent';
import { PopUpViewService } from '@auth-service/pop-up/pop-up-view.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  private destroySub: Subject<boolean> = new Subject<boolean>();
  public authImages: { mainImage: string; cross: string; hiddenEye: string; openEye: string; google: string };
  public authPage: string;
  public authImageValue: boolean;
  public modalTitle: PopupTitleData;

  constructor(
    private announcer: LiveAnnouncer,
    public matDialogRef: MatDialogRef<AuthModalComponent>,
    private localeStorageService: LocalStorageService,
    private popUpViewService: PopUpViewService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.localeStorageService.ubsRegBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((value) => (this.authImageValue = value));
    this.authImages = this.authImageValue ? ubsAuthImages : authImages;
    this.popUpViewService.regPopUpViewBehaviourSubject.pipe(takeUntil(this.destroySub)).subscribe((value) => {
      this.modalTitle = value;
    });
    this.setAuthPage();
    this.announce();
  }

  public announce() {
    this.announcer.announce('Welcome to login page', 'assertive');
  }

  public changeAuthPage(page: string): void {
    this.authPage = page;
    this.popUpViewService.setPopupViewValue(this.authPage);
  }

  public closeWindow(): void {
    this.popUpViewService.passwordValue = null;
    this.popUpViewService.repeatPasswordValue = null;
    this.matDialogRef.close();
  }

  private setAuthPage(): void {
    this.authPage = this.data.popUpName;
    this.popUpViewService.setPopupViewValue(this.authPage);
  }

  ngOnDestroy() {
    this.destroySub.next(true);
    this.destroySub.unsubscribe();
  }
}
