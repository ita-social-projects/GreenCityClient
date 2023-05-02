import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  EventEmitter
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
import { UserMessagesService } from '../../ubs/ubs-user/services/user-messages.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubs-base-sidebar',
  templateUrl: './ubs-base-sidebar.component.html',
  styleUrls: ['./ubs-base-sidebar.component.scss']
})
export class UbsBaseSidebarComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  private destroySub: Subject<boolean> = new Subject<boolean>();
  readonly bellsNoneNotification = 'assets/img/sidebarIcons/none_notification_Bell.svg';
  readonly bellsNotification = 'assets/img/sidebarIcons/notification_Bell.svg';
  private adminRoleValue = 'ROLE_UBS_EMPLOYEE';
  private sidebarChangeBreakpoint: number;
  public isAdmin = false;

  destroy: Subject<boolean> = new Subject<boolean>();
  @Input() public listElements: object[] = [];
  @Input() public listElementsMobile: object[] = [];
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('sideBarIcons') sideBarIcons: ElementRef;
  @ViewChild('sidebarContainer') sidebarContainer: ElementRef;

  CUSTOM_BREAKPOINTS = {
    XSmall: '(max-width: 480px)'
  };

  constructor(
    public serviceUserMessages: UserMessagesService,
    public breakpointObserver: BreakpointObserver,
    public jwtService: JwtService,
    private router?: Router,
    private cdr?: ChangeDetectorRef
  ) {}

  public isExpanded = false;

  public navigateToPage(routerLink: string): void {
    const mainLink = this.isAdmin ? 'ubs-admin' : 'ubs-user';
    console.log('el', this.listElements);
    console.log('routerLink', routerLink);

    const route = [mainLink];
    const routes = routerLink.split('/');

    route.push(...routes);

    this.router.navigate(route);
  }

  public setIndexToSidebarIcons(): void {
    if (this.drawer.opened) {
      this.sideBarIcons.nativeElement.style.zIndex = '0';
      this.sidebarContainer.nativeElement.style.marginLeft = '25px';
      this.sidebarContainer.nativeElement.style.width = 'calc(100% - 50px)';
    } else {
      this.sideBarIcons.nativeElement.style.zIndex = '2';
      this.sidebarContainer.nativeElement.style.marginLeft = '85px';
      this.sidebarContainer.nativeElement.style.width = 'calc(100% - 120px)';
    }
  }

  public getIcon(listItem): string {
    return listItem.link === this.bellsNoneNotification && this.serviceUserMessages.countOfNoReadeMessages
      ? this.bellsNotification
      : listItem.link;
  }

  public toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.drawer) {
      this.isExpanded = event.target.innerWidth > this.sidebarChangeBreakpoint || window.innerWidth > this.sidebarChangeBreakpoint;
    }
  }

  getCountOfUnreadNotification() {
    this.jwtService.userRole$.pipe(takeUntil(this.destroySub)).subscribe((userRole) => {
      if (userRole !== this.adminRoleValue) {
        this.serviceUserMessages
          .getCountUnreadNotification()
          .pipe(takeUntil(this.destroy))
          .subscribe((response) => {
            this.serviceUserMessages.countOfNoReadeMessages = response;
          });
      } else {
        this.isAdmin = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.sidebarChangeBreakpoint = 1266;
    if (window.innerWidth < this.sidebarChangeBreakpoint && this.drawer) {
      this.isExpanded = false;
    }
    setTimeout(() => {
      this.breakpointObserver.observe([this.CUSTOM_BREAKPOINTS.XSmall]).subscribe((result) => {
        console.log(result);
        if (this.drawer) {
          this.drawer.mode = 'side';
          this.drawer.opened = !result.matches;
        }
      });
    }, 0);
    this.getCountOfUnreadNotification();
    console.log(Breakpoints.Small, Breakpoints.XSmall);
  }

  ngAfterViewChecked(): void {
    this.cdr?.detectChanges();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
