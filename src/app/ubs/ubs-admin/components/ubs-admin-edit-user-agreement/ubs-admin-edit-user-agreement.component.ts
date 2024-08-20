import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@ubs/ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { TUserAgreementText } from '@ubs/ubs-admin/models/user-agreement.interface';
import { AdminUserAgreementService } from '@ubs/ubs-admin/services/admin-user-agreement/admin-user-agreement.service';
import { filter, take } from 'rxjs';
import { quillConfigAdmin } from 'src/app/main/component/eco-news/components/create-edit-news/quillEditorFunc';

@Component({
  selector: 'app-ubs-admin-edit-user-agreement',
  templateUrl: './ubs-admin-edit-user-agreement.component.html',
  styleUrls: ['./ubs-admin-edit-user-agreement.component.scss']
})
export class UbsAdminEditUserAgreementComponent implements OnInit {
  private confirmVersionChangeData = {
    title: 'ubs-user-agreement.confirm-version-change',
    text: 'ubs-user-agreement.changes-will-be-lost',
    confirm: 'ubs-user-agreement.btn.confirm',
    cancel: 'ubs-user-agreement.btn.back'
  };

  private confirmSaveData = {
    data: {
      title: 'ubs-user-agreement.confirm-save',
      text: 'ubs-user-agreement.save-changes',
      confirm: 'ubs-user-agreement.btn.save',
      cancel: 'ubs-user-agreement.btn.back'
    },
    hasBackdrop: true
  };

  private adminUserAgreementService: AdminUserAgreementService = inject(AdminUserAgreementService);

  userAgreementForm: FormGroup = new FormGroup({});
  quillModules = quillConfigAdmin;
  languages = ['Ua', 'En'];
  versions: string[] = [];
  selectedVersion = 'latest';
  currentVersion = 'latest';
  author: string;
  date: Date;
  isLoading = false;

  constructor(private dialog: MatDialog) {}

  getUserAgreementControl(lang: string): FormControl<string> {
    return this.userAgreementForm.get(`userAgreement${lang}`) as FormControl<string>;
  }

  ngOnInit(): void {
    this.loadVersions();
    this.initForm();
  }

  initForm(): void {
    this.languages.forEach((lang) => {
      this.userAgreementForm.addControl(
        `userAgreement${lang}`,
        new FormControl<string>('', [Validators.required, Validators.maxLength(64365)])
      );
    });
  }

  onSave(): void {
    const userAgreement: TUserAgreementText = {
      textUa: '',
      textEn: ''
    };

    this.languages.forEach((lang) => {
      userAgreement[`text${lang}`] = this.getUserAgreementControl(lang).value;
    });

    this.confirmSave(userAgreement);
  }

  onVersionSelect(event: Event): void {
    const version = (event.target as HTMLSelectElement).value;

    if (this.languages.some((lang) => this.getUserAgreementControl(lang).dirty)) {
      this.confirmVersionChange(version);
    } else {
      this.loadUserAgreement(version);
    }
  }

  private loadUserAgreement(version?: string): void {
    this.isLoading = true;
    if (version) {
      this.currentVersion = version;
    }

    this.adminUserAgreementService
      .getUserAgreement(this.currentVersion)
      .pipe(take(1))
      .subscribe((userAgreement) => {
        this.author = userAgreement.authorEmail;
        this.date = new Date(userAgreement.createdAt + 'Z'); // 'Z' is added to convert date to UTC

        this.languages.forEach((lang) => {
          const control = this.getUserAgreementControl(lang);
          control.setValue(userAgreement[`text${lang}`]);
          control.markAsPristine();
        });

        this.isLoading = false;
      });
  }

  private loadVersions(): void {
    this.isLoading = true;

    this.adminUserAgreementService
      .getAllVersions()
      .pipe(take(1))
      .subscribe((versions) => {
        this.versions = versions;
        this.currentVersion = this.versions[0];
        this.selectedVersion = this.currentVersion;
        this.loadUserAgreement();
      });
  }

  private confirmVersionChange(version: string): void {
    const matDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: this.confirmVersionChangeData,
      hasBackdrop: true
    });

    matDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) {
          this.loadUserAgreement(version);
        } else {
          this.selectedVersion = this.currentVersion;
        }
      });
  }

  private confirmSave(userAgreement: TUserAgreementText): void {
    const matDialogRef = this.dialog.open(ConfirmationDialogComponent, this.confirmSaveData);

    matDialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe((res) => {
        this.saveUserAgreement(userAgreement);
      });
  }

  private saveUserAgreement(userAgreement: TUserAgreementText): void {
    this.adminUserAgreementService
      .updateUserAgreement(userAgreement)
      .pipe(take(1))
      .subscribe(() => {
        this.loadVersions();
      });
  }
}
