// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component, DebugElement } from '@angular/core';
// import { By } from '@angular/platform-browser';
// import { CustomTooltipDirective } from './custom-tooltip.directive';

// class TooltipServiceMock {
//   showTooltip() {}
//   hide() {}
// }

// @Component({
//   template: ` <div [appCustomTooltip]="tooltipContent" [tooltip]="tooltipService" [font]="font"></div> `
// })
// class TestComponent {
//   tooltipContent = 'This is a tooltip';
//   tooltipService = new TooltipServiceMock();
//   font = '12px Arial';
// }

// describe('CustomTooltipDirective', () => {
//   let component: TestComponent;
//   let fixture: ComponentFixture<TestComponent>;
//   let directiveElement: DebugElement;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [CustomTooltipDirective, TestComponent]
//     });

//     fixture = TestBed.createComponent(TestComponent);
//     component = fixture.componentInstance;
//     directiveElement = fixture.debugElement.query(By.directive(CustomTooltipDirective));

//     fixture.detectChanges();
//   });

//   it('should create tooltip on mouseover', () => {
//     const hostElement = directiveElement.query(By.directive(CustomTooltipDirective)).nativeElement;
//     hostElement.dispatchEvent(new MouseEvent('mouseover'));
//     fixture.detectChanges();
//     const tooltipElement = hostElement.querySelector('.tooltipClass');
//     expect(tooltipElement).toBeTruthy();
//   });

//   it('should hide tooltip on mouse leave', () => {
//     const tooltipSpy = spyOn(component.tooltipService, 'hide');
//     directiveElement.triggerEventHandler('mouseleave', new MouseEvent('mouseleave', { bubbles: true }));

//     fixture.detectChanges();

//     expect(tooltipSpy).toHaveBeenCalled();
//   });
// });

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
});
