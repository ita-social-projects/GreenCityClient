import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent implements OnInit {
  public mockedUserInfo = {
    profilePicturePath: './assets/img/profileAvatar.png',
    status: 'online',
    rating: 0,
    userCredo: ''
  };

  public userInfo: object;
  public isUserOnline: object;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.showUserInfo();
    this.checkUserStatus();
  }

  public showUserInfo(): void {
    this.profileService.getUserInfo().subscribe(item => this.userInfo = item);
  }

  public checkUserStatus(): void {
    this.profileService.getUserStatus().subscribe(item => {
      this.isUserOnline = item;
      this.mockedUserInfo.status = this.isUserOnline ? 'online' : 'offline';
    });
  }
}
