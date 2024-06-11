import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputErrorComponent } from './input-error.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';

describe('InputErrorComponent', () => {
  let component: InputErrorComponent;
  let fixture: ComponentFixture<InputErrorComponent>;

  const formElementMock = new FormControl('Text');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InputErrorComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputErrorComponent);
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

  it('should display required error message if form control is empty and isEvent is true', () => {
    component.formElement = new FormControl('', Validators.required);
    component.isEvent = true;
    component.date = false;
    component.getType();
    expect(component.errorMessage).toEqual('create-event.title-required');
  });

  it('should display required error message if form control is empty and isStartEventError, numberDate, date are true', () => {
    component.formElement = new FormControl('', Validators.required);
    component.isStartEventError = true;
    component.numberDate = true;
    component.date = true;
    component.getType();
    expect(component.errorMessage).toEqual('create-event.start-time-end-time-and-datepicker-not-correct');
  });

  it('should display required error message if form control is empty and numberDate, date are true', () => {
    component.formElement = new FormControl('', Validators.required);
    component.numberDate = true;
    component.date = true;
    component.getType();
    expect(component.errorMessage).toEqual('create-event.datepicker-not-correct-date-required');
  });

  it('should display required error message if form control is empty and isStartEventError, date are true', () => {
    component.formElement = new FormControl('', Validators.required);
    component.isStartEventError = true;
    component.date = true;
    component.getType();
    expect(component.errorMessage).toEqual('create-event.start-time-and-end-time-not-correct');
  });

  it('should display required error message if form control is empty and isStartEventError, numberDate are true', () => {
    component.formElement = new FormControl('', Validators.required);
    component.isStartEventError = true;
    component.numberDate = true;
    component.getType();
    expect(component.errorMessage).toEqual('create-event.datepicker-and-start-time-not-correct');
  });

  it('should display required error message if form control is empty and isStartEventError is true', () => {
    component.formElement = new FormControl('', Validators.required);
    component.isStartEventError = true;
    component.getType();
    expect(component.errorMessage).toEqual('create-event.start-time-required');
  });

  it('should display required error message if form control is empty and numberDate is true', () => {
    component.formElement = new FormControl('', Validators.required);
    component.numberDate = true;
    component.getType();
    expect(component.errorMessage).toEqual('create-event.datepicker-not-correct');
  });
});
