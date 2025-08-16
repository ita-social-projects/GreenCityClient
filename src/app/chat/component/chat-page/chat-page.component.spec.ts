import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChatComponent } from './chat-page.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';
import { TelegramSocketService } from '../../service/chats/telegram-socket.service';

class MockTranslateService {
  instant(k: string) {
    return k;
  }
  get(k: string) {
    return of(k);
  }
}

class MockTelegramSocketService {
  connect = jasmine.createSpy('connect');
  subscribeToMessages = jasmine.createSpy('subscribeToMessages');
}

xdescribe('ChatComponent (minimal)', () => {
  let fixture: ComponentFixture<ChatComponent>;
  let component: ChatComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: TelegramSocketService, useClass: MockTelegramSocketService },
        provideMockStore({
          selectors: [{ selector: userRoleSelector, value: 'ADMIN' }]
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component instance', () => {
    expect(component).toBeTruthy();
  });
});
