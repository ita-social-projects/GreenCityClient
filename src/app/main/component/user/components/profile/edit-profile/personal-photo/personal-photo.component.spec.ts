import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { UserSharedModule } from '../../../shared/user-shared.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonalPhotoComponent } from './personal-photo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

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
});
