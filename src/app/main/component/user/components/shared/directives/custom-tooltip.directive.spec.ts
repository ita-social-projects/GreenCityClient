import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CustomTooltipDirective } from './custom-tooltip.directive';

@Component({
  template: `<div appCustomTooltip [tooltipContent]="tooltipContent" [tooltip]="tooltip" [font]="font"></div>`
})
class TestComponent {
  tooltipContent = 'Test Tooltip';
  tooltip = {
    showTooltip: jasmine.createSpy('showTooltip'),
    hide: jasmine.createSpy('hide')
  };
  font = '16px Arial';
}

describe('CustomTooltipDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTooltipDirective, TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(CustomTooltipDirective));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply to elements with appCustomTooltip selector', () => {
    const fixture = TestBed.createComponent(TestComponent);
    const element = fixture.nativeElement.querySelector('[appCustomTooltip]');
    expect(element).toBeTruthy();
    const directive = fixture.debugElement.query(By.directive(CustomTooltipDirective)).injector;
    expect(directive).toBeTruthy();
  });

  it('should hide tooltip on mouse enter if text width does not exceed container width', () => {
    const eventMock = { target: { offsetWidth: 200, innerText: 'Some text' } };
    directiveElement.triggerEventHandler('mouseenter', eventMock);
    fixture.detectChanges();
    expect(component.tooltip.hide).toHaveBeenCalled();
  });

  it('should hide tooltip on mouse leave', () => {
    directiveElement.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
    expect(component.tooltip.hide).toHaveBeenCalled();
  });

  it('should show tooltip when mouse enters with wide text', () => {
    const eventMock = {
      target: { offsetWidth: 200, innerText: 'Some text Some text Some text Some text Some text Some text Some text Some text' }
    };
    const tooltip = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    };
    directiveElement.triggerEventHandler('mouseenter', eventMock);
    fixture.detectChanges();
    component.tooltip.showTooltip(eventMock, tooltip, component.font);
    fixture.detectChanges();
    expect(tooltip.show).not.toHaveBeenCalled();
  });
});
