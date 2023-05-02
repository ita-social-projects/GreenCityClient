import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { RateEcoEventsByIdAction } from 'src/app/store/actions/ecoEvents.actions';
import { Store } from '@ngrx/store';
import { ReplaySubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-events-list-item-modal',
  templateUrl: 'events-list-item-modal.component.html',
  styleUrls: ['events-list-item-modal.component.scss']
})
export class EventsListItemModalComponent implements OnInit, OnDestroy {
  public id: number;
  public max: number;
  public rate: number;
  public isReadonly: boolean;
  public isRegistered: boolean;
  public isPosting: boolean;
  public text: string;
  public textByRate: string;
  public elementName: string;
  public isEventRaited = false;
  public hover: boolean;

  private dialog: MatDialog;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public langChangeSub: Subscription;

  constructor(
    private store: Store,
    private localStorageService: LocalStorageService,
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private translate: TranslateService
  ) {
    this.dialog = injector.get(MatDialog);
  }

  ngOnInit() {
    this.subscribeToLangChange();
    this.bindLang(this.localStorageService.getCurrentLanguage());
  }

  public starsHandler(index: number, value: number): void {
    this.isEventRaited = index > value;
  }

  public modalBtn(): void {
    if (!this.isRegistered) {
      this.bsModalRef.hide();
      setTimeout(() => {
        this.openAuthModalWindow('sign-in');
      }, 500);
    } else {
      this.onRateChange();
    }
  }

  public openAuthModalWindow(page: string): void {
    this.elementName = page;
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: page
      }
    });
  }

  public hoveringOver(event: number, rated = false): void {
    this.text = [1, 2, 3].includes(event) ? `event.text-${event}` : ' ';
    this.hover = [1, 2, 3].includes(event) ? true : false;
    this.textByRate = rated ? this.text : ' ';
  }

  public onRateChange(): void {
    this.text = `event.text-finish`;
    this.bsModalRef.hide();
    this.store.dispatch(RateEcoEventsByIdAction({ id: this.id, grade: this.rate }));
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
