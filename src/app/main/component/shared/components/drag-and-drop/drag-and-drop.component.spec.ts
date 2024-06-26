import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DragAndDropComponent } from './drag-and-drop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { DragAndDropDirective } from '../../../eco-news/directives/drag-and-drop.directive';

describe('DragAndDropComponent', () => {
  let component: DragAndDropComponent;
  let fixture: ComponentFixture<DragAndDropComponent>;

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  const imageCroppedEventMock: ImageCroppedEvent = {
    base64: 'test',
    width: 200,
    height: 200,
    cropperPosition: null,
    imagePosition: null,
    offsetImagePosition: null
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DragAndDropComponent, DragAndDropDirective],
      imports: [ImageCropperModule, FormsModule, HttpClientTestingModule, TranslateModule.forRoot(), ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropComponent);
    component = fixture.componentInstance;
    component.isWarning = false;
    component.isCropper = false;
    component.file = {
      url: 'http://',
      file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' })
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should an image is cropped', () => {
    spyOn(component, 'imageCropped').withArgs(imageCroppedEventMock);
    component.imageCropped(imageCroppedEventMock);
    expect(component.imageCropped).toHaveBeenCalled();
  });

  it('should cancel changes', () => {
    spyOn(component.newFile, 'emit');
    component.file = { url: '', file: null };
    component.cancelChanges();
    expect(component.file).toEqual(null);
    expect(component.isCropper).toBe(true);
    expect(component.newFile.emit).toHaveBeenCalledWith(component.file);
    expect(component.croppedImage).toEqual(null);
    expect(component.selectedFile).toEqual(null);
    expect(component.selectedFileUrl).toEqual(null);
  });

  it('should file is dropped', () => {
    const files: FileHandle[] = [
      { url: 'http://', file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' }) },
      { url: 'http://', file: new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' }) }
    ];
    component.filesDropped(files);
    expect(component.isWarning).toBe(false);
  });

  it('should render a Warning title', () => {
    component.isWarning = true;
    fixture.detectChanges();
    const warning: HTMLElement = fixture.nativeElement.querySelector('.warning');
    expect(warning).toBeTruthy();
    expect(warning.textContent).toContain('drag-and-drop.picture-tooltip');
  });

  it('showWarning', () => {
    component.file.file = new File(['some content'], 'text-file.jpeg', { type: 'image/jpeg' });
    component.isWarning = true;
    component.showWarning();
    expect(component.isWarning).toBeFalsy();
  });

  it('should stop cropping', (done) => {
    spyOn(component.newFile, 'emit');
    component.croppedImage = { ...imageCroppedEventMock, blob: new Blob(['some content'], { type: 'image/png' }) };
    component.stopCropping();
    setTimeout(() => {
      expect(component.file.url).toContain('data:image/png;base64');
      expect(component.file.file.name).toBe('text-file.jpeg');
      expect(component.isCropper).toBe(false);
      expect(component.isWarning).toBe(false);
      expect(component.newFile.emit).toHaveBeenCalledWith(component.file);
      done();
    }, 100);
  });

  it('should set isCropper based on isFromPreview', () => {
    component.isFromPreview = true;
    component.ngOnInit();
    expect(component.isCropper).toBe(false);

    component.isFromPreview = false;
    component.ngOnInit();
    expect(component.isCropper).toBe(true);
  });
});
