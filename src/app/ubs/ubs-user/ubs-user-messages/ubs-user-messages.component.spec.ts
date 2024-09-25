import { UbsUserMessagesComponent } from './ubs-user-messages.component';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NotificationBody, Notifications } from '../../ubs-admin/models/ubs-user.model';
import { UserMessagesService } from '../services/user-messages.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('UbsUserMessagesComponent', () => {
  let component: UbsUserMessagesComponent;
  let fixture: ComponentFixture<UbsUserMessagesComponent>;
  const fakeNotificationBody: NotificationBody = {
    id: 1,
    images: ['https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg'],
    body: 'fakeBody',
    notificationTime: '04.06.2020',
    orderId: 1,
    title: 'Недотримання правил УБС',
    read: false,
    isOpen: false
  };
  const fakeNotification: Notifications = {
    page: [fakeNotificationBody],
    totalElements: 1,
    currentPage: 1,
    totalPages: 1
  };

  let route: ActivatedRoute;
  const localStorageServiceFake = jasmine.createSpyObj('LocalStorageService', ['']);
  localStorageServiceFake.languageBehaviourSubject = () => of('en');

  const userMessageServiceMock = jasmine.createSpyObj('UserMessagesService', ['getNotification']);
  userMessageServiceMock.getNotification = () => of(fakeNotification);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsUserMessagesComponent, PaginatePipe],
      imports: [MatDialogModule, TranslateModule.forRoot(), RouterTestingModule, NgxPaginationModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: UserMessagesService, useValue: userMessageServiceMock }]
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`should initialize without images and with count of page equals 0`, () => {
    component.ngOnInit();

    expect(component.images.length).toEqual(0);
    expect(component.page).toEqual(0);
  });

  it(`should initialize the notification body`, () => {
    component.fetchNotification();

    expect(component.notifications).toEqual([fakeNotificationBody]);
  });

  it('should open popUp', fakeAsync(() => {
    const spy = spyOn(component, 'openImg');
    fixture.debugElement.query(By.css('.notification-images')).nativeElement.click();
    tick();
    expect(spy).toHaveBeenCalled();
  }));
});
