import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserMessagesService } from '../../../../ubs/ubs-user/services/user-messages.service';
import { UbsBaseSidebarComponent } from 'src/app/shared/ubs-base-sidebar/ubs-base-sidebar.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { listElementsAdmin } from '../../../ubs/models/ubs-sidebar-links';
import { UbsAdminEmployeeService } from 'src/app/ubs/ubs-admin/services/ubs-admin-employee.service';
import { AdminSideBarMenu, EnablingAuthorities, SideMenuElementsNames } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { GetEmployeesPermissions } from 'src/app/store/actions/employee.actions';

// @ts-ignore
@Component({
  selector: 'app-ubs-admin-sidebar',
  templateUrl: './ubs-admin-sidebar.component.html'
})
export class UbsAdminSidebarComponent extends UbsBaseSidebarComponent implements AfterViewInit, OnInit {
  public listElementsAdmin = listElementsAdmin;
  public employeeAuthorities: string[];
  public positionName: Array<string>;
  public destroySub: Subject<boolean> = new Subject<boolean>();
  public permissions$ = this.store.select((state): Array<string> => state.employees.employeesPermissions);

  constructor(
    public ubsAdminEmployeeService: UbsAdminEmployeeService,
    public service: UserMessagesService,
    public breakpointObserver: BreakpointObserver,
    public jwtService: JwtService,
    private store: Store<IAppState>
  ) {
    super(service, breakpointObserver, jwtService);
  }

  ngOnInit() {
    const userEmail = this.jwtService.getEmailFromAccessToken();
    this.store.dispatch(GetEmployeesPermissions({ email: userEmail }));
    this.authoritiesSubscription();
  }

  private authoritiesSubscription() {
    this.permissions$.subscribe((authorities) => {
      if (authorities.length) {
        this.changeListElementsDependOnPermissions(authorities);
      }
    });
  }

  private authoritiesFilterUtil(authority: string): boolean {
    if (this.employeeAuthorities) {
      const result = this.employeeAuthorities.filter((authoritiesItem) => authoritiesItem === authority);
      return !!result.length;
    }
  }

  private listElenenChangetUtil(elementName: string) {
    this.listElementsAdmin = this.listElementsAdmin.filter((listItem: AdminSideBarMenu) => listItem.name !== elementName);
    return this.listElementsAdmin;
  }

  get customerViewer() {
    return this.authoritiesFilterUtil(EnablingAuthorities.customers);
  }

  get employeesViewer() {
    return this.authoritiesFilterUtil(EnablingAuthorities.employees);
  }

  get certificatesViewer() {
    return this.authoritiesFilterUtil(EnablingAuthorities.certificates);
  }

  get notificationsViewer() {
    return this.authoritiesFilterUtil(EnablingAuthorities.notifications);
  }

  get tariffsViewer() {
    return this.authoritiesFilterUtil(EnablingAuthorities.tariffs);
  }

  get ordersViewer() {
    return this.authoritiesFilterUtil(EnablingAuthorities.orders);
  }

  private changeListElementsDependOnPermissions(authorities: string[]) {
    this.employeeAuthorities = authorities;
    if (!this.customerViewer) {
      this.listElenenChangetUtil(SideMenuElementsNames.customers);
    }

    if (!this.employeesViewer) {
      this.listElenenChangetUtil(SideMenuElementsNames.employees);
    }

    if (!this.certificatesViewer) {
      this.listElenenChangetUtil(SideMenuElementsNames.certificates);
    }

    if (!this.notificationsViewer) {
      this.listElenenChangetUtil(SideMenuElementsNames.notifications);
    }

    if (!this.tariffsViewer) {
      this.listElenenChangetUtil(SideMenuElementsNames.tariffs);
    }

    if (!this.ordersViewer) {
      this.listElenenChangetUtil(SideMenuElementsNames.orders);
    }
  }
}
