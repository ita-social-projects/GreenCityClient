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
    component.data = { img: 'avatarUrl' };
    component.ngOnInit();
    expect(component.avatarImg).toBe('avatarUrl');
  });

  it('should delete photo', fakeAsync(() => {
    mockEditProfileService.deleteProfilePhoto.and.returnValue(of({}));
    spyOn(component, 'closeEditPhoto');
    component.deletePhoto();
    tick();

    expect(component.loadingAnim).toBeFalse();
    expect(component.closeEditPhoto).toHaveBeenCalled();
  }));

  it('should handle error when converting blob to base64', async () => {
    const blob = new Blob(['image data'], { type: 'image/png' });
    const file = new File([blob], 'image.png', { type: 'image/png' });
    const event: FileHandle = { file, url: 'data:image/png;base64,blobData' };
    component.imageCropped(event);
    await fixture.whenStable();
  });

  it('should not set croppedImage if no url is available in imageCropped', () => {
    const initialCroppedImage = component.croppedImage;
    const event = {} as FileHandle;
    component.imageCropped(event);
    expect(component.croppedImage).toBe(initialCroppedImage);
  });

  it('should initialize with user avatar', () => {
    const testImg = 'test-image-url';
    component.data = { img: testImg };
    component.ngOnInit();
    expect(component.avatarImg).toBe(testImg);
  });

  it('should set croppedImage with base64 data in imageCropped', () => {
    component.croppedImage = mockFile;
    component.imageCropped(fileHandle);
    expect(component.croppedImage).toBe(mockFile);
  });

  it('should call updateProfilePhoto and handle success', () => {
    mockEditProfileService.updateProfilePhoto.and.returnValue(of([]));
    component.selectedFile = mockFile;
    component.croppedImage = mockFile;
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
    component.croppedImage = mockFile;

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
