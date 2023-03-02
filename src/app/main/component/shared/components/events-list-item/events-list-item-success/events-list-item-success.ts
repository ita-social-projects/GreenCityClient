import { Component, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-list-item-success',
  templateUrl: 'events-list-item-success.html',
  styleUrls: ['events-list-item-success.scss']
})
export class EventsListItemSuccessComponent {
  public id: number;
  public isRegistered: boolean;
  public elementName: string;
  public dialog: MatDialog;

  constructor(public bsModalRef: BsModalRef, public injector: Injector) {
    this.dialog = injector.get(MatDialog);
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
}
