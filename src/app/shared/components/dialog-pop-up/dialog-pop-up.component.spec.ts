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
    popupCancel: 'popupSubtitle'
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

  it('it should set component isEditOrPayPopup to true if data.isEditOrPayPopup set to true', () => {
    component.data.isEditOrPayPopup = true;
    component.ngOnInit();
    expect(component.isEditOrPayPopup).toBeTrue();
  });

  it('it should set component isEditOrPayPopup to false if data.isEditOrPayPopup set to false', () => {
    component.data.isEditOrPayPopup = false;
    component.ngOnInit();
    expect(component.isEditOrPayPopup).toBeFalsy();
  });

  it('setTitles should be called onInit', () => {
    const setTitlesSpy = spyOn(component as any, 'setTitles');
    component.ngOnInit();
    expect(setTitlesSpy).toHaveBeenCalled();
  });

  it('should call userReply with undefined if isEditOrPayPopup is true on a backdrop click', () => {
    const mockBackdrop = new Subject<void>();
    dialogRefStub.backdropClick = () => mockBackdrop.asObservable();
    spyOn(component, 'userReply');
    component.data.isEditOrPayPopup = true;

    component.ngOnInit();
    mockBackdrop.next();

    expect(component.isEditOrPayPopup).toBeTrue();
    expect(component.userReply).toHaveBeenCalledWith(undefined);
  });

  it('should call userReply with false if isEditOrPayPopup isnt true on a backdrop click', () => {
    const mockBackdrop = new Subject<void>();
    dialogRefStub.backdropClick = () => mockBackdrop.asObservable();
    spyOn(component, 'userReply');
    component.data.isEditOrPayPopup = false;

    component.ngOnInit();
    mockBackdrop.next();

    expect(component.isEditOrPayPopup).toBeFalsy();
    expect(component.userReply).toHaveBeenCalledWith(false);
  });

  it('should call userReply with undefined if isEditOrPayPopup is true on Escape keydown', () => {
    const mockKeydown = new Subject<KeyboardEvent>();
    dialogRefStub.keydownEvents = () => mockKeydown.asObservable();
    spyOn(component, 'userReply');
    component.data.isEditOrPayPopup = true;

    component.ngOnInit();
    mockKeydown.next(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.userReply).toHaveBeenCalledWith(undefined);
  });

  it('should call userReply with false if isEditOrPayPopup is false on Escape keydown', () => {
    const mockKeydown = new Subject<KeyboardEvent>();
    dialogRefStub.keydownEvents = () => mockKeydown.asObservable();
    spyOn(component, 'userReply');
    component.data.isEditOrPayPopup = false;

    component.ngOnInit();
    mockKeydown.next(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.userReply).toHaveBeenCalledWith(false);
  });
});
