import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss']
})
export class AddFriendComponent implements OnInit {

  @Input() imgPath;
  @Output()addNewFriend = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public addFriend(): void {
    this.addNewFriend.emit();
  }

}
