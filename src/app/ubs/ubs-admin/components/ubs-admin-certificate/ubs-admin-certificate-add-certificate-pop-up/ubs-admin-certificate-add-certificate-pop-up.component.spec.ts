import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { UbsAdminCertificateAddCertificatePopUpComponent } from './ubs-admin-certificate-add-certificate-pop-up.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IMaskModule } from 'angular-imask';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Injectable } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from 'src/app/main/i18n/Language';

@Injectable()
class TranslationServiceStub {
  public onLangChange = new EventEmitter<any>();
  public onTranslationChange = new EventEmitter<any>();
  public onDefaultLangChange = new EventEmitter<any>();
  public addLangs(langs: string[]) {}
  public getLangs() {
    return 'en-us';
  }
  public getBrowserLang() {
    return '';
  }
  public getBrowserCultureLang() {
    return '';
  }
  public use(lang: string) {
    return '';
  }
  public get(key: any): any {
    return of(key);
  }
  public setDefaultLang() {
    return true;
  }
}

describe('UbsAdminCertificateAddCertificatePopUpComponent', () => {
  let component: UbsAdminCertificateAddCertificatePopUpComponent;
  let fixture: ComponentFixture<UbsAdminCertificateAddCertificatePopUpComponent>;
  let httpMock: HttpTestingController;
  const mockLang = 'ua';

  const translateServiceMock: TranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of();
  translateServiceMock.get = () => of(true);
  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock.getCurrentLanguage = () => mockLang as Language;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCertificateAddCertificatePopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, HttpClientTestingModule, ReactiveFormsModule, IMaskModule],
      providers: [
        UntypedFormBuilder,
        { provide: MatDialogRef, useValue: {} },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: TranslateService, useClass: TranslationServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCertificateAddCertificatePopUpComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    component.monthCountDisabled = false;
    component.pointsValueDisabled = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should be called', () => {
    const spyOnInit = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spyOnInit).toHaveBeenCalled();
  });

  it(`initForm should be called in ngOnInit`, () => {
    spyOn(component as any, 'initForm');
    component.ngOnInit();
    expect(component.initForm).toHaveBeenCalled();
  });

  it('ngOnInit should called subscribeToLangChange method one time', () => {
    const subscribeToLangChangeSpy = spyOn(component as any, 'subscribeToLangChange');
    component.ngOnInit();
    expect(subscribeToLangChangeSpy).toHaveBeenCalledTimes(1);
  });

  it('component should initialize from with correct parameters', () => {
    component.initForm();
    expect(component.addCertificateForm.get('code').value).toEqual('');
    expect(component.addCertificateForm.get('monthCount').value).toEqual('');
    expect(component.addCertificateForm.get('initialPointsValue').value).toEqual('');
  });

  it('valueChangeMonthCount should be call', () => {
    spyOn(component, 'valueChangeMonthCount');
    const newValue = '0';
    component.valueChangeMonthCount(newValue);
    expect(component.valueChangeMonthCount).toHaveBeenCalled();
    expect(component.valueChangeMonthCount).toHaveBeenCalledWith(newValue);
  });

  it('valueChangePointsValue should be call', () => {
    spyOn(component, 'valueChangePointsValue');
    const newValue = '0';
    component.valueChangePointsValue(newValue);
    expect(component.valueChangePointsValue).toHaveBeenCalled();
    expect(component.valueChangePointsValue).toHaveBeenCalledWith(newValue);
  });

  it('should check if monthCount contains only null', () => {
    const newValue = '0';
    component.valueChangeMonthCount(newValue);
    expect(component.monthCountDisabled).toBeTruthy();
  });

  it('should check if pointValue contains only null', () => {
    const newValue = '0';
    component.valueChangePointsValue(newValue);
    expect(component.pointsValueDisabled).toBeTruthy();
  });

  it('should check if monthCount contains not null', () => {
    const newValue = '10';
    component.valueChangeMonthCount(newValue);
    expect(component.monthCountDisabled).toBeFalsy();
  });

  it('should check if pointValue contains not null', () => {
    const newValue = '10';
    component.valueChangePointsValue(newValue);
    expect(component.pointsValueDisabled).toBeFalsy();
  });

  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => {});
    fixture.destroy();
  });

  it('method getErrorMessage should return correct error message key - required', () => {
    const formControlMock = { errors: { required: true } } as unknown as AbstractControl;
    const result = component.getErrorMessage(formControlMock);

    expect(result).toBe('add-new-certificate.field-not-empty');
  });

  it('method getErrorMessage Key should return correct error message key - pattern', () => {
    const formControlMock = { errors: { pattern: true } } as unknown as AbstractControl;
    const nameMock = 'code';
    const result = component.getErrorMessage(formControlMock, nameMock);

    expect(result).toBe('add-new-certificate.сertificate-field-format');
  });

  it('method getErrorMessage Key should return correct error message key - max', () => {
    const formControlMock = { errors: { max: true } } as unknown as AbstractControl;
    const nameMock = 'monthCount';
    const result = component.getErrorMessage(formControlMock, nameMock);

    expect(result).toBe('add-new-certificate.duration-field-format');
  });

  it('method getErrorMessage Key should return correct error message key - min', () => {
    const formControlMock = { errors: { min: true } } as unknown as AbstractControl;
    const nameMock = 'monthCount';
    const result = component.getErrorMessage(formControlMock, nameMock);

    expect(result).toBe('add-new-certificate.duration-field-format');
  });

  it('method getErrorMessage Key should return correct error message key - min', () => {
    const formControlMock = { errors: { min: true } } as unknown as AbstractControl;
    const nameMock = 'initialPointsValue';
    const result = component.getErrorMessage(formControlMock, nameMock);

    expect(result).toBe('add-new-certificate.discount-field-format');
  });

  it('method getErrorMessage Key should return correct error message key - min', () => {
    const formControlMock = { errors: { max: true } } as unknown as AbstractControl;
    const nameMock = 'initialPointsValue';
    const result = component.getErrorMessage(formControlMock, nameMock);

    expect(result).toBe('add-new-certificate.discount-field-format');
  });
});
