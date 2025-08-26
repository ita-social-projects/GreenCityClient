import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UploadPhotoContainerComponent } from './upload-photo-container.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateModule } from '@ngx-translate/core';

describe('UploadPhotoContainerComponent', () => {
  let component: UploadPhotoContainerComponent;
  let fixture: ComponentFixture<UploadPhotoContainerComponent>;
  let dialogRef: MatDialogRef<UploadPhotoContainerComponent>;
  const mockFileUrl = 'data:image/jpeg;base64,mockImage';
  const mockCroppedImage = 'data:image/jpeg;base64,mockCroppedImage';

  const mockFileReader = {
    readAsDataURL: jasmine.createSpy('readAsDataURL'),
    onload: null,
    result: mockCroppedImage,
    addEventListener: (type, handler) => {
      if (type === 'load') {
        mockFileReader.onload = handler;
      }
    }
  };

  class MockImage {
    src: string;
    onload: () => void;
    width: number;
    height: number;
  }

  beforeEach(waitForAsync(() => {
    dialogRef = jasmine.createSpyObj('dialogRef', ['close']);
    spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);

    TestBed.configureTestingModule({
      declarations: [UploadPhotoContainerComponent],
      imports: [TranslateModule.forRoot(), ImageCropperModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { file: { url: mockFileUrl } } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPhotoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should set isHorisontalImg to true for horizontal images', () => {
    const mockImageInstance: any = new MockImage();
    spyOn(window as any, 'Image').and.returnValue(mockImageInstance);

    component.ngOnInit();
    mockImageInstance.width = 600;
    mockImageInstance.height = 400;
    mockImageInstance.onload();

    expect(component.isHorisontalImg).toBe(false);
  });

  it('should set isHorisontalImg to false for vertical images', () => {
    const mockImageInstance: any = new MockImage();
    spyOn(window as any, 'Image').and.returnValue(mockImageInstance);

    component.ngOnInit();
    mockImageInstance.width = 400;
    mockImageInstance.height = 600;
    mockImageInstance.onload();

    expect(component.isHorisontalImg).toBe(true);
  });

  it('should return correct styles for horizontal image', () => {
    component.isHorisontalImg = true;
    const styles = component.getMainContainerStyle();
    expect(styles.height).toBe('700px');
    expect(styles.width).toBe('500px');
  });

  it('should return correct styles for vertical image', () => {
    component.isHorisontalImg = false;
    const styles = component.getMainContainerStyle();
    expect(styles.height).toBe('530px');
    expect(styles.width).toBe('630px');
  });

  it('should set the croppedImage property on imageCropped event', () => {
    const mockBlob = new Blob(['mock-blob-data'], { type: 'image/jpeg' });
    const mockEvent: ImageCroppedEvent = {
      blob: mockBlob,
      base64: mockCroppedImage,
      width: 100,
      height: 100,
      imagePosition: null,
      cropperPosition: null
    };

    component.imageCropped(mockEvent);

    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);
    mockFileReader.onload({ target: { result: mockCroppedImage } });
    expect(component['croppedImage']).toBe(mockCroppedImage);
  });

  it('should close the dialog with the cropped image on save', () => {
    component['croppedImage'] = mockCroppedImage;

    component.onSaveChanges();
    expect(dialogRef.close).toHaveBeenCalledWith(mockCroppedImage);
  });
});
