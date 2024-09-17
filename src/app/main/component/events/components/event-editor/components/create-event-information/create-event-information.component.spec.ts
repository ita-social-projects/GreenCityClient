import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreateEventInformationComponent } from './create-event-information.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { ContentChange, QuillModule } from 'ngx-quill';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBridgeService } from '../../../../services/form-bridge.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from '../../../../../../i18n/Language';

describe('CreateEventInformationComponent', () => {
  let component: CreateEventInformationComponent;
  let fixture: ComponentFixture<CreateEventInformationComponent>;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let formBridgeServiceSpy: jasmine.SpyObj<FormBridgeService>;

  beforeEach(waitForAsync(() => {
    const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
    const formBridgeServiceMock = jasmine.createSpyObj('FormBridgeService', ['']);
    TestBed.configureTestingModule({
      declarations: [CreateEventInformationComponent],
      imports: [
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatSelectModule,
        MatChipsModule,
        QuillModule,
        MatSnackBarModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: FormBridgeService, useValue: formBridgeServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    formBridgeServiceSpy = TestBed.inject(FormBridgeService) as jasmine.SpyObj<FormBridgeService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return quillDefault if quillLength is less than 1', () => {
    component.quillLength = 0;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    expect(component.quillLabel).toBe('');
  });

  it('should return quillError if quillLength is less than minLength', () => {
    component.quillLength = 15;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    expect(component.quillLabel).toBe('Not enough characters. Left: 5');
  });

  it('should set initial form values if formInput is provided', () => {
    const formInput = {
      title: 'Test',
      duration: 5,
      description: 'Desc',
      editorText: 'text',
      open: true,
      tags: ['Test'],
      images: []
    };
    component.formInput = formInput;
    component.ngOnInit();
    expect(component.eventInfForm.value).toEqual(formInput);
  });

  it('should call formBridgeService on duration value change', () => {
    const durationValue = 5;
    component.eventInfForm.get('duration').setValue(durationValue);
    expect(formBridgeServiceSpy.days).toEqual(Array(durationValue));
  });

  it('should set form value if formInput is provided', () => {
    const formInput = {
      title: 'Test',
      duration: 1,
      description: 'Test',
      editorText: '',
      open: true,
      tags: ['Social'],
      images: []
    };
    component.formInput = formInput;
    component.ngOnInit();

    expect(component.eventInfForm.value).toEqual(formInput);
  });

  it('should set description value in form', () => {
    const content = { text: 'New description' } as ContentChange;
    component.quillContentChanged(content);
    expect(component.eventInfForm.get('description')?.value).toBe(content.text.trimEnd());
  });

  it('should return quillError with remaining characters needed when quillLength is less than minLength', () => {
    component.quillLength = 10;
    spyOn(component, 'getLocale').and.returnValue('Not enough characters. Left:');
    expect(component.quillLabel).toBe('Not enough characters. Left: 10');
  });

  it('should return quillMaxExceeded when quillLength exceeds maxLength', () => {
    component.quillLength = 63210;
    spyOn(component, 'getLocale').and.returnValue('Error: Max length exceeded by');
    expect(component.quillLabel).toBe('Error: Max length exceeded by 4');
  });

  it('should update quillLength and form value on content change', () => {
    const content = { text: 'New content here' } as ContentChange;
    component.quillContentChanged(content);
    expect(component.quillLength).toBe(content.text.length - 1);
    expect(component.eventInfForm.get('description').value).toBe(content.text.trimEnd());
  });

  it('should set formInput value on initialization', () => {
    const testInput = {
      title: 'Test Event',
      duration: 1,
      description: 'Description',
      editorText: '',
      open: true,
      tags: ['Social'],
      images: []
    };
    component.formInput = testInput;
    component.ngOnInit();
    expect(component.eventInfForm.value).toEqual(testInput);
  });

  it('should return quillDefault when quillLength is less than 1', () => {
    component.quillLength = 0;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    spyOn(component, 'getLocale').and.callThrough();
    expect(component.quillLabel).toBe('');
    expect(component.getLocale).toHaveBeenCalledWith('quillDefault');
  });

  it('should return quillError when quillLength is less than minLength', () => {
    component.quillLength = 15;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    spyOn(component, 'getLocale').and.callThrough();
    expect(component.quillLabel).toBe('Not enough characters. Left: 5');
    expect(component.getLocale).toHaveBeenCalledWith('quillError');
  });

  it('should return quillMaxExceeded when quillLength exceeds maxLength', () => {
    component.quillLength = 63207;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    spyOn(component, 'getLocale').and.callThrough();
    expect(component.quillLabel).toBe('The maximum character length is greater than 1');
    expect(component.getLocale).toHaveBeenCalledWith('quillMaxExceeded');
  });

  it('should return quillValid when quillLength is within valid range', () => {
    component.quillLength = 50;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    spyOn(component, 'getLocale').and.callThrough();
    expect(component.quillLabel).toBe('Number of characters: 50');
    expect(component.getLocale).toHaveBeenCalledWith('quillValid');
  });
});
