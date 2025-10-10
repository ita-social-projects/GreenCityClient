import { Component, inject, OnInit } from '@angular/core';
import { AdminUserAgreementService } from '@ubs/ubs-admin/services/admin-homepage-settings/admin-homepage-settings.service';
import { THomepageContent, THomepageContentChange } from '@ubs/ubs-admin/models/homepage-settings.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@ubs/ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { filter, Observable, take } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-edit-homepage',
  templateUrl: './ubs-admin-edit-homepage.component.html',
  styleUrls: ['./ubs-admin-edit-homepage.component.scss']
})
export class UbsAdminEditHomepageComponent implements OnInit {
  private adminHomepageSettingsService: AdminUserAgreementService = inject(AdminUserAgreementService);
  private confirmSaveData = {
    data: {
      title: 'ubs-user-agreement.confirm-save',
      text: 'ubs-user-agreement.save-changes',
      confirm: 'ubs-user-agreement.btn.save',
      cancel: 'ubs-user-agreement.btn.back'
    },
    hasBackdrop: true
  };

  homepageContent: THomepageContent;
  isLoading = false;
  homepageContentForm: FormGroup = new FormGroup({});
  languages = ['Uk', 'En'];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.isLoading = true;
    this.adminHomepageSettingsService
      .getHomepageContent()
      .pipe(take(1))
      .subscribe((homepageContent) => {
        this.homepageContent = homepageContent;
        this.initForm();
        this.setFormValueWithCurrentContent();
        this.isLoading = false;
      });
  }

  initForm(): void {
    this.languages.forEach((lang) => {
      for (const section in this.homepageContent[lang.toLowerCase()]) {
        const content = this.homepageContent[lang.toLowerCase()][section];
        for (const field in content) {
          const inputName = lang + section + field;
          this.homepageContentForm.addControl(inputName, new FormControl<string>('', [Validators.required, Validators.maxLength(512)]));
          this.homepageContentForm.get(inputName).setValue(content[field]);
        }
      }
    });
  }

  getHomepageContent() {
    this.isLoading = true;
    this.adminHomepageSettingsService.getHomepageContent().subscribe((homepageContent) => {
      this.homepageContent = homepageContent;
      this.setFormValueWithCurrentContent();
      this.isLoading = false;
    });
  }

  getFormControl(lang: string, section: string, field: string) {
    return this.homepageContentForm.get(lang + section + field);
  }

  setFormValueWithCurrentContent() {
    this.languages.forEach((lang) => {
      for (const section in this.homepageContent[lang.toLowerCase()]) {
        const content = this.homepageContent[lang.toLowerCase()][section];
        for (const field in content) {
          const control = this.getFormControl(lang, section, field);
          control.setValue(content[field]);
        }
      }
    });
  }

  onSave() {
    const result = structuredClone(this.homepageContent);
    this.languages.forEach((lang) => {
      for (const section in this.homepageContent[lang.toLowerCase()]) {
        const content = this.homepageContent[lang.toLowerCase()][section];
        for (const field in content) {
          const control = this.getFormControl(lang, section, field);
          result[lang.toLowerCase()][section][field] = control.value;
        }
      }
    });
    const matDialogRef = this.dialog.open(ConfirmationDialogComponent, this.confirmSaveData);

    matDialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe((res) => {
        this.publishChanges(result);
      });
  }

  publishChanges(newSettings: THomepageContent) {
    const changes = this.getContentChanges(newSettings);
    console.log(changes);
    for (const section in changes) {
      this.adminHomepageSettingsService.updateHomepageContent(section.toUpperCase(), changes[section]).subscribe((res) => {
        this.getHomepageContent();
      });
    }
  }

  getContentChanges(newContent: THomepageContent) {
    const changes = {};
    this.languages.forEach((lang) => {
      for (const section in newContent[lang.toLowerCase()]) {
        const newSection = newContent[lang.toLowerCase()][section];
        for (const field in newSection) {
          const currentValue = this.homepageContent[lang.toLowerCase()][section][field];
          const newValue = newSection[field];
          if (currentValue === newValue) {
            continue;
          }
          changes[section] = changes[section] ? changes[section] : [];
          if (changes[section].find((change) => change.field === field)) {
            changes[section].find((change) => change.field === field)['value' + lang.toUpperCase()] = newValue;
          } else {
            changes[section].push({
              field: field,
              ['value' + lang.toUpperCase()]: newValue
            });
          }
        }
      }
    });
    for (const section in changes) {
      changes[section].forEach((change) => {
        change.valueUK = change.valueUK ? change.valueUK : this.homepageContent.uk[section][change.field];
        change.valueEN = change.valueEN ? change.valueEN : this.homepageContent.en[section][change.field];
      });
    }
    return changes;
  }
}
