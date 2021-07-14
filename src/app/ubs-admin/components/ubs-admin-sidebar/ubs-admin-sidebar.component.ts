import { AfterViewInit, Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UbsBaseSidebarComponent } from 'src/app/shared/ubs-base-sidebar/ubs-base-sidebar.component';

@Component({
  selector: 'app-ubs-admin-sidebar',
  templateUrl: './ubs-admin-sidebar.component.html'
})
export class UbsAdminSidebarComponent extends UbsBaseSidebarComponent implements AfterViewInit {
  public listElementsAdmin: any[] = [
    {
      link: 'assets/img/sidebarIcons/user_icon.svg',
      name: 'Користувачі'
    },
    {
      link: './assets/img/sidebarIcons/achievment_icon.svg',
      name: 'Сертифікати'
    },
    {
      link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
      name: 'Замовлення'
    },
    {
      link: 'assets/img/sidebarIcons/workers_icon.svg',
      name: 'Працівники'
    },
    {
      link: 'assets/img/sidebarIcons/documents_icon.svg',
      name: 'Документи'
    },
    {
      link: 'assets/img/sidebarIcons/calendar_icon.svg',
      name: 'Графік'
    }
  ];

  constructor(public breakpointObserver: BreakpointObserver) {
    super(breakpointObserver);
  }
}
