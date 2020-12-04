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

  constructor() { }

  ngOnInit() {
  }

  public addFriend(id: number): void {
    this.addFriendEvent.emit(id);
  }

}
