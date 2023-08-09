import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadPhotoContainerComponent } from './upload-photo-container.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TranslateModule } from '@ngx-translate/core';

describe('UploadPhotoContainerComponent', () => {
  let component: UploadPhotoContainerComponent;
  let fixture: ComponentFixture<UploadPhotoContainerComponent>;
  let dialogRef: MatDialogRef<UploadPhotoContainerComponent>;

  beforeEach(async(() => {
    dialogRef = jasmine.createSpyObj('dialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [UploadPhotoContainerComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { file: { url: 'test_url' } } }
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

  it('should determine if the image is horizontal on initialization', () => {
    const mockImage = new Image();
    spyOn(window, 'Image').and.returnValue(mockImage);

    component.ngOnInit();
    mockImage.width = 500;
    mockImage.height = 700;
    mockImage.onload!(new Event('load'));

    expect(component.isHorisontalImg).toBeTruthy();
  });

  it('should set the cropped image', () => {
    const event: ImageCroppedEvent = {
      base64: 'base64_image_data',
      width: 100,
      height: 100,
      cropperPosition: { x1: 0, y1: 0, x2: 100, y2: 100 },
      imagePosition: { x1: 0, y1: 0, x2: 100, y2: 100 }
    };
    component.imageCropped(event);

    expect((component as any).croppedImage).toBe('base64_image_data');
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog with cropped image on save', () => {
    (component as any).croppedImage = 'base64_image_data';
    component.onSaveChanges();

    expect(dialogRef.close).toHaveBeenCalledWith('base64_image_data');
  });
});
