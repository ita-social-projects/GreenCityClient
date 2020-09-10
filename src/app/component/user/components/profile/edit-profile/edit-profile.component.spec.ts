import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileComponent } from './edit-profile.component';
import { EditProfileFormBuilder } from '@global-user/components/profile/edit-profile/edit-profile-form-builder';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { EditProfileModel } from '@user-models/edit-profile.model';
import {Observable} from 'rxjs';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let controlsName: string[];
  let editProfileService: EditProfileService;
  let profileService: ProfileService;
  let mockUserInfo: EditProfileModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        EditProfileComponent,
        TranslatePipeMock,
      ],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        EditProfileFormBuilder,
        EditProfileService,
        ProfileService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    controlsName = ['name', 'city', 'credo'];
    editProfileService = fixture.debugElement.injector.get(EditProfileService);
    profileService = fixture.debugElement.injector.get(ProfileService);
    mockUserInfo = {
      city: 'Lviv',
      firstName: 'John',
      userCredo: 'My Credo is to make small steps that leads to huge impact. Let’s change the world together.',
      profilePicturePath: './assets/img/profileAvatarBig.png',
      rating: 658,
      showEcoPlace: true,
      showLocation: true,
      showShoppingList: true,
      socialNetworks: ['Instagram']
    };
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with three controls', () => {
    controlsName.map(el =>  expect(component.editProfileForm.contains(el)).toBeTruthy());
  });

  it('should mark the control as invalid if value contains invalid characters. Check the controller "pattern".', () => {
    const controlCity = component.editProfileForm.get('city');
    controlCity.setValue('.Lo&');
    expect(controlCity.valid).toBeFalsy();
    controlCity.setValue('$Lo&pr');
    expect(controlCity.valid).toBeFalsy();
    controlCity.setValue('Po&-as');
    expect(controlCity.valid).toBeFalsy();
    controlCity.setValue('Lviv');
    expect(controlCity.valid).toBeTruthy();
  });

  it('ngOnInit should init four method', () => {
    spyOn(component as any, 'setupInitialValue');
    spyOn(component as any, 'getInitialValue');
    spyOn(component as any, 'subscribeToLangChange');
    spyOn(component as any, 'bindLang');
    component.ngOnInit();

    expect((component as any).setupInitialValue).toHaveBeenCalledTimes(1);
    expect((component as any).getInitialValue).toHaveBeenCalledTimes(1);
    expect((component as any).subscribeToLangChange).toHaveBeenCalledTimes(1);
    expect((component as any).bindLang).toHaveBeenCalledTimes(1);
  });

  it('getInitialValue should call ProfileService', () => {
    const spy = spyOn(profileService, 'getUserInfo').and.returnValue(Observable.of(mockUserInfo));
    component.getInitialValue();
    expect(spy.calls.any()).toBeTruthy();
  });

  it('onSubmit should call EditProfileService', () => {
    const spy = spyOn(editProfileService, 'postDataUserProfile').and.returnValue(Observable.of(mockUserInfo));
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call CancelPopup', () => {
    spyOn(component.dialog, 'open');
    component.openCancelPopup();
    expect(component.dialog).toBeDefined();
  });

  it('ngOnDestroy should destroy two method ', () => {
    spyOn((component as any).langChangeSub, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalledTimes(1);
  });

  describe('Testing controls for the form', () => {
    const controlsName = ['name', 'city', 'credo'];
    const minLength = 'Lv';
    const maxLength = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. ' +
      'Facilis asperiores minus corrupti impedit cumque sapiente est architecto obcaecati quisquam velit quidem quis nesciunt';
    const invalidCity = ['@Lviv', '.Lviv', 'Kiev6', 'Kyiv$'];
    const validCity = ['Lviv', 'Ivano-Frankivsk', 'Kiev(Ukraine)', 'Львов'];

    for (let i = 0; i < controlsName.length; i++) {
      it(`should create form with formControl: ${controlsName[i]}`, () => {
        expect(component.editProfileForm.contains(controlsName[i])).toBeTruthy();
      });

      it(`should mark formControl: ${controlsName[i]} as invalid if empty value. Checking the validator "required".`, () => {
        const control = component.editProfileForm.get(controlsName[i]);
        control.setValue('');
        expect(control.valid).toBeFalsy();
      });

      it(`The formControl: ${controlsName[i]} should be marked as invalid if the value is too long. Checking the validator "maxLength".`, () => {
        const control = component.editProfileForm.get(controlsName[i]);
        control.setValue(maxLength);
        expect(control.valid).toBeFalsy();
      });

      it(`The formControl: ${controlsName[i]} should be marked as invalid if the value is too short. Checking the validator "minLength".`, () => {
        const control = component.editProfileForm.get(controlsName[i]);
        control.setValue(minLength);
        expect(control.valid).toBeFalsy();
      });
    }
  });
});


