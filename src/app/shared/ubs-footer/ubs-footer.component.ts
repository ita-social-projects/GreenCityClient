import { Component, OnInit } from '@angular/core';
import { ubsHeaderIcons } from '../../main/image-pathes/header-icons';

@Component({
  selector: 'app-ubs-footer',
  templateUrl: './ubs-footer.component.html',
  styleUrls: ['./ubs-footer.component.scss']
})
export class UbsFooterComponent {
  public footerPicture = ubsHeaderIcons;
  public screenWidth = window.innerWidth;
  public currentYear = new Date().getFullYear();

  public ubsNavLinks = [
    { name: 'user.lower-nav-bar.about-us', route: '/ubs', url: false },
    { name: 'user.lower-nav-bar.sorting-rules', route: 'https://nowaste.com.ua/yak-sortyvaty-na-karantuni/', url: true },
    { name: 'user.lower-nav-bar.eco-shop', route: 'https://shop.nowaste.com.ua/', url: true },
    { name: 'Green City', route: '/', url: false }
  ];

  onResize() {
    this.screenWidth = window.innerWidth;
  }
}
