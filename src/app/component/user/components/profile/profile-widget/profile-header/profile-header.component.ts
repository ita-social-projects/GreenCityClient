import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent implements OnInit {
  public oldUserInfo = {
    status: 'online',
    rate: 658,
  };

  public userInfo: object;
  public isUserOnline: object;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.showUserInfo();
    this.checkUserStatus();
  }

  public showUserInfo(): void {
    this.profileService.getUserInfo().subscribe(item => {
      this.userInfo = item;
    });
  }

  public checkUserStatus(): void {
    this.profileService.getUserStatus().subscribe(item => {
      this.isUserOnline = item;
      this.oldUserInfo.status = this.isUserOnline ? 'online' : 'offline';
    });
  }
}
