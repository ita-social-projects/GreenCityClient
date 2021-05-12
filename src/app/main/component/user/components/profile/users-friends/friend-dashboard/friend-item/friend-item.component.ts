import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FriendModel } from 'src/app/main/component/user/models/friend.model';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss'],
})
export class FriendItemComponent {
  @Input() friend: FriendModel;
  @Input() btnName: string;
  @Output() friendEventEmit = new EventEmitter<number>();

  public friendEvent(id: number): void {
    this.friendEventEmit.emit(id);
  }
}
