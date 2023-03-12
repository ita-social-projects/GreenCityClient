import { Component, Inject, ViewChild, ElementRef, Input, HostListener, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-ubs-admin-notification-edit-form',
  templateUrl: './ubs-admin-notification-edit-form.component.html',
  styleUrls: ['./ubs-admin-notification-edit-form.component.scss']
})
export class UbsAdminNotificationEditFormComponent implements AfterViewChecked {
  form: FormGroup;
  platform = '';

  items = ['name', 'email', 'id'];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { platform: string; text: { en: string; ua: string } },
    public dialogRef: MatDialogRef<UbsAdminNotificationEditFormComponent>,
    private cdref: ChangeDetectorRef
  ) {
    this.platform = data.platform;
    this.form = this.fb.group({
      textEn: [data.text.en],
      textUa: [data.text.ua]
    });
  }

  @ViewChild('textUa', { static: false }) textUa: ElementRef<HTMLInputElement>;
  @ViewChild('textEn', { static: false }) textEn: ElementRef<HTMLInputElement>;

  @ViewChild('selectEn', { static: false }) selectEn: MatSelect;
  @ViewChild('selectUa', { static: false }) selectUa: MatSelect;

  ngAfterViewChecked(): void {
    this.selectEn.value = 0;
    this.selectUa.value = 0;
    this.cdref.detectChanges();
  }

  addMention(selectElement: string, ref: string) {
    const textToAdd = selectElement;
    const el = this[ref].nativeElement;

    const selectionStart = el.selectionStart;
    const selectionEnd = el.selectionEnd;

    const hasSelection = selectionStart !== selectionEnd;

    if (hasSelection) {
      el.value = el.value.substring(0, selectionStart) + textToAdd + el.value.substring(selectionEnd, el.value.length);
      el.selectionStart = el.selectionEnd = selectionStart + textToAdd.length;
    } else {
      el.value = el.value.substring(0, selectionStart) + textToAdd + el.value.substring(selectionStart, el.value.length);
    }

    const newSelectionStart = selectionStart + textToAdd.length;
    const newSelectionEnd = selectionEnd + textToAdd.length;

    el.setSelectionRange(newSelectionStart, newSelectionEnd);
    el.focus();
    this.form.patchValue({ [ref]: el.value });
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

  textDecorator(text: string) {
    return '$' + `{${text}}`;
  }
}
