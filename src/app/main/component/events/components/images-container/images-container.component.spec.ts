import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesContainerComponent } from './images-container.component';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { FileHandle } from 'src/app/ubs/ubs-admin/models/file-handle.model';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { CdkDragEnter, CdkDrag, DragDropModule, moveItemInArray, CdkDragMove, CdkDragDrop } from '@angular/cdk/drag-drop';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
interface ElementWithStyle extends Element {
  style: CSSStyleDeclaration;
}

describe('ImagesContainerComponent', () => {
  let component: ImagesContainerComponent;
  let fixture: ComponentFixture<ImagesContainerComponent>;

  const files: FileHandle[] = [
    { url: 'http://', file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' }) },
    { url: 'http://', file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' }) }
  ];

  const dataFileMock = new File([''], 'test-file.jpeg');
  const event = { target: { files: [dataFileMock] } };

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImagesContainerComponent, TranslatePipeMock],
      providers: [{ provide: MatSnackBarComponent, useValue: MatSnackBarMock }],
      imports: [DragDropModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit expect initImages should be call', () => {
    const spy = spyOn(component as any, 'initImages');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('initImages images length to be 2', () => {
    component.images = [];
    (component as any).maxImages = 2;
    (component as any).initImages();
    expect(component.images.length).toBe(2);
  });

  it('checkFileExtension', () => {
    (component as any).checkFileExtension(new File([''], 'test-file.jpg'));
    expect((component as any).isImageTypeError).toBe(true);
  });

  it('filesDropped expect transferFile should be called once', () => {
    const spy1 = spyOn(component as any, 'transferFile');

    (component as any).filesDropped(files);

    expect(spy1).toHaveBeenCalledTimes(1);
  });

  it('transferFile expect imgArray.length to be 1', () => {
    (component as any).imgArray = [];
    (component as any).transferFile(files[0].file);
    component.editMode = true;

    expect((component as any).imgArray.length).toBe(1);
    console.log(component.editMode);
  });

  it('assignImage expect images.src to be imageSrc', () => {
    (component as any).assignImage('imageSrc');
    expect(component.images[0].src).toBe('imageSrc');
  });

  it('deleteImage expect images.src to be falcy ', () => {
    component.images = [
      { isLabel: false, label: '+', src: 'imageSrc' },
      { isLabel: true, label: '+', src: null }
    ];
    component.deleteImage(0);
    expect(component.images[0].src).toBeFalsy();
  });

  it('loadFile expect  transferFile should be called with specified argument', () => {
    const transferFileSpy = spyOn(component as any, 'transferFile');
    component.loadFile(event as any);
    expect(transferFileSpy).toHaveBeenCalledWith(dataFileMock);
  });

  it('should move item in the array when drag entered', () => {
    component.images = [
      { src: null, label: '+', isLabel: true },
      { src: null, label: '+', isLabel: false },
      { src: null, label: '+', isLabel: false },
      { src: null, label: '+', isLabel: false },
      { src: null, label: '+', isLabel: false }
    ];

    const dragIndex = 1;
    const dropIndex = 2;
    const dropListMock: any = {
      data: dropIndex,
      element: {
        nativeElement: document.createElement('div')
      }
    };
    const dropEvent: CdkDragEnter<number, number> = {
      container: dropListMock,
      item: {
        data: dragIndex
      } as CdkDrag<number>,
      currentIndex: dragIndex
    };

    component.dragEntered(dropEvent);

    expect(component.dragDropInfo.dragIndex).toBe(dragIndex);
    expect(component.dragDropInfo.dropIndex).toBe(dropIndex);

    const expectedImages = [
      { src: null, label: '+', isLabel: true },
      { src: null, label: '+', isLabel: false },
      { src: null, label: '+', isLabel: false },
      { src: null, label: '+', isLabel: false },
      { src: null, label: '+', isLabel: false }
    ];
    expect(component.images).toEqual(expectedImages);
  });

  it('should reset properties when drop event occurs', () => {
    const dropEvent: CdkDragDrop<number> = {
      previousIndex: 1,
      currentIndex: 2,
      item: {} as any,
      container: undefined,
      previousContainer: undefined,
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 }
    };
    component.dropListReceiverElement = document.createElement('div');
    component.dragDropInfo = { dragIndex: 1, dropIndex: 2 };

    component.dragDropped(dropEvent);

    expect(component.dropListReceiverElement).toBeUndefined();
    expect(component.dragDropInfo).toBeUndefined();
    expect(component.dropListReceiverElement?.style.getPropertyValue('display')).toBeFalsy();
  });

  it('should not modify properties if dropListReceiverElement is undefined', () => {
    const dropEvent: CdkDragDrop<number> = {
      previousIndex: 1,
      currentIndex: 2,
      item: {} as any,
      container: undefined,
      previousContainer: undefined,
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 }
    };
    component.dropListReceiverElement = undefined;
    component.dragDropInfo = { dragIndex: 1, dropIndex: 2 };
    component.dragDropped(dropEvent);

    expect(component.dropListReceiverElement).toBeUndefined();
    expect(component.dragDropInfo).toEqual({ dragIndex: 1, dropIndex: 2 });
  });
});
