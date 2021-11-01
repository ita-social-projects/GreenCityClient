import { AfterViewInit, Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserMessagesService } from '../../../ubs-user/services/user-messages.service';
import { UbsBaseSidebarComponent } from 'src/app/shared/ubs-base-sidebar/ubs-base-sidebar.component';
import { JwtService } from '@global-service/jwt/jwt.service';

// @ts-ignore
@Component({
  selector: 'app-ubs-admin-sidebar',
  templateUrl: './ubs-admin-sidebar.component.html'
})
export class UbsAdminSidebarComponent extends UbsBaseSidebarComponent implements AfterViewInit {
  public listElementsAdmin: any[] = [
    {
      link: 'assets/img/sidebarIcons/user_icon.svg',
      name: 'ubs-sidebar.customers',
      routerLink: 'customers'
    },
    {
      link: './assets/img/sidebarIcons/achievement_icon.svg',
      name: 'ubs-sidebar.certificates',
      routerLink: 'certificates'
    },
    {
      link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
      name: 'ubs-sidebar.orders',
      routerLink: 'orders'
    },
    {
      link: 'assets/img/sidebarIcons/workers_icon.svg',
      name: 'ubs-sidebar.employees',
      routerLink: 'employee/1'
    },
    {
      link: 'assets/img/sidebarIcons/documents_icon.svg',
      name: 'ubs-sidebar.documents',
      routerLink: '#'
    },
    {
      link: 'assets/img/sidebarIcons/calendar_icon.svg',
      name: 'ubs-sidebar.schedule',
      routerLink: '#'
    },
    {
      link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
      name: 'ubs-sidebar.tariffs',
      routerLink: 'tariffs'
    }
  ];

  constructor(public service: UserMessagesService, public breakpointObserver: BreakpointObserver, public jwtService: JwtService) {
    super(service, breakpointObserver, jwtService);
  }
}
