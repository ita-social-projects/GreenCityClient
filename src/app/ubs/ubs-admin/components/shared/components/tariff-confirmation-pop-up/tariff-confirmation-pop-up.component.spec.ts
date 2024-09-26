import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TariffConfirmationPopUpComponent } from './tariff-confirmation-pop-up.component';
import { TariffConfirmationPopUpInterface } from 'src/app/ubs/ubs-admin/models/ubs-pop-up.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TariffConfirmationPopUpComponent', () => {
  let component: TariffConfirmationPopUpComponent;
  let fixture: ComponentFixture<TariffConfirmationPopUpComponent>;

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TariffConfirmationPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialogRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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

  it('should open a dialog in onNoClick', () => {
    matDialogMock.open.and.returnValue(fakeMatDialogRef);
    component.onNoClick();
    expect(matDialogMock.open).toHaveBeenCalled();
    expect(fakeMatDialogRef.afterClosed).toHaveBeenCalled();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog in actionClick', () => {
    component.actionClick();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });
});
