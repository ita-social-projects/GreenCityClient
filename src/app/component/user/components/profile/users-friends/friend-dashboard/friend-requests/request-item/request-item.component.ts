import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FriendModel } from '@global-user/models/friend.model';

@Component({
  selector: 'app-request-item',
  templateUrl: './request-item.component.html',
  styleUrls: ['./request-item.component.scss'],
})
export class RequestItemComponent {
  @Input() request: FriendModel;
  @Input() btnName: string;
  @Output() acceptEvent = new EventEmitter<number>();
  @Output() declineEvent = new EventEmitter<number>();

  public accept(id: number) {
    this.acceptEvent.emit(id);
  }

  public decline(id: number) {
    this.declineEvent.emit(id);
  }
}
