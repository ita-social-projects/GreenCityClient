import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EditPhotoPopUpComponent } from '@shared/components/edit-photo-pop-up/edit-photo-pop-up.component';
import { ProfileService } from '../../profile-service/profile.service';

@Component({
  selector: 'app-personal-photo',
  templateUrl: './personal-photo.component.html',
  styleUrls: ['./personal-photo.component.scss']
})
export class PersonalPhotoComponent implements OnInit, OnDestroy {
  avatarImg: string;
  avatarSubscription: Subscription;
  currentPage = 'edit photo';
  editIcon = './assets/img/profile/icons/edit-photo.svg';
  userName: string;
  @ViewChild('editImage') previousActiveElement: ElementRef;
  constructor(
    private profileService: ProfileService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.setUserAvatar();
  }

  private setUserAvatar(): void {
    this.avatarSubscription = this.profileService.getUserInfo().subscribe((el) => {
      this.avatarImg = el.profilePicturePath;
      this.userName = el.name;
    });
  }

  openEditPhoto(): void {
    const dialogRef = this.dialog.open(EditPhotoPopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: {
        firstName: this.userName,
        img: this.avatarImg
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.setUserAvatar();
      this.previousActiveElement.nativeElement.focus();
    });
  }

  ngOnDestroy() {
    this.avatarSubscription.unsubscribe();
  }
}
