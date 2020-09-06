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

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  // let controls: any[];
  // let controlName: any;
  // let controlCity;
  // let controlCredo: any;

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
});
