import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
  public mockedUserInfo = {
    profilePicturePath: './assets/img/profileAvatar.png',
    city: '',
    status: 'online',
    rating: 0,
    userCredo: ''
  };
  public editIcon = './assets/img/profile/icons/edit-line.svg';
  public userId: number;
  private userId$: Subscription;

  @Input() public userInfo;
  public isUserOnline;

  constructor( private localStorageService: LocalStorageService ) { }

  ngOnInit() {
    this.userId$ = this.localStorageService.userIdBehaviourSubject
      .subscribe(userId => this.userId = userId );
  }

  ngOnDestroy() {
    this.userId$.unsubscribe();
  }
}

