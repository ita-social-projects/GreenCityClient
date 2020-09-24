import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {AgmCoreModule, MapsAPILoader} from '@agm/core';
import { Observable } from 'rxjs';
import { EditProfileFormBuilder } from '@global-user/components/profile/edit-profile/edit-profile-form-builder';
import { EditProfileService } from '@global-user/services/edit-profile.service';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { EditProfileModel } from '@user-models/edit-profile.model';

import { EditProfileComponent } from './edit-profile.component';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditProfileComponent,
      ],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        AgmCoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        EditProfileFormBuilder,
        EditProfileService,
        ProfileService,
        {
          provide: MapsAPILoader,
          useValue: {
            load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))
          }
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create EditProfileComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('General methods:', () => {
    const initMethods = ['setupInitialValue', 'getInitialValue', 'subscribeToLangChange', 'bindLang'];

    for (let i = 0; i < initMethods.length; i++) {
      it(`ngOnInit should init ${i + 1}-st element ${initMethods[i]}`, () => {
        const spy = spyOn(component as any, initMethods[i]);
        component.ngOnInit();
        expect(spy).toHaveBeenCalledTimes(1);
      });
    }

    it('ngOnDestroy should destroy one method', () => {
      spyOn((component as any).langChangeSub, 'unsubscribe');
      component.ngOnDestroy();
      expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should call CancelPopup', () => {
      spyOn(component.dialog, 'open');
      component.openCancelPopup();
      expect(component.dialog).toBeDefined();
    });
  });

  describe('Testing controls for the form:', () => {
    const controlsName = ['name', 'city', 'credo'];
    const maxLength = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. ' +
      'Facilis asperiores minus corrupti impedit cumque sapiente est architecto obcaecati quisquam velit quidem quis nesciunt';
    const invalidCity = ['@Lviv', '.Lviv', 'Kiev6', 'Kyiv$'];
    const validCity = ['Lviv', 'Ivano-Frankivsk', 'Kiev(Ukraine)', 'Львов, Украина'];

    for (let i = 0; i < controlsName.length; i++) {
      it(`should create form with ${i + 1}-st formControl: ${controlsName[i]}`, () => {
        expect(component.editProfileForm.contains(controlsName[i])).toBeTruthy();
      });

      it(`The formControl: ${controlsName[i]} should be marked as invalid if the value is too long`, () => {
        const control = component.editProfileForm.get(controlsName[i]);
        control.setValue(maxLength);
        expect(control.valid).toBeFalsy();
      });
    }

    describe('The formControl: city should be marked as invalid if the value:', () => {
      for (let i = 0; i < invalidCity.length; i++) {
        it(`${i + 1}-st - ${validCity[i]}.`, () => {
          const control = component.editProfileForm.get('city');
          control.setValue(invalidCity[i]);
          expect(control.valid).toBeFalsy();
        });
      }
    });

    describe('The formControl: city should be marked as valid if the value:', () => {
      for (let i = 0; i < validCity.length; i++) {
        it(`${i + 1}-st - ${validCity[i]}.`, () => {
          const control = component.editProfileForm.get('city');
          control.setValue(validCity[i]);
          expect(control.valid).toBeTruthy();
        });
      }
    });
  });

  describe('Testing services:', () => {
    let editProfileService: EditProfileService;
    let profileService: ProfileService;
    let mockUserInfo: EditProfileModel;

    beforeEach(() => {
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
  });
});
