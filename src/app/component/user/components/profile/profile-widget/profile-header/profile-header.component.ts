import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent implements OnInit {
  public userInfo = {
    id: 0,
    avatarUrl: './assets/img/profileAvatar.png',
    name: {
      first: 'Brandier',
      last: 'Webb',
    },
    location: 'Lviv, Ukraine',
    status: 'online',
    rate: 658,
    userCredo:
      'My Credo is to make small steps that leads to huge impact. Let’s change the world together.',
  };
  public editIcon = './assets/img/profile/icons/edit-line.svg';
  public userId: number;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.initUser();
  }

  private initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .subscribe(userId => this.assignData(userId));
  }

  private assignData(userId: number): void {
    this.userId = userId;
  }
}
