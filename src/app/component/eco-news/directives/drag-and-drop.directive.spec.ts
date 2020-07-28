import { DragAndDropDirective } from './drag-and-drop.directive';

describe('DragAndDropDirective', () => {
  it('should create an instance', () => {
    const sanitizer = jasmine.createSpyObj('sanitizer', []);
    const directive = new DragAndDropDirective(sanitizer);
    expect(directive).toBeTruthy();
  });
});
