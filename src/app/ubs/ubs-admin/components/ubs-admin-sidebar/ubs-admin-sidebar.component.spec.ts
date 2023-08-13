import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UbsAdminSidebarComponent } from './ubs-admin-sidebar.component';
import { UbsAdminEmployeeService } from '../../services/ubs-admin-employee.service';
import { BehaviorSubject, of } from 'rxjs';
import { employeePositionsName, SideMenuElementsNames } from '../../models/ubs-admin.interface';
import { listElementsAdmin } from 'src/app/ubs/ubs/models/ubs-sidebar-links';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IAppState } from 'src/app/store/state/app.state';

describe('UbsAdminSidebarComponent', () => {
  let component: UbsAdminSidebarComponent;
  let fixture: ComponentFixture<UbsAdminSidebarComponent>;
  let store: MockStore<IAppState>;
  const initialState = {
    employees: null,
    error: null,
    employeesPermissions: []
  };
  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ employees: { employeesPermissions: mockData } }));

  const employeePositionsMock = [
    employeePositionsName.CallManager,
    employeePositionsName.ServiceManager,
    employeePositionsName.Logistician
  ];

  const employeePositionsAuthorities = {
    authorities: ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'],
    positionId: [3, 4, 5]
  };

  const listElementsAdminMock: object[] = [
    {
      link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
      name: 'ubs-sidebar.orders',
      routerLink: 'orders'
    },
    {
      link: './assets/img/sidebarIcons/achievement_icon.svg',
      name: 'ubs-sidebar.certificates',
      routerLink: 'certificates'
    },
    {
      link: 'assets/img/sidebarIcons/workers_icon.svg',
      name: 'ubs-sidebar.employees',
      routerLink: 'employee/1'
    },
    {
      link: 'assets/img/sidebarIcons/statistic_icon.svg',
      name: 'ubs-sidebar.tariffs',
      routerLink: 'tariffs'
    },
    {
      link: 'assets/img/sidebarIcons/none_notification_Bell.svg',
      name: 'ubs-sidebar.notifications',
      routerLink: 'notifications'
    }
  ];

  const ubsAdminEmployeeServiceMock = jasmine.createSpyObj('ubsAdminEmployeeServiceMock', [
    'employeePositions$',
    'employeePositionsAuthorities$'
  ]);
  ubsAdminEmployeeServiceMock.employeePositions$ = new BehaviorSubject(employeePositionsMock);
  ubsAdminEmployeeServiceMock.employeePositionsAuthorities$ = new BehaviorSubject(employeePositionsAuthorities);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminSidebarComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: Store, useValue: storeMock },
        { provide: UbsAdminEmployeeService, useValue: ubsAdminEmployeeServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listElenenChangetUtil should called in changeListElementsDependOnPermissions()', () => {
    const spy = spyOn(component as any, 'listElenenChangetUtil');
    spyOnProperty(component as any, 'customerViewer', 'get').and.returnValue(false);
    (component as any).changeListElementsDependOnPermissions(employeePositionsAuthorities.authorities);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(SideMenuElementsNames.customers);
  });

  it('listElenenChangetUtil should called in changeListElementsDependOnPermissions()', () => {
    const spy = spyOn(component as any, 'listElenenChangetUtil');
    spyOnProperty(component as any, 'certificatesViewer', 'get').and.returnValue(false);
    (component as any).changeListElementsDependOnPermissions(employeePositionsAuthorities.authorities);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(SideMenuElementsNames.certificates);
  });

  it('notificationsViewer method should call', () => {
    const spy = spyOnProperty(component, 'notificationsViewer').and.callThrough();
    const spy3 = spyOn(component as any, 'authoritiesFilterUtil');
    (component as any).changeListElementsDependOnPermissions(employeePositionsAuthorities.authorities);
    expect(spy).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('certificatesViewer method should call', () => {
    const spy = spyOnProperty(component, 'certificatesViewer').and.callThrough();
    const spy3 = spyOn(component as any, 'authoritiesFilterUtil');
    (component as any).changeListElementsDependOnPermissions(employeePositionsAuthorities.authorities);
    expect(spy).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('tariffsViewer method should call', () => {
    const spy = spyOnProperty(component, 'tariffsViewer').and.callThrough();
    const spy3 = spyOn(component as any, 'authoritiesFilterUtil');
    (component as any).changeListElementsDependOnPermissions(employeePositionsAuthorities.authorities);
    expect(spy).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('employeesViewer method should call', () => {
    const spy = spyOnProperty(component, 'employeesViewer').and.callThrough();
    const spy3 = spyOn(component as any, 'authoritiesFilterUtil');
    (component as any).changeListElementsDependOnPermissions(employeePositionsAuthorities.authorities);
    expect(spy).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('customerViewer method should call', () => {
    const spy = spyOnProperty(component, 'customerViewer').and.callThrough();
    const spy3 = spyOn(component as any, 'authoritiesFilterUtil');
    (component as any).changeListElementsDependOnPermissions(employeePositionsAuthorities.authorities);
    expect(spy).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('ordersViewer method should call', () => {
    const spy = spyOnProperty(component, 'ordersViewer').and.callThrough();
    const spy3 = spyOn(component as any, 'authoritiesFilterUtil');
    (component as any).changeListElementsDependOnPermissions(employeePositionsAuthorities.authorities);
    expect(spy).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('authoritiesFilterUtil method should call', () => {
    component.employeeAuthorities = employeePositionsAuthorities.authorities;
    const spy = spyOn(component as any, 'authoritiesFilterUtil').and.callThrough();
    expect(spy).toBeTruthy();
  });

  it('listElenenChangetUtil method should call', () => {
    component.listElementsAdmin = listElementsAdmin;
    (component as any).listElenenChangetUtil(SideMenuElementsNames.customers);
    expect(component.listElementsAdmin).toEqual(listElementsAdminMock);
  });
});
