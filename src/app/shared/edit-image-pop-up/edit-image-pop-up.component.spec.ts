import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImagePopUpComponent } from './edit-image-pop-up.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageService } from '@global-service/image/image.service';
import { ImageCropperComponent } from 'ngx-image-cropper';

const mockDialogData = {
  image: {
    name: 'test',
    file: new File([''], 'test.png')
  },
  index: 1,
  aspectRatio: 1 / 1
};

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

const mockImageService = {
  uploadImage: jasmine.createSpy('uploadImage')
};

describe('EditImagePopUpComponent', () => {
  let component: EditImagePopUpComponent;
  let fixture: ComponentFixture<EditImagePopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditImagePopUpComponent, ImageCropperComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ImageService, useValue: mockImageService }
      ]
    });

    fixture = TestBed.createComponent(EditImagePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
