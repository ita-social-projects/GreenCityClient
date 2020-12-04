import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
@Component({
  selector: 'app-add-friends-list',
  templateUrl: './add-friends-list.component.html',
  styleUrls: ['./add-friends-list.component.scss']
})
export class AddFriendsListComponent implements OnInit {

  private items: FriendModel[];
  public userId: number;
  public error: any;


  constructor(private userFriendsService: UserFriendsService,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.initUser();
    this.userFriendsService.getRecommendedFriends(this.userId).subscribe(data => this.items=data,
      error => {this.error = error.message; console.log(error);});
    console.log(this.items);
  }

  public addFriend(id: number) {
    console.log(id);
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .subscribe((userId: number) => this.userId = userId);
  }
}
