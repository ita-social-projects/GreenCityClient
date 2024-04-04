import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  const translationKeysMock = { title: 'dialog title', text: 'dialog text', confirm: 'ok', cancel: 'x' };
  const dialogRefMock = { close: () => {} };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [TranslateModule.forRoot(), MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: translationKeysMock },
        { provide: MatDialogRef, useValue: dialogRefMock }
      ]
    });
  }));

  const buildComponent = async () => {
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const getAllElements = () => {
    const title = fixture.debugElement.query(By.directive(MatDialogTitle));
    const text = fixture.debugElement.query(By.directive(MatDialogContent));
    const cancelButton = fixture.debugElement.query(By.directive(MatDialogActions)).query(By.css('.cancel-button'));
    const confirmButton = fixture.debugElement.query(By.directive(MatDialogActions)).query(By.css('.submit-button'));
    return { title, text, cancelButton, confirmButton };
  };

  it('should create', async () => {
    await buildComponent();
    expect(component).toBeTruthy();
  });

  it('should display all translation keys', async () => {
    await buildComponent();
    const { title, text, cancelButton, confirmButton } = getAllElements();
    expect(title.nativeElement.textContent).toContain('dialog title');
    expect(text.nativeElement.textContent).toContain('dialog text');
    expect(cancelButton.nativeElement.textContent).toContain('x');
    expect(confirmButton.nativeElement.textContent).toContain('ok');
  });

  it('should have default translation keys if none provided', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
    await buildComponent();
    const { title, text, cancelButton, confirmButton } = getAllElements();
    expect(title.nativeElement.textContent).toContain('confirmation-dialog.title');
    expect(cancelButton.nativeElement.textContent).toContain('confirmation-dialog.buttons.cancel');
    expect(confirmButton.nativeElement.textContent).toContain('confirmation-dialog.buttons.confirm');
  });

  it('should close emitting `true` if `confirm` was clicked', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
    await buildComponent();
    const { confirmButton } = getAllElements();
    const closeSpy = spyOn(dialogRefMock, 'close');
    confirmButton.triggerEventHandler('click', null);
    expect(closeSpy).toHaveBeenCalledWith();
  });

  it('should close emitting `false` if `cancel` was clicked', async () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: null });
    await buildComponent();
    const { cancelButton } = getAllElements();
    const closeSpy = spyOn(dialogRefMock, 'close');
    cancelButton.triggerEventHandler('click', null);
    expect(closeSpy).toHaveBeenCalledWith();
  });
});
