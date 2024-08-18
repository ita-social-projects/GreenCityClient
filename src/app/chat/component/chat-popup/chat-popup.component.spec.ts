import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserService } from '@global-service/user/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChatPopupComponent } from './chat-popup.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { of, Subject } from 'rxjs';
import { JwtService } from '@global-service/jwt/jwt.service';
import { OrderService } from '@ubs/ubs/services/order.service';
import { TranslateModule } from '@ngx-translate/core';
import { ReferenceDirective } from '../../directive/reference/reference.directive';

describe('ChatPopupComponent', () => {
  let component: ChatPopupComponent;
  let fixture: ComponentFixture<ChatPopupComponent>;

  const orderServiceMock = jasmine.createSpyObj('OrderService', ['userIdBehaviourSubject', 'getAccessToken']);
  orderServiceMock.getAllActiveCouriers = () => of([]);
  const jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'ROLE_UBS_EMPLOYEE';
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = of(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatPopupComponent, ReferenceDirective],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule],
      providers: [
        { provide: UserService, useValue: {} },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        MatDialog
      ]
    });
    fixture = TestBed.createComponent(ChatPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load chats if user is  authorized', () => {
    const spyConnect = spyOn((component as any).socketService, 'connect');
    const spyLoadChats = spyOn(component, 'loadChats');
    localStorageServiceMock.userIdBehaviourSubject = of(1);
    component.ngOnInit();
    expect((component as any).userId).toBe(1);
    expect((component as any).isUbsAdmin).toBeTrue();
    expect(spyConnect).toHaveBeenCalled();
    expect(spyLoadChats).toHaveBeenCalled();
  });

  it('should not load chats', () => {
    const spyConnect = spyOn((component as any).socketService, 'connect');
    const spyLoadChats = spyOn(component, 'loadChats');
    localStorageServiceMock.userIdBehaviourSubject = of(null);
    expect(spyConnect).not.toHaveBeenCalled();
    expect(spyLoadChats).not.toHaveBeenCalled();
  });

  it('should reset and unsubscribe', () => {
    (component as any).commonService.newMessageWindowRequireCloseStream$ = new Subject();
    const spyUnsub = spyOn((component as any).socketService, 'unsubscribeAll');
    const spyResetData = spyOn((component as any).chatsService, 'resetData');
    const spyWindow = spyOn((component as any).commonService.newMessageWindowRequireCloseStream$, 'next');
    localStorageServiceMock.userIdBehaviourSubject = of(null);
    component.ngOnInit();
    expect(spyUnsub).toHaveBeenCalled();
    expect(spyResetData).toHaveBeenCalled();
    expect(component.isOpen).toBeFalse();
    expect(spyWindow).toHaveBeenCalledWith(true);
  });
});
