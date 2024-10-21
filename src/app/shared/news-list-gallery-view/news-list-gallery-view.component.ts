import { userAssignedCardsIcons } from '../../main/image-pathes/profile-icons';
import { Component, Input, ChangeDetectionStrategy, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { DatePipe } from '@angular/common';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-news-list-gallery-view',
  templateUrl: './news-list-gallery-view.component.html',
  styleUrls: ['./news-list-gallery-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsListGalleryViewComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() ecoNewsModel: EcoNewsModel;
  @Input() ecoNewsText;
  @Input() userId: number;
  @ViewChild('ecoNewsText', { static: true }) text;

  profileIcons = userAssignedCardsIcons;
  newsImage: string;
  likeImg = 'assets/events-icons/like.png';
  commentImg = 'assets/events-icons/frame.png';
  tags: Array<string>;
  currentLang: string;
  private destroy: Subject<boolean> = new Subject<boolean>();
  isRegistered: boolean;
  newDate;
  datePipe;
  private dialogRef: MatDialogRef<unknown>;
  isFavorite: boolean;
  // private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  constructor(
    public translate: TranslateService,
    private localStorageService: LocalStorageService,
    private langService: LanguageService,
    private dialog: MatDialog,
    private ecoNewsService: EcoNewsService,
    private userOwnAuthService: UserOwnAuthService,
    private snackBar: MatSnackBarComponent
  ) {}
  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.tags = this.langService.getLangValue(this.ecoNewsModel.tagsUa, this.ecoNewsModel.tagsEn);
      this.datePipe = new DatePipe(this.currentLang);
      this.newDate = this.datePipe.transform(this.ecoNewsModel.creationDate, 'MMM dd, yyyy');
    });

    this.isRegistered = !!this.userId;
    this.isFavorite = this.ecoNewsModel.isFavourite;
  }

  changeFavouriteStatus(event?: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();

    if (!this.isRegistered) {
      this.openAuthModalWindow('sign-in');
      this.dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((result) => {
          this.isRegistered = !!result;
          if (this.isRegistered) {
            this.changeFavouriteStatus();
          }
        });
    } else {
      this.isFavorite = !this.isFavorite;
      if (this.isFavorite) {
        this.ecoNewsService
          .addNewsToFavourites(this.ecoNewsModel.id)
          .pipe(takeUntil(this.destroy))
          .subscribe({
            error: () => {
              this.snackBar.openSnackBar('error');
              this.isFavorite = false;
            }
          });
      } else {
        this.ecoNewsService
          .removeNewsFromFavourites(this.ecoNewsModel.id)
          .pipe(takeUntil(this.destroy))
          .subscribe({
            next: () => {
              // if (this.isUserAssignList) {
              //   this.idOfUnFavouriteEvent.emit(this.ecoNewsModel.id);
              // }
            },
            error: () => {
              this.snackBar.openSnackBar('error');
              this.isFavorite = true;
            }
          });
      }
    }
  }

  openAuthModalWindow(page: string): void {
    this.dialogRef = this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: page
      }
    });
  }

  checkNewsImage(): string {
    this.newsImage =
      this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' '
        ? this.ecoNewsModel.imagePath
        : this.profileIcons.newsDefaultPictureList;
    return this.newsImage;
  }

  ngAfterViewInit() {
    this.text.nativeElement.innerHTML = this.ecoNewsModel.content;
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
