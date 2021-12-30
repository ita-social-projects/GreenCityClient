import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthModalComponent } from './auth-modal.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AuthModalComponent', async () => {
  const component: AuthModalComponent = TestBed.get(AuthModalComponent);
  let fixture: ComponentFixture<AuthModalComponent>;

  const MatDialogRefMock = {
    close: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthModalComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule, HttpClientModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: MatDialogRefMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthModalComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should call the function to close the dialog', () => {
    const spy = spyOn(component.matDialogRef, 'close');
    component.closeWindow();
    expect(spy).toHaveBeenCalled();
  });

  it('should change authPage after call the function changeAuthPage', () => {
    component.changeAuthPage('sign-up');
    expect(component.authPage).toBe('sign-up');
  });
});
