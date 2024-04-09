import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UBSInputErrorComponent } from './ubs-input-error.component';
import { FormControl } from '@angular/forms';
import { Patterns } from 'src/assets/patterns/patterns';

describe('ErrorComponent ', () => {
  let component: UBSInputErrorComponent;
  let fixture: ComponentFixture<UBSInputErrorComponent>;
  let httpTestingController: HttpTestingController;

  const formElementMock = new FormControl('місто Київ');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [UBSInputErrorComponent]
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UBSInputErrorComponent);
    component = fixture.componentInstance;
    component.formElement = formElementMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should call getType method', () => {
    const spy = spyOn(component, 'getType');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('method ngOnInit should call getType method when control value was changed', fakeAsync(() => {
    const spy = spyOn(component, 'getType');
    component.ngOnInit();
    component.formElement.updateValueAndValidity({ emitEvent: true });
    tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('errorMessage should have correct value if we have maxlength error in "Entrance" field', () => {
    Object.assign(component, { formElement: { errors: { maxlength: { requiredLength: 2 } } } });
    fixture.detectChanges();
    component.getType();
    expect(component.errorMessage).toBe('input-error.max-length-entrance');
  });

  it('errorMessage should have correct value if we have maxlength error in "House number" field', () => {
    Object.assign(component, { formElement: { errors: { maxlength: { requiredLength: 4 } } } });
    fixture.detectChanges();
    component.getType();
    expect(component.errorMessage).toBe('input-error.max-length-house-corpus');
  });

  it('errorMessage should have correct value if we have maxlength error in "Street" field', () => {
    Object.assign(component, { formElement: { errors: { maxlength: { requiredLength: 120 } } } });
    fixture.detectChanges();
    component.getType();
    expect(component.errorMessage).toBe('input-error.max-length-street');
  });

  it('errorMessage should have correct value if we have maxlength error in "Comment address" field', () => {
    Object.assign(component, { formElement: { errors: { maxlength: { requiredLength: 255 } } } });
    fixture.detectChanges();
    component.getType();
    expect(component.errorMessage).toBe('input-error.max-length-comment');
  });

  it('errorMessage should have correct value if we have required error', () => {
    Object.assign(component, { formElement: { errors: { required: true } } });
    fixture.detectChanges();
    component.getType();
    expect(component.errorMessage).toBe('input-error.required');
  });

  it('getType should have call method for setting correct maxlength error', () => {
    const spy = spyOn(component, 'getMaxlengthErrorMessage');
    Object.assign(component, { formElement: { errors: { maxlength: { requiredLength: 255 } } } });
    fixture.detectChanges();
    component.getType();
    expect(spy).toHaveBeenCalled();
  });

  it('getType should have call method for setting correct pattern error', () => {
    const spy = spyOn(component, 'getPatternErrorMessage');
    Object.assign(component, { formElement: { errors: { pattern: { requiredPattern: 'fake' } } } });
    fixture.detectChanges();
    component.getType();
    expect(spy).toHaveBeenCalled();
  });

  it('getPatternErrorMessage should have return correct error for wrong city input', () => {
    const pattern = Patterns.ubsWithDigitPattern.toString();
    const result = component.getPatternErrorMessage(pattern);
    expect(result).toEqual('input-error.city-wrong');
  });

  it('getPatternErrorMessage should have return correct error for wrong name input', () => {
    const pattern = Patterns.NamePattern.toString();
    const result = component.getPatternErrorMessage(pattern);
    expect(result).toEqual('input-error.name-wrong');
  });

  it('getPatternErrorMessage should have return correct error for wrong number input', () => {
    const pattern = Patterns.adminPhone.toString();
    const result = component.getPatternErrorMessage(pattern);
    expect(result).toEqual('input-error.number-wrong');
  });

  it('getPatternErrorMessage should have return correct error for wrong email input', () => {
    const pattern = Patterns.ubsMailPattern.toString();
    const result = component.getPatternErrorMessage(pattern);
    expect(result).toEqual('input-error.email-wrong');
  });

  it('getPatternErrorMessage should have return default error', () => {
    const pattern = null;
    const result = component.getPatternErrorMessage(pattern);
    expect(result).toEqual('input-error.pattern');
  });
});
