import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditProfileModel } from '@user-models/edit-profile.model';
import { ProfileService } from '../../profile-service/profile.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditPhotoPopUpComponent } from '@shared/components/edit-photo-pop-up/edit-photo-pop-up.component';


@Component({
  selector: 'app-personal-photo',
  templateUrl: './personal-photo.component.html',
  styleUrls: ['./personal-photo.component.scss']
})
export class PersonalPhotoComponent implements OnInit, OnDestroy {
  public avatarImg: string;
  public avatarDefault = './assets/img/profileAvatarBig.png';
  public editIcon = './assets/img/profile/icons/edit-photo.svg';
  public currentPage = 'edit photo';
  public avatarSubscription: Subscription;

  constructor(private profileService: ProfileService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.setUserAvatar();
  }

  private setUserAvatar(): void {
    this.avatarSubscription = this.profileService.getUserInfo().subscribe((item: EditProfileModel) => {
      this.avatarImg = item.profilePicturePath && item.profilePicturePath !== ' ' ?
        item.profilePicturePath : this.avatarDefault;
    });
  }

  public openEditPhoto(): void {
    this.dialog.open(EditPhotoPopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        img: this.avatarImg
      }
    });
  }

  ngOnDestroy() {
    this.avatarSubscription.unsubscribe();
  }
}
