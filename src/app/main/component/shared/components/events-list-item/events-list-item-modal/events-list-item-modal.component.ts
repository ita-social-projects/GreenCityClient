import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'events-list-item-modal',
  templateUrl: 'events-list-item-modal.component.html',
  styleUrls: ['events-list-item-modal.component.scss']
})
export class EventsListItemModalComponent {

  public max: number;
  public rate: number;
  public isReadonly: boolean;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {

  }
}