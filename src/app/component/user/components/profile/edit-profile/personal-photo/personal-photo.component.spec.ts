import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPhotoComponent } from './personal-photo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('PersonalPhotoComponent', () => {
  let component: PersonalPhotoComponent;
  let fixture: ComponentFixture<PersonalPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPhotoComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
