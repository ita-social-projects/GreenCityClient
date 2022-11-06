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

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { topic: { en: string; ua: string }; text: { en: string; ua: string } },
    public dialogRef: MatDialogRef<UbsAdminNotificationEditFormComponent>
  ) {
    this.form = this.fb.group({
      topicEn: [data.topic.en],
      topicUa: [data.topic.ua],
      textEn: [data.text.en],
      textUa: [data.text.ua]
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const { topicEn, topicUa, textEn, textUa } = this.form.value;
    this.dialogRef.close({
      topic: {
        en: topicEn,
        ua: topicUa
      },
      text: {
        en: textEn,
        ua: textUa
      }
    });
  }
}
