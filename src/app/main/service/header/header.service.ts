import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  public selectedIndex = null;

  public ubsNavLinks = [
    { name: 'user.lower-nav-bar.about-us', route: '/ubs', url: false },
    { name: 'user.lower-nav-bar.sorting-rules', route: 'https://nowaste.com.ua/yak-sortyvaty-na-karantuni/', url: true },
    { name: 'user.lower-nav-bar.eco-shop', route: 'https://shop.nowaste.com.ua/', url: true },
    { name: 'Green City', route: '/greenCity', url: false }
  ];

  public navLinks = [
    { name: 'user.lower-nav-bar.eco-events', route: '/news', url: false },
    { name: 'user.lower-nav-bar.events', route: '/events', url: false },
    { name: 'user.lower-nav-bar.map', route: '/places', url: false },
    { name: 'user.lower-nav-bar.about-us', route: '/about', url: false },
    { name: 'user.lower-nav-bar.my-habits', route: '/profile', url: false },
    { name: 'user.lower-nav-bar.ubs', route: '/ubs', url: false }
  ];

  public ubsArrLang = [
    { lang: 'UA', langName: 'ukrainian' },
    { lang: 'EN', langName: 'english' }
  ];

  public gCArrLang = [
    { lang: 'Ua', langName: 'ukrainian' },
    { lang: 'En', langName: 'english' }
  ];

  getSelectedIndex() {
    return this.selectedIndex;
  }

  setSelectedIndex(num: number) {
    this.selectedIndex = num;
  }

  getNavLinks(value: boolean) {
    return value ? this.ubsNavLinks : this.navLinks;
  }

  getArrayLang(value: boolean) {
    return value ? this.ubsArrLang : this.gCArrLang;
  }
}
