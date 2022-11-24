import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-notification-edit-form',
  templateUrl: './ubs-admin-notification-edit-form.component.html',
  styleUrls: ['./ubs-admin-notification-edit-form.component.scss']
})
export class UbsAdminNotificationEditFormComponent implements OnInit {
  form: FormGroup;
  platform = '';

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { platform: string; text: { en: string; ua: string } },
    public dialogRef: MatDialogRef<UbsAdminNotificationEditFormComponent>
  ) {
    this.platform = data.platform;
    this.form = this.fb.group({
      textEn: [data.text.en],
      textUa: [data.text.ua]
    });
  }

  ngOnInit(): void {
    // This is intentional
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const { textEn, textUa } = this.form.value;
    this.dialogRef.close({
      text: {
        en: textEn,
        ua: textUa
      }
    });
  }
}
