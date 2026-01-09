import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ChatModule } from './chat/chat.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { BehaviorSubject, of } from 'rxjs';
import { MetaService } from '@global-service/meta/meta.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SwUpdate } from '@angular/service-worker';

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
  localStorageMock.languageBehaviourSubject = new BehaviorSubject('uk');
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
        { provide: LocalStorageService, useValue: localStorageMock },
        { provide: MetaService, useValue: metaServiceMock },
        { provide: SwUpdate, useValue: {} }
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
