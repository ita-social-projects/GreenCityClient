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
  // let controlName: any;
  // let controlCity: any;
  // let controlCredo: any;
  // let controls: any[];
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
    // controlName = component.editProfileForm.get('name');
    // controlCity = component.editProfileForm.get('city');
    // controlCredo = component.editProfileForm.get('credo');
    // controls = [controlName, controlCity, controlCredo];
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with 3 controls', () => {
    expect(component.editProfileForm.contains('name')).toBeTruthy();
    expect(component.editProfileForm.contains('city')).toBeTruthy();
    expect(component.editProfileForm.contains('credo')).toBeTruthy();
  });

  it('should mark controls as invalid if empty value', () => {
    const controlName = component.editProfileForm.get('name');
    const controlCity = component.editProfileForm.get('city');
    const controlCredo = component.editProfileForm.get('credo');
    const controls = [controlName, controlCity, controlCredo];
    controls.map(el => el.setValue(''));
    expect(controlName.valid).toBeFalsy();
    expect(controlCity.valid).toBeFalsy();
    expect(controlCredo.valid).toBeFalsy();
  });

  it('should mark controls as invalid if longer value', () => {
    const controlName = component.editProfileForm.get('name');
    const controlCity = component.editProfileForm.get('city');
    const controlCredo = component.editProfileForm.get('credo');
    const controls = [controlName, controlCity, controlCredo];
    controls.map(el => el.setValue('Lorem ipsum dolor sit amet consectetur, adipisicing elit.' +
      'Facilis asperiores minus corrupti impedit cumque sapiente est architecto obcaecati quisquam velit quidem quis nesciunt,'));
    expect(controlName.valid).toBeFalsy();
    expect(controlCity.valid).toBeFalsy();
    expect(controlCredo.valid).toBeFalsy();
  });

  it('should mark controls as invalid if smaller value', () => {
    const controlName = component.editProfileForm.get('name');
    const controlCity = component.editProfileForm.get('city');
    const controlCredo = component.editProfileForm.get('credo');
    const controls = [controlName, controlCity, controlCredo];
    controls.map(el => el.setValue('Lo'));
    expect(controlName.valid).toBeFalsy();
    expect(controlCity.valid).toBeFalsy();
    expect(controlCredo.valid).toBeFalsy();
  });

  it('should mark the control as invalid if value contains invalid characters', () => {
    const controlCity = component.editProfileForm.get('city');
    controlCity.setValue('.Lo&');
    expect(controlCity.valid).toBeFalsy();
  });

  it('should call ProfileService', () => {
    const spy = spyOn(profileService, 'getUserInfo').and.returnValue(Observable.of(mockUserInfo));
    component.getInitialValue();
    expect(spy.calls.any()).toBeTruthy();
  });

  it('should call EditProfileService', () => {
    const spy = spyOn(editProfileService, 'postDataUserProfile').and.returnValue(Observable.of(mockUserInfo));
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('ngOnInit should init for method', () => {
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

  it('ngOnDestroy should destroy two method ', () => {
    spyOn((component as any).langChangeSub, 'unsubscribe');
    component.ngOnDestroy();

    expect((component as any).langChangeSub.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('Return from AcceptLeadDialog with hasAccepted equals true should call acceptLead endpoint', () => {
    spyOn(component.dialog, 'open');
    component.openCancelPopup();
    expect(component.dialog).toBeDefined();
  });
});
