import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Language } from 'src/app/shared/i18n/Language';
import { FooterComponent } from './footer.component';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { BehaviorSubject, Subject } from 'rxjs';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'userIdBehaviourSubject',
    'getCurrentLanguage'
  ]);

  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock.getCurrentLanguage = () => 'uk' as Language;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: LocalStorageService, useValue: localStorageServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
