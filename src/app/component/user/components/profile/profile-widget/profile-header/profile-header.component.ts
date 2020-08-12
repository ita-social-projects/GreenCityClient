import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent implements OnInit {
  public mockedUserInfo = {
    profilePicturePath: './assets/img/profileAvatar.png',
    city: '',
    status: 'online',
    rating: 0,
    userCredo: ''
  };

  public userInfo;
  public isUserOnline;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.showUserInfo();
    this.checkUserStatus();
  }

  public showUserInfo(): void {
    this.profileService.getUserInfo().subscribe(item => this.userInfo = item);
  }

  public showCorrectImage(): string {
    return this.userInfo.profilePicturePath ?
      this.userInfo.profilePicturePath : this.mockedUserInfo.profilePicturePath;
  }

  public checkUserStatus(): void {
    this.profileService.getUserStatus().subscribe(item => {
      this.isUserOnline = item;
      this.mockedUserInfo.status = this.isUserOnline ? 'online' : 'offline';
    });
  }
}
