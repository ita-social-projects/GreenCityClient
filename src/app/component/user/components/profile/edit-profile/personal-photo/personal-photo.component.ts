import { Component, OnInit } from '@angular/core';
import { Profile } from '@user-models/profile.model';
import { ProfileService } from '../../profile-service/profile.service';

@Component({
  selector: 'app-personal-photo',
  templateUrl: './personal-photo.component.html',
  styleUrls: ['./personal-photo.component.scss']
})
export class PersonalPhotoComponent implements OnInit {
  public avatarDefault = './assets/img/profileAvatarBig.png';
  public editIcon = './assets/img/profile/icons/edit-photo.svg';
  private avatarImg: string;
  public showDragAndDrop = false;

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
  }
  public showUserInfo(): void {
    this.profileService.getUserInfo().subscribe((item: Profile) => this.avatarImg = item.profilePicturePath);
  }

  public checkAvatarImage(): string {
    this.showUserInfo();
    return this.avatarImg = (this.avatarImg && this.avatarImg !== ' ') ?
      this.avatarImg : this.avatarDefault;
  }

  private setCurrentPage(): void {
    sessionStorage.setItem('currentPage', JSON.stringify('eco news'));
  }

  public changeDragAndDrop(): void {
    this.showDragAndDrop = !this.showDragAndDrop;
  }
}
