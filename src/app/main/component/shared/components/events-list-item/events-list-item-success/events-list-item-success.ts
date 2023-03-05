import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subscription, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-event-list-item-success',
  templateUrl: 'events-list-item-success.html',
  styleUrls: ['events-list-item-success.scss']
})
export class EventsListItemSuccessComponent implements OnInit, OnDestroy {
  public id: number;
  public isRegistered: boolean;
  public dialog: MatDialog;
  public langChangeSub: Subscription;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    public bsModalRef: BsModalRef,
    public injector: Injector,
    private translate: TranslateService,
    private localStorageService: LocalStorageService
  ) {
    this.dialog = injector.get(MatDialog);
  }

  ngOnInit() {
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  public modalBtn(): void {
    if (!this.isRegistered) {
      this.bsModalRef.hide();
      setTimeout(() => {
        this.openAuthModalWindow('sign-in');
      }, 500);
    }
  }

  public openAuthModalWindow(page: string): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: page
      }
    });
  }

  public bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  public subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.langChangeSub.unsubscribe();
  }
}
