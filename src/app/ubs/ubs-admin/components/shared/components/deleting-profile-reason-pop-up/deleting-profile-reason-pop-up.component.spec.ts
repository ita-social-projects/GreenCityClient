/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeletingProfileReasonPopUpComponent } from './deleting-profile-reason-pop-up.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { of } from 'rxjs';

describe('DeletingProfileReasonPopUpComponent', () => {
  let component: DeletingProfileReasonPopUpComponent;
  let fixture: ComponentFixture<DeletingProfileReasonPopUpComponent>;

  const languageServiceMock = jasmine.createSpyObj('LanguageService', ['getLangValue']);
  languageServiceMock.getLangValue = () => {};
  languageServiceMock.getCurrentLangObs = () => of('ua');

  const MatDialogRefMock = {
    close: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeletingProfileReasonPopUpComponent, LangValueDirective],
      imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: MatDialogRef, useValue: MatDialogRefMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletingProfileReasonPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
