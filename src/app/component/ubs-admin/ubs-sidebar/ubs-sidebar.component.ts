import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-ubs-sidebar',
  templateUrl: './ubs-sidebar.component.html',
  styleUrls: ['./ubs-sidebar.component.scss'],
})
export class UbsSidebarComponent implements OnInit, AfterViewInit {
  public openClose = false;
  public stopClick = false;
  public fixed = false;

  @ViewChild('sidebarToggler', { static: false }) sidebarToggler: ElementRef;
  @ViewChild('sideBarIcons', { static: false }) sideBarIcons: ElementRef;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;

  constructor(private breakpointObserver: BreakpointObserver) {}

  public toggleSideBar(): void {
    if (this.openClose) {
      this.drawer.toggle();

      this.stopClick = true;
      this.sidebarToggler.nativeElement.style.backgroundColor = '#444e55';

      setTimeout(() => {
        this.sideBarIcons.nativeElement.style.zIndex = '0';
        this.stopClick = false;
        this.sidebarToggler.nativeElement.style.backgroundColor = '#13aa57';
      }, 350);

      this.sidebarToggler.nativeElement.textContent = '<<';
      this.openClose = false;

    } else {
      this.drawer.toggle();

      this.sideBarIcons.nativeElement.style.zIndex = '4';
      this.sidebarToggler.nativeElement.textContent = '>>';
      this.openClose = true;
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.breakpointObserver.observe([
        Breakpoints.Small,
        Breakpoints.XSmall
      ]).subscribe(result => {
        if (result.matches) {
          this.drawer.mode = 'over';
        } else {
          this.drawer.mode = 'side';
        }
      });
    }, 0);
  }
}
