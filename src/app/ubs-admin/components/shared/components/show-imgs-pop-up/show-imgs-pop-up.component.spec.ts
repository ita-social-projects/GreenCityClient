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

  const popupDataStub = {
    imgIndex: 1,
    images: [
      { src: 'fakeFoto1', label: null, name: 'fakeName1' },
      { src: 'fakeFoto2', label: null, name: 'fakeName2' },
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
      ]
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
