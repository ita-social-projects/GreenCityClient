import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsUserAgreementComponent } from './ubs-user-agreement.component';
import { of } from 'rxjs';
import { UserAgreementService } from '@ubs/ubs/services/user-agreement/user-agreement.service';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from 'src/app/main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

const mockUserAgreement = {
  textUa: 'textUa',
  textEn: 'textEn'
};

describe('UbsUserAgreementComponent', () => {
  let component: UbsUserAgreementComponent;
  let fixture: ComponentFixture<UbsUserAgreementComponent>;
  let mockUserAgreementService: jasmine.SpyObj<UserAgreementService>;
  let mockLanguageService: jasmine.SpyObj<LanguageService>;
  let mockLocalStorageService: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    mockUserAgreementService = jasmine.createSpyObj<UserAgreementService>('UserAgreementService', ['getUserAgreement']);
    mockUserAgreementService.getUserAgreement.and.returnValue(of(mockUserAgreement));

    mockLanguageService = jasmine.createSpyObj<LanguageService>('LanguageService', ['getCurrentLangObs', 'getLangValue']);
    mockLanguageService.getCurrentLangObs.and.returnValue(of(Language.UA));
    mockLanguageService.getLangValue.and.returnValue('UA');

    mockLocalStorageService = jasmine.createSpyObj<LocalStorageService>('LocalStorageService', ['getCurrentLanguage']);
    mockLocalStorageService.getCurrentLanguage.and.returnValue(Language.UA);

    TestBed.configureTestingModule({
      declarations: [UbsUserAgreementComponent, LangValueDirective],
      providers: [
        { provide: UserAgreementService, useValue: mockUserAgreementService },
        { provide: LanguageService, useValue: mockLanguageService },
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ]
    });
    fixture = TestBed.createComponent(UbsUserAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user agreement', () => {
    expect(component.userAgreement).toEqual(mockUserAgreement);
  });
});
