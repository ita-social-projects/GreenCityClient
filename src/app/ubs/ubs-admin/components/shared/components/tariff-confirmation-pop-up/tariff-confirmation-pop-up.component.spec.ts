import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { TariffConfirmationPopUpComponent } from './tariff-confirmation-pop-up.component';

describe('TariffConfirmationPopUpComponent', () => {
  let component: TariffConfirmationPopUpComponent;
  let fixture: ComponentFixture<TariffConfirmationPopUpComponent>;

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TariffConfirmationPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialogRef }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffConfirmationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
