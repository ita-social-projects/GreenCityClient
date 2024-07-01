import { Component, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { RateEcoEventsByIdAction } from 'src/app/store/actions/ecoEvents.actions';
import { Store } from '@ngrx/store';
import { ReplaySubject, Subscription, pipe, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-events-list-item-modal',
  templateUrl: 'events-list-item-modal.component.html',
  styleUrls: ['events-list-item-modal.component.scss']
})
export class EventsListItemModalComponent implements OnInit, OnDestroy {
  id: number;
  max: number;
  rate: number;
  isReadonly: boolean;
  isRegistered: boolean;
  isPosting: boolean;
  text: string;
  textByRate = '';
  elementName: string;
  isEventRaited = false;
  hover: boolean;

  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  langChangeSub: Subscription;

  constructor(
    private store: Store,
    private localStorageService: LocalStorageService,
    public bsModalRef: BsModalRef,
    private translate: TranslateService,
    private matSnackBar: MatSnackBarComponent,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.max = 3;
    window.onpopstate = () => {
      this.bsModalRef.hide();
    };
  }

  starsHandler(index: number, value: number): void {
    this.isEventRaited = index > value;
  }

  modalBtn(): void {
    if (!this.isRegistered) {
      this.bsModalRef.hide();
      this.openAuthModalWindow('sign-in');
    } else {
      this.matSnackBar.openSnackBar('ratedEvent');
      this.onRateChange();
    }
  }

  openAuthModalWindow(page: string): void {
    this.elementName = page;
    this.dialog
      .open(AuthModalComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        panelClass: ['custom-dialog-container'],
        data: { popUpName: page }
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe();
  }

  hoveringOver(event: any, rated = false): void {
    //$Event number
    this.textByRate = rated ? this.text : this.textByRate;
    this.text = [1, 2, 3].includes(event) ? `event.text-${event}` : '';
    this.hover = [1, 2, 3].includes(event);
  }

  onRateChange(): void {
    this.text = `event.text-finish`;
    this.bsModalRef.hide();
    this.store.dispatch(RateEcoEventsByIdAction({ id: this.id, grade: this.rate }));
  }

  bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }

  subscribeToLangChange(): void {
    this.langChangeSub = this.localStorageService.languageSubject.subscribe(this.bindLang.bind(this));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.langChangeSub.unsubscribe();
  }
}
