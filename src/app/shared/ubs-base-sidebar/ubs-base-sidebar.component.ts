import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
import { UserMessagesService } from '../../ubs-user/services/user-messages.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JwtService } from '@global-service/jwt/jwt.service';

@Component({
  selector: 'app-ubs-base-sidebar',
  templateUrl: './ubs-base-sidebar.component.html',
  styleUrls: ['./ubs-base-sidebar.component.scss']
})
export class UbsBaseSidebarComponent implements AfterViewInit, OnDestroy {
  private destroySub: Subject<boolean> = new Subject<boolean>();
  readonly bellsNoneNotification = 'assets/img/sidebarIcons/none_notification_Bell.svg';
  readonly bellsNotification = 'assets/img/sidebarIcons/notification_Bell.svg';
  readonly arrowRight = 'assets/img/ubs-admin-sidebar/arrowRight.svg';
  readonly arrowLeft = 'assets/img/ubs-admin-sidebar/arrowLeft.svg';
  public openClose = false;
  public stopClick = false;
  private adminRoleValue = 'ROLE_ADMIN';
  destroy: Subject<boolean> = new Subject<boolean>();
  @Input() public listElements: any[] = [];
  @ViewChild('sidebarToggler') sidebarToggler: ElementRef;
  @ViewChild('sideBarIcons') sideBarIcons: ElementRef;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('sidebarContainer') sidebarContainer: ElementRef;

  constructor(
    public serviceUserMessages: UserMessagesService,
    public breakpointObserver: BreakpointObserver,
    public jwtService: JwtService
  ) {}

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

  getCountOfUnreadNotification() {
    this.jwtService.userRole$.pipe(takeUntil(this.destroySub)).subscribe((userRole) => {
      if (userRole !== this.adminRoleValue) {
        this.serviceUserMessages
          .getCountUnreadNotification()
          .pipe(takeUntil(this.destroy))
          .subscribe((response) => {
            this.serviceUserMessages.countOfNoReadeMessages = response;
          });
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).subscribe((result) => {
        if (this.drawer) {
          this.drawer.mode = 'side';
        }
      });
    }, 0);
    this.getCountOfUnreadNotification();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
