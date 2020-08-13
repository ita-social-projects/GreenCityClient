import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-privacy',
  templateUrl: './profile-privacy.component.html',
  styleUrls: ['./profile-privacy.component.scss']
})
export class ProfilePrivacyComponent implements OnInit {
  public privacyList = [
    {
      id: 1,
      text: 'Show my location',
      done: true
    },
    {
      id: 2,
      text: 'Show my eco places',
      done: false
    },
    {
      id: 3,
      text: 'Show my shopping list',
      done: false
    }
  ];

  constructor() {}

  ngOnInit() {}
}
