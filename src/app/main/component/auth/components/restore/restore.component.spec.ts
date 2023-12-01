import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RestorePasswordService } from '../../../../service/auth/restore-password.service';
import { Language } from './../../../../i18n/Language';
import { LocalStorageService } from '../../../../service/localstorage/local-storage.service';
import { ComponentFixture, TestBed, inject, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { RestoreComponent } from './restore.component';

describe('RestoreComponent', () => {
  let component: RestoreComponent;
  let fixture: ComponentFixture<RestoreComponent>;
  let matDialogMock: MatDialogRef<any>;
  let localStorageServiceMock: LocalStorageService;
  let restorePasswordServiceMock: RestorePasswordService;

  matDialogMock = jasmine.createSpyObj('MatDialogRef', ['close']);
  matDialogMock.close = () => true;

  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;

  restorePasswordServiceMock = jasmine.createSpyObj('RestorePasswordService', ['sendEmailForRestore']);
  restorePasswordServiceMock.sendEmailForRestore = (email, lang) => true;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RestoreComponent],
      imports: [TranslateModule.forRoot(), FormsModule, MatDialogModule, HttpClientTestingModule],
      providers: [{ provide: MatDialogRef, useValue: matDialogMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoud send email', inject([RestorePasswordService], (service: RestorePasswordService) => {
    // @ts-ignore
    const spy = spyOn(service, 'sendEmailForRestore');

    component.sentEmail();
    expect(spy).toHaveBeenCalled();
  }));
});
