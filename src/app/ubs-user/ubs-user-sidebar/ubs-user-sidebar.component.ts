import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { UbsBaseSidebarComponent } from 'src/app/shared/ubs-base-sidebar/ubs-base-sidebar.component';

@Component({
  selector: 'app-ubs-user-sidebar',
  templateUrl: './ubs-user-sidebar.component.html'
})
export class UbsUserSidebarComponent extends UbsBaseSidebarComponent implements OnInit {
  public listElementsUser: any[] = [
    {
      link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
      name: 'ubs-user.orders',
      routerLink: 'orders'
    },
    {
      link: './assets/img/sidebarIcons/achievement_icon.svg',
      name: 'ubs-user.invoice',
      routerLink: 'bonuses'
    },
    {
      link: 'assets/img/sidebarIcons/workers_icon.svg',
      name: 'ubs-user.user_data',
      routerLink: '#'
    },
    {
      link: 'assets/img/sidebarIcons/none_notification_Bell.svg',
      name: 'ubs-user.messages',
      routerLink: 'messages/1'
    }
  ];

  constructor(public breakpointObserver: BreakpointObserver) {
    super(breakpointObserver);
  }

  ngOnInit(): void {}
}
