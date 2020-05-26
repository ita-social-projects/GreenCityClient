import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-profile-header",
  templateUrl: "./profile-header.component.html",
  styleUrls: ["./profile-header.component.scss"],
})
export class ProfileHeaderComponent implements OnInit {
  public userInfo = {
    id: 0,
    avatarUrl: "../../../../../../assets/img/profileAvatar.png",
    name: {
      first: "Brandier",
      last: "Webb",
    },
    location: "Lviv, Ukraine",
    status: "online",
    rate: 658,
    userCredo:
      "My Credo is to make small steps that leads to huge impact. Let’s change the world together.",
  };
  
  constructor() {}

  ngOnInit() {}
}
