import { Component, Input, OnInit } from '@angular/core';
import { UserMessagesService } from '@ubs/ubs-user/services/user-messages.service';
import { UbsBaseSidebarComponent } from '@ubs/shared/components/ubs-base-sidebar/ubs-base-sidebar.component';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { listElementsAdmin } from '@ubs/ubs/models/ubs-sidebar-links';
import { AdminSideBarMenu, EnablingSeeAuthorities, SideMenuElementsNames } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubs-admin-sidebar',
  templateUrl: './ubs-admin-sidebar.component.html',
  styleUrls: ['./ubs-admin-sidebar.component.scss']
})
export class UbsAdminSidebarComponent extends UbsBaseSidebarComponent implements OnInit {
  @Input() hasAuthorities: boolean;
  @Input() authorities: string[];
  listElementsAdmin = listElementsAdmin;
  employeeAuthorities: string[];
  destroySub: Subject<boolean> = new Subject<boolean>();

  constructor(
    public service: UserMessagesService,
    public jwtService: JwtService,
    protected router: Router
  ) {
    super(service, jwtService, router);
  }

  ngOnInit() {
    if (this.hasAuthorities) {
      this.changeListElementsDependOnPermissions(this.authorities);
    }
  }

  get shouldShowNoAuthorities(): boolean {
    return !this.hasAuthorities && !this.jwtService.isAuthenticated() && !this.jwtService.isAuthenticatingValue();
  }

  private authoritiesFilterUtil(authority: string): boolean {
    if (this.employeeAuthorities) {
      const result = this.employeeAuthorities.filter((authoritiesItem) => authoritiesItem === authority);
      return !!result.length;
    }
  }

  private listElementChangedUtil(elementName: string) {
    this.listElementsAdmin = this.listElementsAdmin.filter((listItem: AdminSideBarMenu) => listItem.name !== elementName);
    return this.listElementsAdmin;
  }

  private changeListElementsDependOnPermissions(authorities: string[]) {
    this.employeeAuthorities = authorities;

    if (!this.customerViewer) {
      this.listElementChangedUtil(SideMenuElementsNames.customers);
    }

    if (!this.employeesViewer) {
      this.listElementChangedUtil(SideMenuElementsNames.employees);
    }

    if (!this.certificatesViewer) {
      this.listElementChangedUtil(SideMenuElementsNames.certificates);
    }

    if (!this.notificationsViewer) {
      this.listElementChangedUtil(SideMenuElementsNames.notifications);
    }

    if (!this.tariffsViewer) {
      this.listElementChangedUtil(SideMenuElementsNames.tariffs);
    }

    if (!this.ordersViewer) {
      this.listElementChangedUtil(SideMenuElementsNames.orders);
    }
  }

  get customerViewer() {
    return this.authoritiesFilterUtil(EnablingSeeAuthorities.customers);
  }

  get employeesViewer() {
    return this.authoritiesFilterUtil(EnablingSeeAuthorities.employees);
  }

  get certificatesViewer() {
    return this.authoritiesFilterUtil(EnablingSeeAuthorities.certificates);
  }

  get notificationsViewer() {
    return this.authoritiesFilterUtil(EnablingSeeAuthorities.notifications);
  }

  get tariffsViewer() {
    return this.authoritiesFilterUtil(EnablingSeeAuthorities.tariffs);
  }

  get ordersViewer() {
    return this.authoritiesFilterUtil(EnablingSeeAuthorities.orders);
  }
}
