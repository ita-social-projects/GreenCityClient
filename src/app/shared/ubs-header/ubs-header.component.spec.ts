import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Language } from 'src/app/main/i18n/Language';
import { LanguageService } from 'src/app/main/i18n/language.service';

import { UbsHeaderComponent } from './ubs-header.component';

describe('UbsHeaderComponent', () => {
  let component: UbsHeaderComponent;
  let fixture: ComponentFixture<UbsHeaderComponent>;
  const mockLang = 'ua';
  const mockLangId = 1;

  let languageServiceMock: LanguageService;
  languageServiceMock = jasmine.createSpyObj('LanguageService', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage = () => mockLang as Language;
  languageServiceMock.changeCurrentLanguage = () => true;
  languageServiceMock.getLanguageId = () => mockLangId;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsHeaderComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
