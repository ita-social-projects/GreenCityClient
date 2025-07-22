import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, Subject } from 'rxjs';

import { DialogPopUpComponent } from './dialog-pop-up.component';

describe('DialogPopUpComponent', () => {
  let component: DialogPopUpComponent;
  let fixture: ComponentFixture<DialogPopUpComponent>;
  const fakeTitles = {
    popupTitle: 'popupTitle',
    popupSubtitle: 'popupSubtitle',
    popupConfirm: 'popupSubtitle',
    popupCancel: 'popupSubtitle',
    isEditOrPayPopup: true
  };
  const dialogRefStub: {
    keydownEvents: () => Observable<KeyboardEvent>;
    backdropClick: () => Observable<void>;
    close: () => void;
  } = {
    keydownEvents: () => of(),
    backdropClick: () => of(),
    close: () => {}
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogPopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, BrowserDynamicTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: fakeTitles }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userReply with undefined if isEditOrPayPopup is true on a backdrop click', () => {
    const mockBackdrop = new Subject<void>();
    dialogRefStub.backdropClick = () => mockBackdrop.asObservable();
    spyOn(component, 'userReply');

    component.ngOnInit();
    mockBackdrop.next();

    expect(component.isEditOrPayPopup).toBeTrue();
    expect(component.userReply).toHaveBeenCalledWith(undefined);
  });
  it('should call userReply with false if isEditOrPayPopup isnt true on a backdrop click', () => {
    const mockBackdrop = new Subject<void>();
    dialogRefStub.backdropClick = () => mockBackdrop.asObservable();
    spyOn(component, 'userReply');

    component.ngOnInit();

    component.isEditOrPayPopup = false;

    mockBackdrop.next();

    expect(component.isEditOrPayPopup).toBeFalsy();
    expect(component.userReply).toHaveBeenCalledWith(false);
  });
});
