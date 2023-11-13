import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { of } from 'rxjs';

import { AddCommentComponent } from './add-comment.component';
import { UserProfileImageComponent } from '@global-user/components/shared/components/user-profile-image/user-profile-image.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommentsService } from '../../services/comments.service';
import { EditProfileModel } from '@global-user/models/edit-profile.model';

describe('AddCommentComponent', () => {
  let component: AddCommentComponent;
  let fixture: ComponentFixture<AddCommentComponent>;

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  const userData = {
    userLocationDto: {
      cityUa: 'Місто',
      cityEn: 'City'
    },
    name: 'string',
    userCredo: 'string',
    profilePicturePath: defaultImagePath,
    rating: null,
    showEcoPlace: true,
    showLocation: true,
    showShoppingList: true,
    socialNetworks: [{ id: 1, url: defaultImagePath }]
  } as EditProfileModel;

  let profileServiceMock: ProfileService;
  profileServiceMock = jasmine.createSpyObj('ProfileService', ['getUserInfo']);
  profileServiceMock.getUserInfo = () => of(userData);

  let commentsServiceMock: CommentsService;
  commentsServiceMock = jasmine.createSpyObj('CommentsService', ['addComment']);
  commentsServiceMock.addComment = () =>
    of({
      author: {
        name: 'username',
        id: 1,
        userProfilePicturePath: null
      },
      id: 1,
      modifiedDate: '01.12.2022',
      text: 'some text'
    });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCommentComponent, UserProfileImageComponent],
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: CommentsService, useValue: commentsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form and emit event ', () => {
    const spy = spyOn(component.updateList, 'emit');
    const spy2 = spyOn(component.addCommentForm, 'reset');

    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should check does textarea contain only spaces', () => {
    const key = 'content';
    component.addCommentForm.controls[key].setValue('   ');
    fixture.detectChanges();
    expect(component.addCommentForm.valid).toBe(false);
  });
});
