import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal-photo',
  templateUrl: './personal-photo.component.html',
  styleUrls: ['./personal-photo.component.scss']
})
export class PersonalPhotoComponent implements OnInit {
  public userInfo = {
    avatarUrl: './assets/img/profileAvatarBig.png'
  };
  public editIcon = './assets/img/profile/icons/edit-photo.svg';

  constructor() { }

  ngOnInit() {
  }
}
