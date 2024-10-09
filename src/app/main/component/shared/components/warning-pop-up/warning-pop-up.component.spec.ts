import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WarningPopUpComponent } from '@shared/components';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { of } from 'rxjs';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';

describe('WarningPopUpComponent', () => {
  let component: WarningPopUpComponent;
  let fixture: ComponentFixture<WarningPopUpComponent>;

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
    popupTitle: 'popupTitle',
    popupSubtitle: 'popupSubtitle',
    popupCancel: 'popupCancel',
    popupConfirm: 'popupConfirm'
  };

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WarningPopUpComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule, BrowserDynamicTestingModule, HttpClientTestingModule, StoreModule.forRoot({})],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: popupDataStub },
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Testing the basic functionality', () => {
    it('should set titles after setTitles method', () => {
      component.ngOnInit();

      expect(component.popupTitle).toBe(popupDataStub.popupTitle);
      expect(component.popupSubtitle).toBe(popupDataStub.popupSubtitle);
      expect(component.popupCancel).toBe(popupDataStub.popupCancel);
      expect(component.popupConfirm).toBe(popupDataStub.popupConfirm);
    });
  });
});
