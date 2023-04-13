import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UbsProfileDeletePopUpComponent } from './ubs-profile-delete-pop-up.component';

describe('UbsProfileDeletePopUpComponent', () => {
  let component: UbsProfileDeletePopUpComponent;
  let fixture: ComponentFixture<UbsProfileDeletePopUpComponent>;
  const dialogMock = {
    open: () => {},
    close: () => {}
  };
  const viewModeInputs = {
    isAddressDelete: {}
  };
  const matDialogRefStub = jasmine.createSpyObj('matDialogRefStub', ['close']);
  matDialogRefStub.close = () => 'Close window please';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsProfileDeletePopUpComponent],
      providers: [
        { prodive: MatDialog, useValue: dialogMock },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: viewModeInputs }
      ],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsProfileDeletePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
