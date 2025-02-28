import { ComponentFixture, TestBed, fakeAsync, flush, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CustomTooltipDirective } from './custom-tooltip.directive';

@Component({
  template: `<div appCustomTooltip [appCustomTooltip]="tooltipContent" [tooltip]="tooltip" [font]="font"></div>`
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTooltipDirective, TestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directiveElement = fixture.debugElement.query(By.directive(CustomTooltipDirective));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind tooltipContent property', () => {
    const directiveInstance = directiveElement.injector.get(CustomTooltipDirective);
    expect(directiveInstance.tooltipContent).toEqual(component.tooltipContent);
  });

  it('should apply directive to element with appCustomTooltip selector', () => {
    const element = fixture.nativeElement.querySelector('[appCustomTooltip]');
    expect(element).toBeTruthy();
  });

  it('should hide tooltip on mouse leave', () => {
    directiveElement.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
    expect(component.tooltip.hide).toHaveBeenCalled();
  });

  it('should not show tooltip if text fits within container width', fakeAsync(() => {
    const mockEvent = {
      target: {
        offsetWidth: 300,
        innerText: 'Short text'
      },
      stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation')
    } as any as MouseEvent;

    directiveElement.triggerEventHandler('mouseenter', mockEvent);
    flush();
    fixture.detectChanges();

    expect(component.tooltip.hide).toHaveBeenCalled();
    expect(component.tooltip.showTooltip).not.toHaveBeenCalled();
  }));

  it('should show tooltip if text exceeds container width', fakeAsync(() => {
    const eventMock = {
      stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation'),
      type: 'mouseenter',
      target: {
        offsetWidth: 100,
        innerText: 'Very long text that exceeds the container width'
      }
    };

    const tooltipMock = {
      show: jasmine.createSpy('show'),
      hide: jasmine.createSpy('hide')
    };

    const directiveInstance = directiveElement.injector.get(CustomTooltipDirective);
    const calculateTextWidthSpy = spyOn(directiveInstance, 'calculateTextWidth').and.callThrough();
    directiveInstance.tooltip = tooltipMock;

    directiveElement.triggerEventHandler('mouseenter', eventMock);
    flush();

    expect(calculateTextWidthSpy).toHaveBeenCalled();
    expect(tooltipMock.show).toHaveBeenCalled();
    expect(tooltipMock.hide).not.toHaveBeenCalled();
  }));
});
