import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DragAndDropComponent } from './drag-and-drop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
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
    component.file = { url: '', file: null };
    component.cancelChanges();
    expect(component.file).toEqual(null);
    expect(component.isCropper).toBe(true);
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
});
