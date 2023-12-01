import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserNotificationsComponent } from './user-notifications.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from 'src/app/main/i18n/Language';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('UserNotificationsComponent', () => {
  let component: UserNotificationsComponent;
  let fixture: ComponentFixture<UserNotificationsComponent>;
  const translateMock = {
    use() {
      return of();
    },
    get() {
      return of();
    }
  };
  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'languageBehaviourSubject',
    'getCurrentLanguage',
    'getUserId'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
  localStorageServiceMock.languageSubject = of('en');
  localStorageServiceMock.getUserId = () => 1;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UserNotificationsComponent, TranslatePipeMock],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: TranslateService, useValue: translateMock },
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
