import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UploadPhotoContainerComponent } from './upload-photo-container.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TranslateModule } from '@ngx-translate/core';

describe('UploadPhotoContainerComponent', () => {
  let component: UploadPhotoContainerComponent;
  let fixture: ComponentFixture<UploadPhotoContainerComponent>;
  let dialogRef: MatDialogRef<UploadPhotoContainerComponent>;

  beforeEach(waitForAsync(() => {
    dialogRef = jasmine.createSpyObj('dialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [UploadPhotoContainerComponent],
      imports: [TranslateModule.forRoot(), ImageCropperModule],
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

  it('should close the dialog on cancel', () => {
    component.onCancel();

    expect(dialogRef.close).toHaveBeenCalled();
  });
});
