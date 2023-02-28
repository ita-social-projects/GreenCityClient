import { Component, Injector, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-event-list-item-success',
  templateUrl: 'events-list-item-success.html',
  styleUrls: ['events-list-item-success.scss']
})
export class EventListItemSuccessComponent {
  public id: number;
  public isRegistered: boolean;
  public isReadonly: boolean;

  constructor(public bsModalRef: BsModalRef) {}
}
