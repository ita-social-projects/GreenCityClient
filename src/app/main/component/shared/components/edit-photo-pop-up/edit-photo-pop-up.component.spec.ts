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
import { SafeUrl } from '@angular/platform-browser';

describe('EditPhotoPopUpComponent', () => {
  let component: EditPhotoPopUpComponent;
  let fixture: ComponentFixture<EditPhotoPopUpComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EditPhotoPopUpComponent>>;
  let mockEditProfileService: jasmine.SpyObj<EditProfileService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBarComponent>;
  const mockFile: File = new File([''], 'filename.png', { type: 'image/png' });
  const safeUrl: SafeUrl = 'data:image/png;base64,abc123' as SafeUrl;
  const fileHandle: FileHandle = { file: mockFile, url: safeUrl };

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

  it('should handle files dropped', () => {
    const files: FileHandle[] = [{ file: new File([''], 'test.png'), url: 'testUrl' as SafeUrl }];
    spyOn(component as any, 'transferFile');
    component.filesDropped(files);

    expect((component as any).transferFile).toHaveBeenCalledWith(files[0].file);
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

  it('should handle error when converting blob to base64', async () => {
    const blob = new Blob(['image data'], { type: 'image/png' });
    const file = new File([blob], 'image.png', { type: 'image/png' });
    const event: FileHandle = { file, url: 'data:image/png;base64,blobData' };
    component.imageCropped(event);
    await fixture.whenStable();
  });

  it('should not set croppedImage if no url is available in imageCropped', () => {
    const initialCroppedImage = (component as any).croppedImage;
    const event = {} as FileHandle;
    component.imageCropped(event);
    expect((component as any).croppedImage).toBe(initialCroppedImage);
  });

  it('should open error dialog when openErrorDialog is called', () => {
    (component as any).openErrorDialog();
    expect(mockSnackBar.openSnackBar).toHaveBeenCalledWith('error');
  });

  it('should initialize with user avatar', () => {
    const testImg = 'test-image-url';
    component.data = { img: testImg };
    component.ngOnInit();
    expect(component.avatarImg).toBe(testImg);
  });

  it('should handle filesDropped and call transferFile', () => {
    spyOn(component as any, 'transferFile');
    component.filesDropped([fileHandle]);
    expect((component as any).transferFile).toHaveBeenCalledWith(mockFile);
  });

  it('should handle showWarning correctly', () => {
    spyOn(component as any, 'showWarning').and.returnValue(false);
    const result = (component as any).showWarning(mockFile);
    expect(result).toBeFalse();
  });

  it('should set croppedImage with base64 data in imageCropped', () => {
    (component as any).croppedImage = mockFile;
    component.imageCropped(fileHandle);
    expect((component as any).croppedImage).toBe(mockFile);
  });

  it('should set croppedImage correctly', () => {
    const fileHandle: FileHandle = { file: mockFile, url: safeUrl };
    component.imageCropped(fileHandle);
    const croppedImage = (component as any).croppedImage;
    expect(croppedImage).toBeDefined();
    expect(croppedImage instanceof File).toBeTrue();
    expect(croppedImage.name).toBe('filename.png');
    expect(croppedImage.type).toBe('image/png');
  });

  it('should call updateProfilePhoto and handle success', () => {
    mockEditProfileService.updateProfilePhoto.and.returnValue(of([]));
    component.selectedFile = mockFile;
    (component as any).croppedImage = mockFile;

    component.savePhoto();

    expect(mockEditProfileService.updateProfilePhoto).toHaveBeenCalled();

    const formData = mockEditProfileService.updateProfilePhoto.calls.mostRecent().args[0] as FormData;
    expect(formData.has('image')).toBeTrue();

    setTimeout(() => {
      expect(component.loadingAnim).toBeFalse();
      expect(mockDialogRef.close).toHaveBeenCalled();
    }, 0);
  });

  it('should handle error when updating profile photo fails', () => {
    mockEditProfileService.updateProfilePhoto.and.returnValue(throwError(() => new Error('Upload failed')));
    component.selectedFile = mockFile;
    (component as any).croppedImage = mockFile;

    component.savePhoto();
    expect(mockEditProfileService.updateProfilePhoto).toHaveBeenCalled();
  });

  it('should call deleteProfilePhoto and handle success', () => {
    mockEditProfileService.deleteProfilePhoto.and.returnValue(of({}));
    component.deletePhoto();
    expect(mockEditProfileService.deleteProfilePhoto).toHaveBeenCalled();
    setTimeout(() => {
      expect(component.loadingAnim).toBeFalse();
      expect(mockDialogRef.close).toHaveBeenCalled();
    }, 0);
  });

  it('should handle error when deleting profile photo fails', () => {
    mockEditProfileService.deleteProfilePhoto.and.returnValue(throwError(() => new Error('Delete failed')));
    component.deletePhoto();
    expect(mockEditProfileService.deleteProfilePhoto).toHaveBeenCalled();
  });
});
