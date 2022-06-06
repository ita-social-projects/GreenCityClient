import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ShowImgsPopUpComponent } from './show-imgs-pop-up.component';

describe('ShowImgsPopUpComponent', () => {
  let component: ShowImgsPopUpComponent;
  let fixture: ComponentFixture<ShowImgsPopUpComponent>;

  const dialogRefStub = {
    keydownEvents() {
      return of();
    },
    backdropClick() {
      return of();
    },
    close() {}
  };
  const fakePhoto = 'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';
  const popupDataStub = {
    imgIndex: 1,
    images: [
      { src: fakePhoto, label: null, name: 'fakeName1' },
      { src: fakePhoto, label: null, name: 'fakeName2' },
      { src: null, label: null, name: null }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowImgsPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: popupDataStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowImgsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('nextImg increment index', () => {
    component.imgIndex = 1;
    component.nextImg(true);
    expect(component.imgIndex).toBe(0);
  });

  it('nextImg dencrement index', () => {
    component.imgIndex = 0;
    component.nextImg(false);
    expect(component.imgIndex).toBe(1);
  });
});
