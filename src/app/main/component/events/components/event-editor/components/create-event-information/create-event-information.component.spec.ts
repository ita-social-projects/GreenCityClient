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

xdescribe('CreateEventInformationComponent', () => {
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

  it('should handle content length less than minLength', () => {
    const content = { text: 'Short text' } as ContentChange;
    component.quillContentChanged(content);
    expect(component.quillLength).toBe(content.text.length);
    expect(component.isQuillUnfilled).toBe(true);
  });

  it('should handle content length more than maxLength', () => {
    const content = { text: 'A'.repeat(63207) } as ContentChange;
    component.quillContentChanged(content);
    expect(component.quillLength).toBe(content.text.length);
    expect(component.isQuillUnfilled).toBe(true);
  });

  it('should handle content length between minLength and maxLength', () => {
    const content = { text: 'A'.repeat(30) } as ContentChange;
    component.quillContentChanged(content);
    expect(component.quillLength).toBe(content.text.length);
    expect(component.isQuillUnfilled).toBe(false);
  });

  it('should return quillDefault if quillLength is less than 1', () => {
    component.quillLength = 0;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    expect(component.quillLabel).toBe('');
  });

  it('should return quillError if quillLength is less than minLength', () => {
    component.quillLength = 15;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    expect(component.quillLabel).toBe('Not enough characters. Left:  5');
  });

  it('should return quillError if quillLength is more than maxLength', () => {
    component.quillLength = 63207;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    expect(component.quillLabel).toBe('Number of characters: 1');
  });

  it('should return quillValid if quillLength is between minLength and maxLength', () => {
    component.quillLength = 30;
    localStorageServiceSpy.getCurrentLanguage.and.returnValue(Language.EN);
    expect(component.quillLabel).toBe('Number of characters: 63176');
  });

  it('should set initial form values if formInput is provided', () => {
    const formInput = { title: 'Test', duration: 5, description: 'Desc', editorText: 'text', open: true, tags: ['Test'], images: [] };
    component.formInput = formInput;
    component.ngOnInit();
    expect(component.eventInfForm.value).toEqual(formInput);
  });

  it('should call formBridgeService on duration value change', () => {
    const durationValue = 5;
    component.eventInfForm.get('duration').setValue(durationValue);
    expect(formBridgeServiceSpy.days).toEqual(Array(durationValue));
  });
});
