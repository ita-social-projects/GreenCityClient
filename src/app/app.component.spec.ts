import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ChatsService } from './chat/service/chats/chats.service';
import { ChatModule } from './chat/chat.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject, of } from 'rxjs';
import { CommonService } from './chat/service/common/common.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const localStorageMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject', 'getAccessToken']);
  localStorageMock.userIdBehaviourSubject = () => of(1);
  localStorageMock.getAccessToken = () => 1;
  const chatsServiceMock = jasmine.createSpyObj('ChatsService', ['isSupportChat$']);
  chatsServiceMock.isSupportChat$ = new BehaviorSubject(true);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ChatModule],
      providers: [
        provideMockStore(),
        { provide: ChatsService, useValue: chatsServiceMock },
        { provide: CommonService, useValue: {} },
        { provide: LocalStorageService, useValue: localStorageMock }
      ],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
