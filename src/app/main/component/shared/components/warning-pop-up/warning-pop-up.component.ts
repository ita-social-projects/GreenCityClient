import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-warning-pop-up',
  templateUrl: './warning-pop-up.component.html',
  styleUrls: ['./warning-pop-up.component.scss', './warning-pop-up-ubs.component.scss']
})
export class WarningPopUpComponent implements OnInit, OnDestroy {
  public popupTitle: string;
  public popupSubtitle: string;
  public popupConfirm: string;
  public popupCancel: string;
  public isLoading = false;
  public isUBS: boolean;
  public isUbsOrderSubmit: boolean;
  public isHabit: boolean;
  public habitName: string;
  public habitId: number;
  public closeButton = './assets/img/profile/icons/cancel.svg';
  private $destroy: Subject<void> = new Subject<void>();

  constructor(
    private matDialogRef: MatDialogRef<WarningPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.setTitles();
    this.matDialogRef
      .keydownEvents()
      .pipe(takeUntil(this.$destroy))
      .subscribe((event) => {
        if (event.key === 'Escape') {
          this.userReply(false);
        }
        if (event.key === 'Enter') {
          this.userReply(true);
        }
      });
    this.matDialogRef
      .backdropClick()
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => this.userReply(false));
  }

  private setTitles(): void {
    this.popupTitle = this.data.popupTitle;
    this.popupSubtitle = this.data.popupSubtitle;
    this.popupConfirm = this.data.popupConfirm;
    this.popupCancel = this.data.popupCancel;
    this.isUBS = this.data.isUBS;
    this.isUbsOrderSubmit = this.data.isUbsOrderSubmit;
    this.isHabit = this.data.isHabit;
    if (this.isHabit) {
      this.habitName = this.data.habitName;
    }
  }

  public userReply(reply: boolean | null): void {
    if (reply) {
      localStorage.removeItem('newsTags');
    }

    this.matDialogRef.close(reply);
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
