import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceholderForDivDirective } from './placeholder-for-div.directive';

@Component({
  template: `<div appPlaceholderForDiv [placeholderText]="text"></div>`
})
class TestHostComponent {
  text = 'Placeholder text';
}

describe('PlaceholderForDivDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let divEl: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, PlaceholderForDivDirective]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    divEl = fixture.nativeElement.querySelector('div');
  });

  it('should add placeholder text when blurred', () => {
    divEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(divEl.textContent).toBe('Placeholder text');
  });

  it('should remove placeholder text when focused', () => {
    divEl.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(divEl.textContent).toBe('');
  });

  it('should update placeholder text when input changes', () => {
    fixture.componentInstance.text = 'New placeholder text';
    fixture.detectChanges();
    divEl.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(divEl.textContent).toBe('New placeholder text');
  });
});
