import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CustomTooltipDirective } from './custom-tooltip.directive';

class TooltipServiceMock {
  show() {}
  hide() {}
}

@Component({
  template: ` <div [appCustomTooltip]="tooltipContent" [tooltip]="tooltipService" [font]="font"></div> `
})
class TestComponent {
  tooltipContent = 'This is a tooltip';
  tooltipService = new TooltipServiceMock();
  font = '16px Arial';
}

describe('CustomTooltipDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTooltipDirective, TestComponent]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(CustomTooltipDirective));

    fixture.detectChanges();
  });

  it('should hide tooltip on mouse leave', () => {
    const tooltipSpy = spyOn(component.tooltipService, 'hide');
    directiveElement.triggerEventHandler('mouseleave', new MouseEvent('mouseleave', { bubbles: true }));

    fixture.detectChanges();

    expect(tooltipSpy).toHaveBeenCalled();
  });
});
