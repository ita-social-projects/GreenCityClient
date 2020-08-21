import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { ProfileService } from '../../profile-service/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-personal-photo',
  templateUrl: './personal-photo.component.html',
  styleUrls: ['./personal-photo.component.scss']
})
export class PersonalPhotoComponent implements OnInit, OnDestroy {
  public avatarImg: string;
  public avatarDefault = './assets/img/profileAvatarBig.png';
  public editIcon = './assets/img/profile/icons/edit-photo.svg';
  public showDragAndDrop = false;
  public currentPage = 'edit photo';
  public avatarSubscription: Subscription;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.setUserAvatar();
  }

  private setUserAvatar(): void {
    this.avatarSubscription = this.profileService.getUserInfo().subscribe((item: EditProfileModel) => {
      this.avatarImg = item.profilePicturePath && item.profilePicturePath !== ' ' ?
        item.profilePicturePath : this.avatarDefault;
    });
  }

  public changeDragAndDrop(): void {
    this.showDragAndDrop = !this.showDragAndDrop;
  }

  ngOnDestroy() {
    this.avatarSubscription.unsubscribe();
  }
}
