import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragAndDropDirective } from './drag-and-drop.directive';

@Component({
  template: `<div appDragAndDrop>Hello</div>`
})
export class TestContainerComponent {}

describe('DragAndDropDirective', () => {
  let component: TestContainerComponent;
  let fixture: ComponentFixture<TestContainerComponent>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestContainerComponent, DragAndDropDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestContainerComponent);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement.querySelector('div');

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new TestContainerComponent();
    expect(directive).toBeTruthy();
  });

  it('should trigger dragover', () => {
    const event = new Event('dragover', { bubbles: true });
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');
    nativeEl.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should trigger dragleave', () => {
    const event = new Event('dragleave', { bubbles: true });
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');
    nativeEl.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should trigger drop', () => {
    const dataTransfer = new DataTransfer();
    const file = new File(['some content'], 'text-file.txt');
    dataTransfer.items.add(file);
    const event: DragEvent = new DragEvent('drop', { dataTransfer, bubbles: true });

    nativeEl.dispatchEvent(event);
    expect(event.dataTransfer.files.length).toBeTruthy();
  });
});
