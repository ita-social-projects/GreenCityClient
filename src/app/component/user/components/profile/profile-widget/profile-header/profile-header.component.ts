import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

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
  public editIcon = './assets/img/profile/icons/edit-line.svg';
  public userId: number;

  public userInfo;
  public isUserOnline;

  constructor(private profileService: ProfileService,
              private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.showUserInfo();
    this.checkUserStatus();
    this.initUser();
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

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .subscribe(userId => this.assignData(userId));
  }

  private assignData(userId: number): void {
    this.userId = userId;
  }
}

