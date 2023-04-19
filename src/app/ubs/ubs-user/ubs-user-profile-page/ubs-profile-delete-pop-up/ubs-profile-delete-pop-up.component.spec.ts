import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { UbsProfileDeletePopUpComponent } from './ubs-profile-delete-pop-up.component';

describe('UbsProfileDeletePopUpComponent', () => {
  let component: UbsProfileDeletePopUpComponent;
  let fixture: ComponentFixture<UbsProfileDeletePopUpComponent>;
  const viewModeInputs = {
    isAddressDelete: {}
  };
  class MatDialogMock {
    open() {
      return {};
    }
  }

  class MatDialogMock {
    open() {
      return {};
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsProfileDeletePopUpComponent],
      providers: [
        { prodive: MatDialog, useClass: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: viewModeInputs }
      ],
      imports: [TranslateModule.forRoot(), MatDialogModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
});
