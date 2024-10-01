import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserService } from '@global-service/user/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChatPopupComponent } from './chat-popup.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { of, Subject } from 'rxjs';
import { JwtService } from '@global-service/jwt/jwt.service';
import { TranslateModule } from '@ngx-translate/core';
import { ReferenceDirective } from '../../directive/reference/reference.directive';
import { StoreModule } from '@ngrx/store';

describe('ChatPopupComponent', () => {
  let component: ChatPopupComponent;
  let fixture: ComponentFixture<ChatPopupComponent>;
  const jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'ROLE_UBS_EMPLOYEE';
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject', 'getUserId']);
  localStorageServiceMock.userIdBehaviourSubject = of(1);
  localStorageServiceMock.getUserId = () => {
    1;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatPopupComponent, ReferenceDirective],
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), MatDialogModule, StoreModule.forRoot({})],
      providers: [
        { provide: UserService, useValue: {} },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
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
