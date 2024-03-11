import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RemoveLeadingZeroDirective } from './remove-leading-zero.directive';

@Component({
  template: ` <input type="text" appRemoveLeadingZero /> `
})
class TestComponent {}

fdescribe('Directive: RemoveLeadingZero', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveLeadingZeroDirective, TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.debugElement.query(By.css('input'));
  });

  it('should remove leading zeros from input value', () => {
    inputElement.nativeElement.value = '00123';
    inputElement.triggerEventHandler('input', { target: inputElement.nativeElement });
    fixture.detectChanges();
    expect(inputElement.nativeElement.value).toBe('123');
  });

  it('should not remove leading zero if input is 0', () => {
    inputElement.nativeElement.value = '0';
    inputElement.triggerEventHandler('input', { target: inputElement.nativeElement });
    fixture.detectChanges();
    expect(inputElement.nativeElement.value).toBe('0');
  });

  it('should remove leading zero if input is 000', () => {
    inputElement.nativeElement.value = '000';
    inputElement.triggerEventHandler('input', { target: inputElement.nativeElement });
    fixture.detectChanges();
    expect(inputElement.nativeElement.value).toBe('0');
  });

  it('should not remove leading zeros if input is empty', () => {
    inputElement.nativeElement.value = '';
    inputElement.triggerEventHandler('input', { target: inputElement.nativeElement });
    fixture.detectChanges();
    expect(inputElement.nativeElement.value).toBe('');
  });

  it('should not remove leading zeros if input is not a number', () => {
    inputElement.nativeElement.value = 'abc123';
    inputElement.triggerEventHandler('input', { target: inputElement.nativeElement });
    fixture.detectChanges();
    expect(inputElement.nativeElement.value).toBe('abc123');
  });

  it('should not remove leading zeros if input is not a number with leading zero', () => {
    inputElement.nativeElement.value = '0abc123';
    inputElement.triggerEventHandler('input', { target: inputElement.nativeElement });
    fixture.detectChanges();
    expect(inputElement.nativeElement.value).toBe('0abc123');
  });
});
