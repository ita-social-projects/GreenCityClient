import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FriendModel } from '@global-user/models/friend.model';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent implements OnInit {

  @Input() friend: FriendModel;
  @Output() addFriendEvent = new EventEmitter<number>();
  @Output() deleteFriendEvent = new EventEmitter<number>();
  public btnDisplay = true;

  constructor() { }

  ngOnInit() {
  }

  public addFriend(id: number): void {

    this.addFriendEvent.emit(id);
    this.btnDisplay=false;
  }

  public deleteFriend (id: number): void {
    this.deleteFriendEvent.emit(id);
    this.btnDisplay=true;
  }

}
