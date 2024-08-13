import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserService } from '@global-service/user/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChatPopupComponent } from './chat-popup.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { of } from 'rxjs';
import { JwtService } from '@global-service/jwt/jwt.service';
import { OrderService } from '@ubs/ubs/services/order.service';
import { TranslateModule } from '@ngx-translate/core';

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
      declarations: [ChatPopupComponent],
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
});
