import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CustomTooltipDirective } from './custom-tooltip.directive';

@Component({
  template: `<div [appCustomTooltip]="tooltipText">Hover me</div>`
})
class TestComponent {
  tooltipText: string = 'Test Text';
}

describe('CustomTooltipDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, CustomTooltipDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create tooltip on mouseover', () => {
    const hostElement = debugElement.query(By.directive(CustomTooltipDirective)).nativeElement;
    hostElement.dispatchEvent(new MouseEvent('mouseover'));
    fixture.detectChanges();
    const tooltipElement = hostElement.querySelector('.tooltipClass');
    expect(tooltipElement).toBeTruthy();
  });

  it('should remove tooltip on mouseout', () => {
    const hostElement = debugElement.query(By.directive(CustomTooltipDirective)).nativeElement;
    hostElement.dispatchEvent(new MouseEvent('mouseover'));
    fixture.detectChanges();
    hostElement.dispatchEvent(new MouseEvent('mouseout'));
    fixture.detectChanges();
    const tooltipElement = hostElement.querySelector('.tooltipClass');
    expect(tooltipElement).toBeFalsy();
  });
});
