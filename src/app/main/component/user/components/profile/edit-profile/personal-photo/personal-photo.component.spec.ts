import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { UserSharedModule } from '../../../shared/user-shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalPhotoComponent } from './personal-photo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { EditProfileModel } from '@global-user/models/edit-profile.model';

class MatDialogStub {
  result = true;

  setResult(val: boolean) {
    this.result = val;
  }

  open() {
    return { afterClosed: () => of(this.result) };
  }
}

describe('PersonalPhotoComponent', () => {
  let component: PersonalPhotoComponent;
  let fixture: ComponentFixture<PersonalPhotoComponent>;
  const dialogStub = new MatDialogStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalPhotoComponent],
      imports: [MatDialogModule, HttpClientTestingModule, TranslateModule.forRoot(), UserSharedModule, BrowserAnimationsModule],
      providers: [{ provide: MatDialog, useValue: dialogStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test main functionality', () => {
    it('Should set user data', () => {
      const userData = {
        profilePicturePath: 'test',
        name: 'test'
      };
      spyOn((component as any).profileService, 'getUserInfo').and.returnValue(of(userData));

      (component as any).setUserAvatar();

      expect(component.userName).toBe(userData.name);
    });

    it('Should set user data', () => {
      const userData: EditProfileModel = {
        userLocationDto: { cityEn: 'city' },
        name: '',
        userCredo: '',
        profilePicturePath: 'test',
        rating: 0,
        showEcoPlace: true,
        showLocation: true,
        showShoppingList: true,
        socialNetworks: [{ id: 220, url: 'http://instagram.com/profile' }]
      } as EditProfileModel;
      spyOn((component as any).profileService, 'getUserInfo').and.returnValue(of(userData));
      (component as any).setUserAvatar();

      expect(component.userName).toBe(userData.name);
    });

    it('Should open editPhoto modal window', () => {
      component.userName = 'test';
      component.avatarImg = 'test';

      dialogStub.setResult(true);
      const spy = spyOn(component as any, 'setUserAvatar');
      component.openEditPhoto();

      expect(spy).toHaveBeenCalled();
    });
  });
});
