import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDrawer } from '@angular/material/sidenav';
import { UserMessagesService } from '@ubs/ubs-user/services/user-messages.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { Router } from '@angular/router';
import { listElements } from '@ubs/ubs/interface/ubs-base-sidebar-interface';

@Component({
  selector: 'app-ubs-base-sidebar',
  templateUrl: './ubs-base-sidebar.component.html',
  styleUrls: ['./ubs-base-sidebar.component.scss']
})
export class UbsBaseSidebarComponent implements OnInit, OnDestroy {
  destroySub: Subject<boolean> = new Subject<boolean>();
  readonly bellsNoneNotification = 'assets/img/sidebarIcons/none_notification_Bell.svg';
  readonly bellsNotification = 'assets/img/sidebarIcons/notification_Bell.svg';
  private adminRoleValue = 'ROLE_UBS_EMPLOYEE';
  isAdmin = false;
  destroy: Subject<boolean> = new Subject<boolean>();
  isExpanded = false;
  @Input() public listElements: listElements[] = [];
  @Input() public listElementsMobile: listElements[] = [];
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('sideBarIcons') sideBarIcons: ElementRef;
  @ViewChild('sidebarContainer') sidebarContainer: ElementRef;

  constructor(
    public serviceUserMessages: UserMessagesService,
    public breakpointObserver: BreakpointObserver,
    public jwtService: JwtService,
    private router?: Router
  ) {}

  ngOnInit(): void {
    this.getCountOfUnreadNotification();
  }

  navigateToPage(event: Event, routerLink: string): void {
    event.stopPropagation();
    const mainLink = this.isAdmin ? 'ubs/admin' : 'ubs/user';
    this.router.navigate([mainLink, ...routerLink.split('/')]);
  }

  getIcon(listItem: listElements): string {
    return listItem.link === this.bellsNoneNotification && this.serviceUserMessages.countOfNoReadMessages
      ? this.bellsNotification
      : listItem.link;
  }

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }

  getCountOfUnreadNotification() {
    this.jwtService.userRole$.pipe(takeUntil(this.destroySub)).subscribe((userRole) => {
      if (userRole !== this.adminRoleValue) {
        this.serviceUserMessages
          .getCountUnreadNotification()
          .pipe(takeUntil(this.destroy))
          .subscribe((response) => {
            this.serviceUserMessages.countOfNoReadMessages = response;
          });
      } else {
        this.isAdmin = true;
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
