import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UbsProfileDeletePopUpComponent } from './ubs-profile-delete-pop-up.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';

describe('UbsProfileDeletePopUpComponent', () => {
  let component: UbsProfileDeletePopUpComponent;
  let fixture: ComponentFixture<UbsProfileDeletePopUpComponent>;

  const fakeTitles = {
    popupTitle: 'popupTitle',
    popupSubtitle: 'popupSubtitle',
    popupConfirm: 'popupSubtitle',
    popupCancel: 'popupSubtitle'
  };

  const dialogRefStub = {
    keydownEvents() {
      return of();
    },
    backdropClick() {
      return of();
    },
    close() {}
  };
  const matDialogRef = 'matDialogRef';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsProfileDeletePopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, BrowserDynamicTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: fakeTitles }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsProfileDeletePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setTitles be called in ngOnInit', () => {
    const spy = spyOn(UbsProfileDeletePopUpComponent.prototype as any, 'setTitles');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should backdropClick be called in ngOnInit', () => {
    const spy = spyOn(component[matDialogRef], 'backdropClick').and.returnValue(of());
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set titles after setTitles method', () => {
    component.popupTitle = 'fake';
    component.popupSubtitle = 'fake';
    component.popupCancel = 'fake';
    component.popupConfirm = 'fake';
    const setTitles = 'setTitles';
    component[setTitles]();
    expect(component.popupTitle).toBe(fakeTitles.popupTitle);
    expect(component.popupSubtitle).toBe(fakeTitles.popupSubtitle);
    expect(component.popupCancel).toBe(fakeTitles.popupCancel);
    expect(component.popupConfirm).toBe(fakeTitles.popupConfirm);
  });

  it('should call close on matDialogRef', () => {
    const spy = spyOn(component[matDialogRef], 'close');
    component.onClickBtn(true);
    expect(spy).toHaveBeenCalledWith(true);
  });
});
