import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { ProfileStatistics } from '@global-user/models/profile-statistiscs';
import { ActivatedRoute } from '@angular/router';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { take } from 'rxjs/operators';
import { ProfileService } from '../../profile-service/profile.service';

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
  public icons: Record<string, string> = {};
  private userId$: Subscription;

  @Input() public progress: ProfileStatistics;
  @Input() public userInfo: EditProfileModel;
  public isUserOnline: boolean;
  public showEditButton: boolean;

  public nameTransform: string;
  public locationTransform: string;

  constructor(
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private userFriendsService: UserFriendsService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.userId$ = this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.userId = userId));
    this.buildSocialNetworksChart();
    this.showEditButton = this.route.snapshot.params.userName === this.userInfo.name;
    this.icons = this.profileService.icons;
  }

  get checkUserCredo(): number {
    if (this.userInfo && this.userInfo.userCredo) {
      return this.userInfo.userCredo.length;
    }
    return 0;
  }

  public getSocialImage(socialNetwork: string): string {
    return this.profileService.getSocialImage(socialNetwork);
  }

  private findNetwork(networkLink) {
    return this.socialNetworksList.reduce((result, current) => {
      if (networkLink.includes(current)) {
        result = current;
      }
      return result;
    }, 'green-city');
  }

  private isOnline(id: number) {
    this.userFriendsService
      .isOnline(id)
      .pipe(take(1))
      .subscribe((status) => (this.isUserOnline = status));
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
