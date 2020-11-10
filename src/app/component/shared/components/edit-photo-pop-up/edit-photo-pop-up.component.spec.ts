import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorComponent } from '@global-errors/error/error.component';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { TranslateModule } from '@ngx-translate/core';
import { ImageCropperModule } from "ngx-image-cropper";
import { Observable } from 'rxjs';

import { EditPhotoPopUpComponent } from './edit-photo-pop-up.component';

describe('EditPhotoPopUpComponent', () => {
  let component: EditPhotoPopUpComponent;
  let fixture: ComponentFixture<EditPhotoPopUpComponent>;
  class MatDialogRefMock {
    close() { }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditPhotoPopUpComponent,
        ErrorComponent
      ],
      imports: [
        ImageCropperModule,
        MatDialogModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        EditProfileService,
        ProfileService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhotoPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create EditPhotoPopUpComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call openErrorDialog', () => {
    // @ts-ignore
    spyOn(component.dialog, 'open');
    // @ts-ignore
    component.openErrorDialog();
    // @ts-ignore
    expect(component.dialog).toBeDefined();
  });

  it('should call closeEditPhoto', () => {
    // @ts-ignore
    const spy = spyOn(component.matDialogRef, 'close').and.callThrough();

    component.closeEditPhoto();
    expect(spy).toHaveBeenCalled();
  });

  it('isWarning should equel false after calling onSelectPhoto method', () => {
    const mockEvent = {
      target: {
        files: [new Blob(['ssdfsdgdjghdslkjghdjg'], { type: 'png' })]
      }
    };
    component.onSelectPhoto(mockEvent);
    expect(component.isWarning).toEqual(false);
  });

  it('isWarning should equel false after calling onSelectPhoto method', () => {
    const mockEvent = {
      base64: 'test',
      width: 1,
      height: 1,
      cropperPosition: {
        x1: 1, y1: 1, x2: 1, y2: 1
      },
      imagePosition: {
        x1: 1, y1: 1, x2: 1, y2: 1
      }
    };
    component.imageCropped(mockEvent);
    // @ts-ignore
    expect(component.croppedImage).toEqual(mockEvent.base64);
  });

  it('Should call deletePhoto method success', async(inject([EditProfileService], (service: EditProfileService) => {
    const mockDel = {};
    const serviceSpy = spyOn(service, 'deleProfilePhoto').and.returnValue(Observable.of(mockDel));
    // @ts-ignore
    component.deletePhoto();
    fixture.detectChanges();
    expect(serviceSpy).toHaveBeenCalled();
  })));

  it('Should call savePhoto method success', async(inject([EditProfileService], (service: EditProfileService) => {
    const serviceSpy = spyOn(service, 'updateProfilePhoto').and.returnValue(Observable.of(null));
    // @ts-ignore
    component.savePhoto();
    fixture.detectChanges();
    expect(serviceSpy).toHaveBeenCalled();
  })));
});
