import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserSharedModule } from '@global-user/components/shared/user-shared.module';
import { SharedMainModule } from '@shared/shared-main.module';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { EditPhotoPopUpComponent } from '@shared/components';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { of, throwError } from 'rxjs';
import { FileHandle } from '@eco-news-models/create-news-interface';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SafeUrl } from '@angular/platform-browser';

describe('EditPhotoPopUpComponent', () => {
  let component: EditPhotoPopUpComponent;
  let fixture: ComponentFixture<EditPhotoPopUpComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EditPhotoPopUpComponent>>;
  let mockEditProfileService: jasmine.SpyObj<EditProfileService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBarComponent>;

  beforeEach(waitForAsync(() => {
    mockDialogRef = jasmine.createSpyObj(['close']);
    mockEditProfileService = jasmine.createSpyObj('EditProfileService', ['updateProfilePhoto', 'deleteProfilePhoto']);
    mockSnackBar = jasmine.createSpyObj(['openSnackBar']);

    TestBed.configureTestingModule({
      imports: [SharedMainModule, UserSharedModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: EditProfileService, useValue: mockEditProfileService },
        { provide: MatSnackBarComponent, useValue: mockSnackBar }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhotoPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setUserAvatar on ngOnInit', () => {
    spyOn(component as any, 'setUserAvatar').and.callThrough();
    component.data = { img: 'avatarUrl' };
    component.ngOnInit();

    expect((component as any).setUserAvatar).toHaveBeenCalled();
    expect(component.avatarImg).toBe('avatarUrl');
  });

  it('should open file window on space or enter key press', () => {
    const inputElement = document.createElement('input');
    spyOn(inputElement, 'click');
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    Object.defineProperty(event, 'target', { value: inputElement });
    component.openFilesWindow(event);

    expect(inputElement.click).toHaveBeenCalled();
  });

  it('should handle files dropped', () => {
    const files: FileHandle[] = [{ file: new File([''], 'test.png'), url: 'testUrl' as SafeUrl }];
    spyOn(component as any, 'transferFile');
    component.filesDropped(files);

    expect((component as any).transferFile).toHaveBeenCalledWith(files[0].file);
  });

  it('should set cropped image', () => {
    const event = { base64: 'croppedImageString' } as ImageCroppedEvent;
    component.imageCropped(event);

    expect((component as any).croppedImage).toBe('croppedImageString');
  });

  it('should call transferFile on photo select', () => {
    const file = new File([''], 'test.png');
    const event = { target: { files: [file] } } as unknown as Event;
    spyOn(component as any, 'transferFile');
    component.onSelectPhoto(event);

    expect((component as any).transferFile).toHaveBeenCalledWith(file);
  });

  it('should transfer file and set warning', fakeAsync(() => {
    const file = new File([''], 'test.png');
    spyOn(component as any, 'showWarning').and.returnValue(false);
    spyOn(FileReader.prototype, 'readAsDataURL').and.callThrough();
    (component as any).transferFile(file);
    tick();

    expect((component as any).showWarning).toHaveBeenCalledWith(file);
    expect(component.selectedFile).toBe(file);
    expect(FileReader.prototype.readAsDataURL).toHaveBeenCalledWith(file);
  }));

  it('should handle files dropped', () => {
    const files: any[] = [{ file: new File([''], 'test.png'), url: 'testUrl' as SafeUrl }];
    spyOn<any>(component, 'transferFile');
    component['filesDropped'](files);

    expect(component['transferFile']).toHaveBeenCalledWith(files[0].file);
  });

  it('should save photo and handle success response', fakeAsync(() => {
    const formData = new FormData();
    formData.append('base64', 'croppedImageString');
    spyOn(component as any, 'closeEditPhoto');
    (component['editProfileService'] as any).updateProfilePhoto.and.returnValue(of([]));
    (component as any)['croppedImage'] = 'croppedImageString';
    component['savePhoto']();
    tick();

    expect(component.loadingAnim).toBeFalse();
    expect(component['editProfileService'].updateProfilePhoto).toHaveBeenCalledWith(formData);
    expect(component['closeEditPhoto']).toHaveBeenCalled();
  }));

  it('should handle save photo error', fakeAsync(() => {
    (mockEditProfileService.updateProfilePhoto as any).and.returnValue(throwError(() => 'Error'));
    (component as any).croppedImage = 'croppedImageString';
    component['savePhoto']();
    tick();

    expect(component.loadingAnim).toBeFalse();
    expect(mockSnackBar.openSnackBar).toHaveBeenCalledWith('error');
  }));

  it('should delete photo and handle error response', fakeAsync(() => {
    (mockEditProfileService.deleteProfilePhoto as jasmine.Spy).and.returnValue(throwError(() => 'Error'));
    component['deletePhoto']();
    tick();

    expect(component['loadingAnim']).toBeFalse();
    expect(mockSnackBar.openSnackBar).toHaveBeenCalledWith('error');
  }));

  it('should delete photo', fakeAsync(() => {
    mockEditProfileService.deleteProfilePhoto.and.returnValue(of({}));
    spyOn(component, 'closeEditPhoto');
    component.deletePhoto();
    tick();

    expect(component.loadingAnim).toBeFalse();
    expect(component.closeEditPhoto).toHaveBeenCalled();
  }));

  it('should not transfer file if warning is shown', () => {
    const file = new File([''], 'test.png');
    spyOn(component as any, 'showWarning').and.returnValue(true);
    (component as any).transferFile(file);

    expect((component as any).showWarning).toHaveBeenCalledWith(file);
    expect(component.selectedFile).toBeNull();
  });

  it('should delete photo successfully', fakeAsync(() => {
    mockEditProfileService.deleteProfilePhoto.and.returnValue(of({}));
    spyOn<any>(component, 'closeEditPhoto');
    component['deletePhoto']();
    tick();

    expect(component.loadingAnim).toBeFalse();
    expect(mockEditProfileService.deleteProfilePhoto).toHaveBeenCalled();
    expect(component['closeEditPhoto']).toHaveBeenCalled();
  }));

  it('should handle delete photo error', fakeAsync(() => {
    mockEditProfileService.deleteProfilePhoto.and.returnValue(throwError(() => 'Error'));
    spyOn<any>(component, 'openErrorDialog');
    component['deletePhoto']();
    tick();

    expect(component.loadingAnim).toBeFalse();
    expect(mockEditProfileService.deleteProfilePhoto).toHaveBeenCalled();
    expect(component['openErrorDialog']).toHaveBeenCalled();
  }));

  it('should save photo successfully', fakeAsync(() => {
    const croppedImage = 'data:image/png;base64,MockBase64ImageData';
    (component as any).croppedImage = croppedImage;
    const formData = new FormData();
    formData.append('base64', croppedImage);
    mockEditProfileService.updateProfilePhoto.and.returnValue(of([]));
    spyOn<any>(component, 'closeEditPhoto');
    component['savePhoto']();
    tick();

    expect(component.loadingAnim).toBeFalse();
    expect(mockEditProfileService.updateProfilePhoto).toHaveBeenCalledWith(formData);
    expect(component['closeEditPhoto']).toHaveBeenCalled();
  }));

  it('should handle save photo error', fakeAsync(() => {
    const croppedImage = 'data:image/png;base64,MockBase64ImageData';
    (component as any).croppedImage = croppedImage;
    const formData = new FormData();
    formData.append('base64', croppedImage);
    mockEditProfileService.updateProfilePhoto.and.returnValue(throwError(() => 'Error'));
    spyOn<any>(component, 'openErrorDialog');
    component['savePhoto']();
    tick();

    expect(component.loadingAnim).toBeFalse();
    expect(mockEditProfileService.updateProfilePhoto).toHaveBeenCalledWith(formData);
    expect(component['openErrorDialog']).toHaveBeenCalled();
  }));

  it('should call transferFile with the first file when filesDropped is called', () => {
    const mockFileHandle = { file: new File([''], 'filename.png') } as FileHandle;
    const spy = spyOn(component as any, 'transferFile');
    component.filesDropped([mockFileHandle]);

    expect(spy).toHaveBeenCalledWith(mockFileHandle.file);
  });

  it('should not call transferFile when filesDropped is called with an empty array', () => {
    const spy = spyOn(component as any, 'transferFile');
    component.filesDropped([]);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should set selectedFile and read it if no warning is shown', () => {
    const file = new File([''], 'filename.png');
    const mockReader = {
      readAsDataURL: jasmine.createSpy('readAsDataURL'),
      onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null
    };
    spyOn(window as any, 'FileReader').and.returnValue(mockReader as unknown as FileReader);
    spyOn(component as any, 'showWarning').and.returnValue(false);
    (component as any).transferFile(file);

    expect((component as any).selectedFile).toBe(file);
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(file);
  });

  it('should not set selectedFile if a warning is shown', () => {
    const file = new File([''], 'filename.png');
    spyOn(component as any, 'showWarning').and.returnValue(true);
    (component as any).transferFile(file);

    expect((component as any).selectedFile).toBeNull();
  });

  it('should set croppedImage with base64 data in imageCropped', () => {
    const event = { base64: 'croppedImageData' } as ImageCroppedEvent;
    component.imageCropped(event);

    expect((component as any).croppedImage).toBe('croppedImageData');
  });

  it('should log an error if blob conversion fails in imageCropped', (done) => {
    const blob = new Blob(['image data'], { type: 'image/png' });
    const event = { blob } as ImageCroppedEvent;
    spyOn(component as any, 'convertBlobToBase64').and.returnValue(Promise.reject('conversion error'));
    spyOn(console, 'error');
    component.imageCropped(event);

    setTimeout(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to convert blob to base64:', 'conversion error');
      done();
    }, 0);
  });

  it('should log an error if no base64 or blob data is available in imageCropped', () => {
    spyOn(console, 'error');
    const event = {} as ImageCroppedEvent;
    component.imageCropped(event);

    expect(console.error).toHaveBeenCalledWith('No base64 or blob data available.');
  });
});
