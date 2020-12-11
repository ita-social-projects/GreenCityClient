import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendModel, FriendRecommendedModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
@Component({
  selector: 'app-add-friends-list',
  templateUrl: './add-friends-list.component.html',
  styleUrls: ['./add-friends-list.component.scss']
})
export class AddFriendsListComponent implements OnInit {

  public recommendedFriends: FriendModel [];
  public sixFriends: FriendModel[];
  public userId: number;
  public error: any;

  constructor(private userFriendsService: UserFriendsService,
              private localStorageService: LocalStorageService,
              private router: Router) { }

  ngOnInit() {
    this.initUser();
    this.getRecommendedFriends();
  }

  public getRecommendedFriends () {
    this.userFriendsService.getRecommendedFriends(this.userId).subscribe(
      data => {this.recommendedFriends=data.page;},
      error => {this.error = error.message; console.log(error);
    });
  }

  public getFriends () {
    this.userFriendsService.getRecommendedFriends(this.userId).subscribe(
      data => {this.sixFriends=data.page;},
      error => {this.error = error.message; console.log(error);
    });
  }

  public deleteFriend(id: number) {
    this.userFriendsService.deleteFriends(this.userId, id).subscribe(data =>  console.log(data),
      error => {this.error = error.message; console.log(error); });
      this.router.navigate(['profile', this.userId]);
    console.log(id);
  }

  public addFriend(id: number) {
    this.userFriendsService.addFriend(this.userId, id).subscribe(
      () =>  {
        console.log(this.recommendedFriends.find(item => {item.id == id; console.log(id);}));
      },
      error => {this.error = error.message; console.log(error);
    });
    console.log(id);
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .subscribe((userId: number) => this.userId = userId);
  }
}
