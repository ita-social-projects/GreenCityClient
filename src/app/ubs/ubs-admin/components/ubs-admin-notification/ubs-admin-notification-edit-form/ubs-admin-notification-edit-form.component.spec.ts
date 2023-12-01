import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminNotificationEditFormComponent } from './ubs-admin-notification-edit-form.component';
import { ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatSelect } from '@angular/material/select';

describe('UbsAdminNotificationEditFormComponent', () => {
  let component: UbsAdminNotificationEditFormComponent;
  let fixture: ComponentFixture<UbsAdminNotificationEditFormComponent>;

  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);
  class MockElementRef<T> extends ElementRef<T> {
    constructor() {
      super(null);
    }
  }
  const textUaMock = new MockElementRef<HTMLInputElement>();
  const textEnMock = new MockElementRef<HTMLInputElement>();

  const selectEnMock: MatSelect = { value: 0 } as MatSelect;
  const selectUaMock: MatSelect = { value: 0 } as MatSelect;

  const changeDetectorRefMock = jasmine.createSpyObj('changeDetectorRefMock', ['detectChanges']);

  const mockedData = {
    platform: 'email',
    text: { en: 'Notification text for email', ua: 'Текст повідомлення для email' }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationEditFormComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, MatExpansionModule, NoopAnimationsModule],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: ElementRef, useValue: { textUa: textUaMock, textEn: textEnMock } },
        { provide: MatSelect, useValue: { selectEn: selectEnMock, selectUa: selectUaMock } },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefMock },
        { provide: MatDialogRef, useValue: matDialogRefMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display text for en and ua versions', async () => {
    const [uaTextField, enTextField] = fixture.debugElement.queryAll(By.css('textarea')).map((de) => de.nativeElement);
    expect(uaTextField.value).toBe('Текст повідомлення для email');
    expect(enTextField.value).toBe('Notification text for email');
  });

  it('should pass new notification text translations through `DialogRef` when user clicks `change`', async () => {
    const changeButton = fixture.debugElement.query(By.css('.controls .submit-button'));
    const [uaTextField, enTextField] = fixture.debugElement.queryAll(By.css('textarea')).map((de) => de.nativeElement);
    uaTextField.value = 'Новий текст повідомлення для email';
    uaTextField.dispatchEvent(new Event('input'));
    enTextField.value = 'New notification text for email';
    enTextField.dispatchEvent(new Event('input'));

    changeButton.triggerEventHandler('click', null);
    expect(matDialogRefMock.close).toHaveBeenCalledWith({
      text: { en: 'New notification text for email', ua: 'Новий текст повідомлення для email' }
    });
  });

  it('should close the dialog when onCancel() is called', () => {
    component.onCancel();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should return decorated text when textDecorator() is called', () => {
    const sampleText = 'SAMPLE_TEXT';
    const expectedResult = '$' + `{${sampleText}}`;
    expect(component.textDecorator(sampleText)).toEqual(expectedResult);
  });

  it('should call dialogRef.close with updated text values when onSubmit() is called', () => {
    const changeButton = fixture.debugElement.query(By.css('.controls .submit-button'));
    const [uaTextField, enTextField] = fixture.debugElement.queryAll(By.css('textarea')).map((de) => de.nativeElement);

    uaTextField.value = 'Новий текст повідомлення для email';
    uaTextField.dispatchEvent(new Event('input'));
    enTextField.value = 'New notification text for email';
    enTextField.dispatchEvent(new Event('input'));

    component.onSubmit();

    expect(matDialogRefMock.close).toHaveBeenCalledWith({
      text: { en: 'New notification text for email', ua: 'Новий текст повідомлення для email' }
    });
  });

  it('should set selectEn and selectUa values to 0 and call detectChanges after view checked', () => {
    component.textUa = textUaMock;
    component.textEn = textEnMock;
    component.selectEn = selectEnMock;
    component.selectUa = selectUaMock;
    (component as any).cdref = changeDetectorRefMock;

    component.ngAfterViewChecked();

    expect(component.selectEn.value).toEqual(0);
    expect(component.selectUa.value).toEqual(0);
    expect(changeDetectorRefMock.detectChanges).toHaveBeenCalled();
  });
});
