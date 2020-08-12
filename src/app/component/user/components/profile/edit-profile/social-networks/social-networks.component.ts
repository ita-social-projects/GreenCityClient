import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss']
})
export class SocialNetworksComponent implements OnInit {
  public icons = {
    edit: './assets/img/profile/icons/edit.svg',
    add: './assets/img/profile/icons/add.svg',
    delete: './assets/img/profile/icons/delete.svg'
  };
  public socialNetworks = [
    {
      icon: './assets/img/profile/icons/ic-faceb.svg',
      link: 'facebook.com/brandiewebb'
    },
    {
      icon: './assets/img/profile/icons/ic-instag.svg',
      link: 'instagram.com/brandiewebb'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
