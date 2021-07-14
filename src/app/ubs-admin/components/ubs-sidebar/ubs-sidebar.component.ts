import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-ubs-sidebar',
  templateUrl: './ubs-sidebar.component.html',
  styleUrls: ['./ubs-sidebar.component.scss']
})
export class UbsSidebarComponent implements AfterViewInit {
  public openClose = false;
  public stopClick = false;
  public listElements = [
    {
      link: 'assets/img/sidebarIcons/user_icon.svg',
      name: 'Користувачі',
      routerLink: '/ubs-admin/'
    },
    {
      link: './assets/img/sidebarIcons/achievment_icon.svg',
      name: 'Сертифікати',
      routerLink: '#'
    },
    {
      link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
      name: 'Замовлення',
      routerLink: '/ubs-admin/orders'
    },
    {
      link: 'assets/img/sidebarIcons/workers_icon.svg',
      name: 'Працівники',
      routerLink: '/ubs-admin/employee/1'
    },
    {
      link: 'assets/img/sidebarIcons/documents_icon.svg',
      name: 'Документи',
      routerLink: '#'
    },
    {
      link: 'assets/img/sidebarIcons/calendar_icon.svg',
      name: 'Графік',
      routerLink: '#'
    }
  ];
  @ViewChild('sidebarToggler', { static: false }) sidebarToggler: ElementRef;
  @ViewChild('sideBarIcons', { static: false }) sideBarIcons: ElementRef;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  @ViewChild('sidebarContainer', { static: false }) sidebarContainer: ElementRef;

  constructor(private breakpointObserver: BreakpointObserver) {}

  public toggleSideBar(): void {
    if (this.openClose) {
      this.drawer.toggle();
      this.stopClick = true;
      setTimeout(() => {
        this.sideBarIcons.nativeElement.style.zIndex = '0';
        this.sidebarContainer.nativeElement.style.marginLeft = '25px';
        this.stopClick = false;
      }, 350);
      this.openClose = false;
    } else {
      this.drawer.toggle();
      this.sidebarContainer.nativeElement.style.marginLeft = '85px';
      this.sideBarIcons.nativeElement.style.zIndex = '4';
      this.openClose = true;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe((result) => {
        if (result.matches) {
          this.drawer.mode = 'over';
        } else {
          this.drawer.mode = 'side';
        }
      });
    }, 0);
  }
}
