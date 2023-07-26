import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserMessagesService } from '../../../../ubs/ubs-user/services/user-messages.service';
import { UbsBaseSidebarComponent } from 'src/app/shared/ubs-base-sidebar/ubs-base-sidebar.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { listElementsAdmin } from '../../../ubs/models/ubs-sidebar-links';
import { UbsAdminEmployeeService } from 'src/app/ubs/ubs-admin/services/ubs-admin-employee.service';
import {
  employeePositionsName,
  AdminSideBarMenu,
  EnablingAuthorities,
  SideMenuElementsNames
} from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// @ts-ignore
@Component({
  selector: 'app-ubs-admin-sidebar',
  templateUrl: './ubs-admin-sidebar.component.html'
})
export class UbsAdminSidebarComponent extends UbsBaseSidebarComponent implements AfterViewInit, OnInit {
  public listElementsAdmin = listElementsAdmin;
  public employeeAuthorities: string[];
  public employeePositions: string[];
  public positionName: Array<string>;
  public destroySub: Subject<boolean> = new Subject<boolean>();

  constructor(
    public ubsAdminEmployeeService: UbsAdminEmployeeService,
    public service: UserMessagesService,
    public breakpointObserver: BreakpointObserver,
    public jwtService: JwtService
  ) {
    super(service, breakpointObserver, jwtService);
  }

  ngOnInit() {
    this.ubsAdminEmployeeService.employeePositions$.pipe(takeUntil(this.destroySub)).subscribe((employeePositions) => {
      if (employeePositions.length) {
        this.authoritiesSubscription(employeePositions);
      }
    });
  }

  private authoritiesSubscription(positions) {
    this.ubsAdminEmployeeService.employeePositionsAuthorities$.pipe(takeUntil(this.destroySub)).subscribe((rights) => {
      if (rights.authorities.length) {
        this.changeListElementsDependOnPermissions(positions, rights.authorities);
      }
    });
  }

  private positionFilterUtil(posArr: Array<string>): boolean {
    if (this.employeePositions) {
      const result = this.employeePositions.filter((positionsItem) => posArr.includes(positionsItem));
      return result.length > 0;
    }
  }

  private authoritiesFilterUtil(authority: string): boolean {
    if (this.employeeAuthorities) {
      const result = this.employeeAuthorities.filter((authoritiesItem) => authoritiesItem === authority);
      return result.length > 0;
    }
  }

  private listElenenChangetUtil(elementName: string) {
    this.listElementsAdmin = this.listElementsAdmin.filter((listItem: AdminSideBarMenu) => listItem.name !== elementName);
    return this.listElementsAdmin;
  }

  get customerViewer() {
    const viewersArr = [
      employeePositionsName.SuperAdmin,
      employeePositionsName.Admin,
      employeePositionsName.CallManager,
      employeePositionsName.ServiceManager,
      employeePositionsName.Logistician,
      employeePositionsName.Navigator
    ];

    return this.positionFilterUtil(viewersArr) || this.authoritiesFilterUtil(EnablingAuthorities.customers);
  }

  get employeesViewer() {
    const employeesArr = [
      employeePositionsName.SuperAdmin,
      employeePositionsName.Admin,
      employeePositionsName.CallManager,
      employeePositionsName.ServiceManager,
      employeePositionsName.Logistician
    ];
    return this.positionFilterUtil(employeesArr) || this.authoritiesFilterUtil(EnablingAuthorities.employees);
  }

  get certificatesViewer() {
    const certificatesArr = [
      employeePositionsName.SuperAdmin,
      employeePositionsName.Admin,
      employeePositionsName.CallManager,
      employeePositionsName.ServiceManager,
      employeePositionsName.Logistician
    ];
    return this.positionFilterUtil(certificatesArr) || this.authoritiesFilterUtil(EnablingAuthorities.certificates);
  }

  get notificationsViewer() {
    const notificationsArr = [
      employeePositionsName.SuperAdmin,
      employeePositionsName.Admin,
      employeePositionsName.CallManager,
      employeePositionsName.ServiceManager
    ];
    return this.positionFilterUtil(notificationsArr) || this.authoritiesFilterUtil(EnablingAuthorities.notifications);
  }

  get tariffsViewer() {
    const viewersArr = [
      employeePositionsName.SuperAdmin,
      employeePositionsName.Admin,
      employeePositionsName.CallManager,
      employeePositionsName.ServiceManager,
      employeePositionsName.Logistician,
      employeePositionsName.Navigator
    ];
    return this.positionFilterUtil(viewersArr) || this.authoritiesFilterUtil(EnablingAuthorities.tariffs);
  }

  private changeListElementsDependOnPermissions(positions: string[], authorities: string[]) {
    this.employeeAuthorities = authorities;
    this.employeePositions = positions;
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
  }
}
