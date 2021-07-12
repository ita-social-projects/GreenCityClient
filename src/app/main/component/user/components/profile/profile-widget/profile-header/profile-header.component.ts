import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EditProfileModel } from '@user-models/edit-profile.model';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
  public mockedUserInfo = {
    city: '',
    status: 'online',
    rating: 0,
    userCredo: 'User credo'
  };
  socialNetworksList = ['facebook', 'instagram', 'linked', 'twitter', 'green-city'];
  userSocialNetworks: Array<any>;
  public userId: number;
  private userId$: Subscription;

  @Input() public userInfo: EditProfileModel;
  public isUserOnline;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.userId$ = this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.userId = userId));
    this.buildSocialNetworksChart();
  }

  get checkUserCredo(): number {
    if (this.userInfo && this.userInfo.userCredo) {
      return this.userInfo.userCredo.length;
    }
    return 0;
  }

  private findNetwork(networkLink) {
    return this.socialNetworksList.reduce((result, current) => {
      if (networkLink.includes(current)) {
        result = current;
      }
      return result;
    }, 'green-city');
  }

  private buildSocialNetworksChart() {
    this.userSocialNetworks = this.userInfo.socialNetworks.map((item) => {
      return {
        link: item.url,
        name: this.findNetwork(item.url)
      };
    });
  }

  ngOnDestroy() {
    this.userId$.unsubscribe();
  }
}
