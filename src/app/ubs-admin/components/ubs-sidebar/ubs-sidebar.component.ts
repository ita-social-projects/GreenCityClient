import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
  public fixed = false;
  public primaryGreenColor = '#13aa57';
  public secondaryGrayColor = '#444e55';
  public listElements = [
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
