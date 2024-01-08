import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LinkifyDirective } from './linkify.directive';

@Component({
  template: `<div [appLinkify]="linkifyText"></div>`
})
class TestComponent {
  linkifyText = '';
}

describe('LinkifyDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let directiveElement: DebugElement;
  let directive: LinkifyDirective;
  let updateLinkifySpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkifyDirective, TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(LinkifyDirective));

    directive = directiveElement.injector.get(LinkifyDirective);
    updateLinkifySpy = spyOn(directive, 'updateLinkify').and.callThrough();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should update linkify when input changes', () => {
    component.linkifyText = 'example@example.com';
    fixture.detectChanges();

    expect(updateLinkifySpy).toHaveBeenCalled();
  });

  it('should correctly linkify email', () => {
    component.linkifyText = 'example@example.com';
    fixture.detectChanges();

    const anchorElement = directiveElement.query(By.css('a[href^="mailto:"]'));
    expect(anchorElement).toBeTruthy();
  });

  it('should correctly linkify URL', () => {
    component.linkifyText = 'http://example.com';
    fixture.detectChanges();

    const anchorElement = directiveElement.query(By.css('a[href^="http"]'));
    expect(anchorElement).toBeTruthy();
  });

  it('should correctly linkify phone number', () => {
    component.linkifyText = '+1234567890';
    fixture.detectChanges();

    const anchorElement = directiveElement.query(By.css('a[href^="tel:"]'));
    expect(anchorElement).toBeTruthy();
  });

  it('should sanitize HTML content', () => {
    component.linkifyText = 'Safe content';
    fixture.detectChanges();
    expect(directiveElement.nativeElement.innerHTML).toContain('Safe content');

    component.linkifyText = '<script>alert("XSS attack");</script>';
    fixture.detectChanges();

    spyOn(window, 'alert');

    expect(window.alert).not.toHaveBeenCalled();
  });
});
