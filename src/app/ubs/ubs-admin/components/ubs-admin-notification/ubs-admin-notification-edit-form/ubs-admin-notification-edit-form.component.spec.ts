import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { UbsAdminNotificationEditFormComponent } from './ubs-admin-notification-edit-form.component';

describe('UbsAdminNotificationEditFormComponent', () => {
  let component: UbsAdminNotificationEditFormComponent;
  let fixture: ComponentFixture<UbsAdminNotificationEditFormComponent>;

  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);

  const mockedData = {
    platform: 'email',
    text: { en: 'Notification text for email', ua: 'Текст повідомлення для email' }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationEditFormComponent],
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, MatExpansionModule, NoopAnimationsModule],
      providers: [FormBuilder, { provide: MAT_DIALOG_DATA, useValue: mockedData }, { provide: MatDialogRef, useValue: matDialogRefMock }]
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
});
