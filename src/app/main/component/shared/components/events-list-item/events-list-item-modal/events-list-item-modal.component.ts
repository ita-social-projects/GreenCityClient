import { take } from 'rxjs/operators';
import { Component, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { RateEcoEventsByIdAction } from 'src/app/store/actions/ecoEvents.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'events-list-item-modal',
  templateUrl: 'events-list-item-modal.component.html',
  styleUrls: ['events-list-item-modal.component.scss']
})
export class EventsListItemModalComponent {
  public id: any;
  public service: any;
  public max: number;
  public rate: number;
  public isReadonly: boolean;
  public switcher: boolean;

  public isPosting: boolean;
  public text: string;

  public elementName: string;
  public dialog: MatDialog;
  constructor(public bsModalRef: BsModalRef, private injector: Injector, private eventService: EventsService, private store: Store) {
    this.dialog = injector.get(MatDialog);
  }

  ngOnInit() {}

  modalBtn() {
    if (!this.switcher) {
      this.bsModalRef.hide();
      setTimeout(() => {
        this.openAuthModalWindow('sign-up');
      }, 500);
    } else {
      console.log('rate it');
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

  public hoveringOver(event: any): void {
    switch (event) {
      case 1:
        this.text = `Could be better`;
        break;
      case 2:
        this.text = `Nice and sound`;
        break;
      case 3:
        this.text = `Good job!`;
        break;
      default:
        this.text;
    }
  }

  public onRateChange(): void {
    this.text = `Thank you !!!`;
    this.bsModalRef.hide();
    this.store.dispatch(RateEcoEventsByIdAction({ id: this.id, grade: this.rate }));

  }
}
