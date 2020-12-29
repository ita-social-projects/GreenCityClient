import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FriendModel } from '@global-user/models/friend.model';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
})
export class FriendItemComponent implements OnInit {

  @Input() friend: FriendModel;
  @Output() addFriendEvent = new EventEmitter<number>();
  @Output() deleteFriendEvent = new EventEmitter<number>();z

  constructor() { }

  ngOnInit() {
  }

  public addFriend(id: number): void {
    this.addFriendEvent.emit(id);
  }

  public deleteFriend(id: number): void {
    this.deleteFriendEvent.emit(id);
  }
}
