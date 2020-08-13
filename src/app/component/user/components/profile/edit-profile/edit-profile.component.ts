import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  public userInfo = {
    id: 0,
    avatarUrl: './assets/img/profileAvatarBig.png',
    name: {
      first: 'Brandier',
      last: 'Webb',
    },
    location: 'Lviv',
    status: 'online',
    rate: 658,
    userCredo:
      'My Credo is to make small steps that leads to huge impact. Let’s change the world together.',
  };

  constructor() {}

  ngOnInit() {}
}
