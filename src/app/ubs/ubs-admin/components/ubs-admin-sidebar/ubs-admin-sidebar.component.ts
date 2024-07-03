import { AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserMessagesService } from '../../../../ubs/ubs-user/services/user-messages.service';
import { UbsBaseSidebarComponent } from 'src/app/shared/ubs-base-sidebar/ubs-base-sidebar.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { listElementsAdmin } from '../../../ubs/models/ubs-sidebar-links';
import { UbsAdminEmployeeService } from 'src/app/ubs/ubs-admin/services/ubs-admin-employee.service';
import { AdminSideBarMenu, EnablingSeeAuthorities, SideMenuElementsNames } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-sidebar',
  templateUrl: './ubs-admin-sidebar.component.html',
  styleUrls: ['./ubs-admin-sidebar.component.scss']
})
export class UbsAdminSidebarComponent extends UbsBaseSidebarComponent implements AfterViewInit, OnInit {
  @Input() hasAuthorities: boolean;
  @Input() authorities: string[];
  listElementsAdmin = listElementsAdmin;
  employeeAuthorities: string[];
  positionName: Array<string>;
  destroySub: Subject<boolean> = new Subject<boolean>();

  constructor(
    public ubsAdminEmployeeService: UbsAdminEmployeeService,
    public service: UserMessagesService,
    public breakpointObserver: BreakpointObserver,
    public jwtService: JwtService
  ) {
    super(service, breakpointObserver, jwtService);
  }

  ngOnInit() {
    if (this.hasAuthorities) {
      this.changeListElementsDependOnPermissions(this.authorities);
    }
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
