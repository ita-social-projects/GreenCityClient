import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { EditProfileModel, UserLocationDto } from '@user-models/edit-profile.model';
import { ProfileStatistics } from '@global-user/models/profile-statistiscs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ProfileService } from '../../profile-service/profile.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { UserOnlineStatusService } from '@global-user/services/user-online-status.service';
import { UsersCategOnlineStatus } from '@global-user/models/friend.model';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject();
  public mockedUserInfo = {
    city: '',
    status: 'online',
    rating: 0,
    userCredo: 'User credo'
  };
  socialNetworksList = ['facebook', 'instagram', 'linked', 'twitter', 'green-city', 'x'];
  userSocialNetworks: Array<any>;
  public userId: number;
  public icons: Record<string, string> = {};
  private userId$: Subscription;

  @Input() public progress: ProfileStatistics;
  @Input() public userInfo: EditProfileModel;
  public isUserOnline: boolean;
  public showEditButton: boolean;

  constructor(
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private langService: LanguageService,
    private userOnlineStatusService: UserOnlineStatusService
  ) {}

  ngOnInit() {
    this.userId$ = this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((userId) => {
      this.userId = userId;
    });
    this.buildSocialNetworksChart();
    this.showEditButton = this.route.snapshot.params.userName === this.userInfo.name;
    this.icons = this.profileService.icons;
    if (this.route.snapshot.params.userId) {
      this.userOnlineStatusService.addUsersId(UsersCategOnlineStatus.profile, [+this.route.snapshot.params.userId]);
      this.userOnlineStatusService.usersOnlineStatus$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
        console.log(res);
        //handle isonline status
      });
    } else {
      this.isUserOnline = true;
    }
  }

  get checkUserCredo(): number {
    if (this.userInfo?.userCredo) {
      return this.userInfo.userCredo.length;
    }
    return 0;
  }

  public getSocialImage(socialNetwork: string): string {
    return this.profileService.getSocialImage(socialNetwork);
  }

  public getUserCity(locationDto: UserLocationDto): string {
    if (locationDto) {
      const city = this.langService.getLangValue(locationDto?.cityUa, locationDto?.cityEn) as string;
      const country = this.langService.getLangValue(locationDto?.countryUa, locationDto?.countryEn) as string;
      return locationDto.cityUa && locationDto.cityEn ? `${city}, ${country}` : '';
    }
    return '';
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
    this.userOnlineStatusService.removeUsersId(UsersCategOnlineStatus.profile);
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
