import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';
import { DomSanitizer } from '@angular/platform-browser';

import { ShowPdfPopUpComponent } from './show-pdf-pop-up.component';

describe('ShowPdfPopUpComponent', () => {
  let component: ShowPdfPopUpComponent;
  let fixture: ComponentFixture<ShowPdfPopUpComponent>;
  const fakeData = {
    pdfFile: 'http://fakeFile.pdf'
  };
  const dialogRefStub = {
    close() {}
  };
  const domSanitizerMock = jasmine.createSpyObj('sanitizer', ['sanitize', 'bypassSecurityTrustResourceUrl']);
  domSanitizerMock.sanitize.and.returnValue(fakeData.pdfFile);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ShowPdfPopUpComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: fakeData },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: DomSanitizer, useValue: domSanitizerMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPdfPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.ngOnInit();
      expect(component.pdfFile).toBe(fakeData.pdfFile);
      expect(domSanitizerMock.sanitize).toHaveBeenCalled();
      expect(domSanitizerMock.bypassSecurityTrustResourceUrl).toHaveBeenCalled();
    });
  });
});
