import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ChatsService } from './chat/service/chats/chats.service';
import { ChatModule } from './chat/chat.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { BehaviorSubject, of } from 'rxjs';
import { CommonService } from './chat/service/common/common.service';
import { MetaService } from '@global-service/meta/meta.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const localStorageMock = jasmine.createSpyObj('LocalStorageService', [
    'userIdBehaviourSubject',
    'getAccessToken',
    'languageBehaviourSubject',
    'getCurrentLanguage'
  ]);
  localStorageMock.userIdBehaviourSubject = of(null);
  localStorageMock.getAccessToken = () => null;
  localStorageMock.languageBehaviourSubject = new BehaviorSubject('ua');
  const chatsServiceMock = jasmine.createSpyObj('ChatsService', ['isSupportChat$']);
  chatsServiceMock.isSupportChat$ = new BehaviorSubject(true);
  const metaServiceMock = jasmine.createSpyObj('MetaService', ['setMetaOnRouteChange']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ChatModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        provideMockStore(),
        { provide: ChatsService, useValue: chatsServiceMock },
        { provide: CommonService, useValue: {} },
        { provide: LocalStorageService, useValue: localStorageMock },
        { provide: MetaService, useValue: metaServiceMock }
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
