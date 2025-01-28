import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressInputComponent } from './address-input.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { LanguageService } from 'src/app/main/i18n/language.service';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLanguage', 'getCurrentLangObs']);
  languageServiceMock.getLangValue.and.returnValue('fakeTag');
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');
  languageServiceMock.getCurrentLangObs.and.returnValue(of('ua'));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressInputComponent],
      imports: [HttpClientTestingModule, StoreModule.forRoot({}), TranslateModule.forRoot(), MatAutocompleteModule, ReactiveFormsModule],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
