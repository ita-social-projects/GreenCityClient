import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../profile-service/profile.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditPhotoPopUpComponent } from '@shared/components/edit-photo-pop-up/edit-photo-pop-up.component';
import { map } from 'rxjs/operators';

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
    this.avatarSubscription = this.profileService.getUserInfo()
    .pipe(
      map((el) => el.profilePicturePath)
    )
    .subscribe((img) => {
      this.avatarImg = img && img !== ' ' ? img : this.avatarDefault;
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
