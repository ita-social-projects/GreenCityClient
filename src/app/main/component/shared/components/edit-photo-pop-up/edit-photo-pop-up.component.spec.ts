import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserSharedModule } from '../../../user/components/shared/user-shared.module';
import { SharedModule } from 'src/app/main/component/shared/shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotoPopUpComponent } from './edit-photo-pop-up.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

describe('EditPhotoPopUpComponent', () => {
  let component: EditPhotoPopUpComponent;
  let fixture: ComponentFixture<EditPhotoPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, UserSharedModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
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
});
