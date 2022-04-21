import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { DialogPhotoComponent } from './dialog-photo.component';

describe('DialogPhotoComponent', () => {
  let component: DialogPhotoComponent;
  let fixture: ComponentFixture<DialogPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogPhotoComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
