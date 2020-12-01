import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-friends-list',
  templateUrl: './add-friends-list.component.html',
  styleUrls: ['./add-friends-list.component.scss']
})
export class AddFriendsListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public addFriend(){
    console.log("work");
  }
}
