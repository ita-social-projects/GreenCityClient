import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared.module';
import { UbsAdminTableComponent } from '../../ubs/ubs-admin/components/ubs-admin-table/ubs-admin-table.component';
import { HeaderComponent } from '../header/header.component';
import { UbsBaseSidebarComponent } from './ubs-base-sidebar.component';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserMessagesService } from '../../ubs/ubs-user/services/user-messages.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { of } from 'rxjs';

describe('UbsBaseSidebarComponent', () => {
  let component: UbsBaseSidebarComponent;
  let fixture: ComponentFixture<UbsBaseSidebarComponent>;

  const userMessagesService = jasmine.createSpyObj('userMessagesService', ['getCountUnreadNotification']);
  userMessagesService.getCountUnreadNotification.and.returnValue(of(0));
  const jwtServiceMock = jasmine.createSpyObj('jwtService', ['']);
  jwtServiceMock.userRole$ = of('ROLE_UBS_EMPLOYEE');

  const listItem = {
    link: '',
    name: 'ubs-user.orders',
    routerLink: 'orders'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSidenavModule,
        MatIconModule,
        MatTableModule,
        DragDropModule,
        MatCheckboxModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule,
        RouterTestingModule,
        InfiniteScrollModule
      ],
      declarations: [UbsBaseSidebarComponent, UbsAdminTableComponent, HeaderComponent],
      providers: [
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UserMessagesService, useValue: userMessagesService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsBaseSidebarComponent);
    component = fixture.componentInstance;
    spyOn(global, 'setTimeout');
    userMessagesService.countOfNoReadeMessages = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return icon link from list item', () => {
    listItem.link = component.bellsNotification;
    expect(component.getIcon(listItem)).toBe(listItem.link);
  });

  it('should return default icon link', () => {
    userMessagesService.countOfNoReadeMessages = 1;
    listItem.link = component.bellsNoneNotification;
    expect(component.getIcon(listItem)).toBe(component.bellsNotification);
  });

  it('should trigger onResize method when window is resized', () => {
    const spyOnResize = spyOn(component, 'onResize');
    window.dispatchEvent(new Event('resize'));
    expect(spyOnResize).toHaveBeenCalled();
  });

  it('should call getCountOfUnreadNotification', () => {
    const getCountOfUnreadNotificationSpy = spyOn(component, 'getCountOfUnreadNotification');
    component.ngAfterViewInit();
    expect(getCountOfUnreadNotificationSpy).toHaveBeenCalled();
  });

  it('ngAfterViewInit should called getCountOfUnreadNotification method one time', () => {
    const getCountOfUnreadNotificationSpy = spyOn(component, 'getCountOfUnreadNotification');
    component.ngAfterViewInit();
    expect(getCountOfUnreadNotificationSpy).toHaveBeenCalledTimes(1);
  });

  it('calls detect changes', () => {
    const spy = spyOn((component as any).cdr, 'detectChanges');
    component.ngAfterViewChecked();
    expect(spy).toHaveBeenCalled();
  });
});
