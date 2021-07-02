import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-ubs-base-sidebar',
  templateUrl: './ubs-base-sidebar.component.html',
  styleUrls: ['./ubs-base-sidebar.component.scss']
})
export class UbsBaseSidebarComponent implements AfterViewInit {
  public openClose = false;
  public stopClick = false;
  @Input() public listElements: any[] = [];
  @ViewChild('sidebarToggler', { static: false }) sidebarToggler: ElementRef;
  @ViewChild('sideBarIcons', { static: false }) sideBarIcons: ElementRef;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  @ViewChild('sidebarContainer', { static: false }) sidebarContainer: ElementRef;

  constructor(public breakpointObserver: BreakpointObserver) {}

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
