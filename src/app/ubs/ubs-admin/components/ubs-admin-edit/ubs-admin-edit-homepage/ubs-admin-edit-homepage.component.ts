import { Component, OnInit } from '@angular/core';
import { AdminHomepageSettingsService } from '@ubs/ubs-admin/services/admin-homepage-settings/admin-homepage-settings.service';
import { THomepageContent } from '@ubs/ubs-admin/models/homepage-settings.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@ubs/ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { filter, forkJoin, take } from 'rxjs';
import { UbsAdminEditComponent } from '@ubs/ubs-admin/components/ubs-admin-edit/ubs-admin-edit';

@Component({
  selector: 'app-ubs-admin-edit-homepage',
  templateUrl: './ubs-admin-edit-homepage.component.html',
  styleUrls: ['./ubs-admin-edit-homepage.component.scss']
})
export class UbsAdminEditHomepageComponent extends UbsAdminEditComponent implements OnInit {
  homepageContent: THomepageContent;
  homepageContentForm: FormGroup = new FormGroup({});

  constructor(
    protected dialog: MatDialog,
    private adminHomepageSettingsService: AdminHomepageSettingsService
  ) {
    super(dialog);
  }

  ngOnInit() {
    this.isLoading = true;
    this.getHomepageContent(true);
  }

  initForm(): void {
    this.homepageContentForm = new FormGroup({});

    this.iterateContent(this.homepageContent, (lang, section, field, value) => {
      const inputName = lang + section + field;
      this.homepageContentForm.addControl(inputName, new FormControl<string>('', [Validators.required, Validators.maxLength(512)]));
      this.homepageContentForm.get(inputName)?.setValue(value);
    });
  }

  getHomepageContent(initForm: boolean = false) {
    this.isLoading = true;
    this.adminHomepageSettingsService.getHomepageContent().subscribe({
      next: (homepageContent) => {
        this.homepageContent = homepageContent;
        if (initForm) {
          this.initForm();
        }
        this.setFormValueWithCurrentContent();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading homepage content:', error);
        this.isLoading = false;
      }
    });
  }

  getFormControl(lang: string, section: string, field: string) {
    return this.homepageContentForm.get(lang + section + field);
  }

  setFormValueWithCurrentContent() {
    this.iterateContent(this.homepageContent, (lang, section, field, value) => {
      const control = this.getFormControl(lang, section, field);
      control?.setValue(value);
    });
  }

  onSave() {
    if (this.homepageContentForm.invalid) {
      this.homepageContentForm.markAllAsTouched();
      return;
    }

    const result = structuredClone(this.homepageContent);

    this.iterateContent(this.homepageContent, (lang, section, field, value) => {
      const control = this.getFormControl(lang, section, field);
      result[lang.toLowerCase()][section][field] = control?.value;
    });

    const matDialogRef = this.dialog.open(ConfirmationDialogComponent, this.confirmSaveData);
    matDialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => {
        this.publishChanges(result);
      });
  }

  publishChanges(newSettings: THomepageContent) {
    this.isLoading = true;
    const changes = this.getContentChanges(newSettings);

    const updateCalls = Object.keys(changes).map((section) =>
      this.adminHomepageSettingsService.updateHomepageContent(section.toUpperCase(), changes[section])
    );

    if (updateCalls.length === 0) {
      this.isLoading = false;
      return;
    }

    forkJoin(updateCalls)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getHomepageContent();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error during updates:', err);
          this.isLoading = false;
        }
      });
  }

  getContentChanges(newContent: THomepageContent) {
    const changes: Record<string, any[]> = {};

    this.iterateContent(newContent, (lang, section, field, newValue) => {
      const currentValue = this.homepageContent[lang.toLowerCase()][section][field];
      if (currentValue === newValue) {
        return;
      }

      if (!changes[section]) {
        changes[section] = [];
      }
      const existing = changes[section].find((c) => c.field === field);
      if (existing) {
        existing['value' + lang.toUpperCase()] = newValue;
      } else {
        changes[section].push({ field, ['value' + lang.toUpperCase()]: newValue });
      }
    });

    Object.keys(changes).forEach((section) => {
      changes[section].forEach((change) => {
        change.valueUK = change.valueUK ?? this.homepageContent.uk[section][change.field];
        change.valueEN = change.valueEN ?? this.homepageContent.en[section][change.field];
      });
    });

    return changes;
  }
}
