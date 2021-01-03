import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FriendModel } from '@global-user/models/friend.model';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
})
export class FriendItemComponent implements OnInit {

  @Input() friend: FriendModel;
  @Input() btnName: string;
  @Output() friendEventEmit = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  public friendEvent(id: number): void {
    this.friendEventEmit.emit(id);
  }
}
