import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@ubs/ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { filter, forkJoin, Observable, take } from 'rxjs';
import { AdminTelegramBotResponseService } from '@ubs/ubs-admin/services/admin-edit-telegram-bot/admin-edit-telegram-bot.service';
import { LANGUAGES, TTelegramBotMessage, TTransformedBotData } from '@ubs/ubs-admin/models/telegram-bot-responses.interface';

@Component({
  selector: 'app-ubs-admin-edit-telegram-bot',
  templateUrl: './ubs-admin-edit-telegram-bot.component.html',
  styleUrls: ['./ubs-admin-edit-telegram-bot.component.scss']
})
export class UbsAdminEditTelegramBotComponent implements OnInit {
  private adminTelegramBotResponseService: AdminTelegramBotResponseService = inject(AdminTelegramBotResponseService);
  private dialog: MatDialog = inject(MatDialog);
  private confirmSaveData = {
    data: {
      title: 'ubs-user-agreement.confirm-save',
      text: 'ubs-user-agreement.save-changes',
      confirm: 'ubs-user-agreement.btn.save',
      cancel: 'ubs-user-agreement.btn.back'
    },
    hasBackdrop: true
  };
  isCollapsed = true;
  telegramResponsesContent: TTransformedBotData;
  isLoading = false;
  telegramResponsesContentForm: FormGroup = new FormGroup({});
  readonly languages = Object.values(LANGUAGES);

  ngOnInit() {
    this.getTelegramContent();
  }

  private responseToForm(messages: TTelegramBotMessage[]): TTransformedBotData {
    const transformedData: TTransformedBotData = { en: {}, uk: {} };

    messages.forEach((message) => {
      if (!message || typeof message.id === 'undefined' || !message.text || !message.lang || !message.messageType) {
        console.error('Received invalid message data:', message);
        return;
      }

      const sectionKey = message.messageType;
      const fieldKey = 'message';
      const langKey = message.lang.toLowerCase() as 'en' | 'uk';

      if (!transformedData[langKey][sectionKey]) {
        transformedData[langKey][sectionKey] = {};
      }

      const messageData = {
        text: message.text,
        id: message.id
      };

      transformedData[langKey][sectionKey][fieldKey] = messageData;
    });

    return transformedData;
  }

  initForm(): void {
    this.telegramResponsesContentForm = new FormGroup({});
    this.languages.forEach((lang) => {
      const langKey = lang.toLowerCase() as 'en' | 'uk';
      if (!this.telegramResponsesContent || !this.telegramResponsesContent[langKey]) {
        return;
      }
      for (const section in this.telegramResponsesContent[langKey]) {
        const content = this.telegramResponsesContent[langKey][section];
        for (const field in content) {
          const inputName = lang + section + field;
          const textValue = content[field]?.text ?? '';

          this.telegramResponsesContentForm.addControl(
            inputName,
            new FormControl<string>(textValue, [Validators.required, Validators.maxLength(512)])
          );
        }
      }
    });
  }

  getTelegramContent() {
    this.isLoading = true;
    this.adminTelegramBotResponseService
      .getTelegramBotResponses()
      .pipe(take(1))
      .subscribe((res) => {
        if (!res || !res.page) {
          this.telegramResponsesContent = { en: {}, uk: {} };
        } else {
          this.telegramResponsesContent = this.responseToForm(res.page);
        }
        this.initForm();
        this.setFormValueWithCurrentContent();
        this.isLoading = false;
      });
  }

  getFormControl(lang: string, section: string, field: string): FormControl {
    return this.telegramResponsesContentForm.get(lang + section + field) as FormControl;
  }

  setFormValueWithCurrentContent() {
    this.languages.forEach((lang) => {
      const langKey = lang.toLowerCase() as 'en' | 'uk';
      if (!this.telegramResponsesContent || !this.telegramResponsesContent[langKey]) {
        return;
      }
      for (const section in this.telegramResponsesContent[langKey]) {
        const content = this.telegramResponsesContent[langKey][section];
        for (const field in content) {
          const control = this.getFormControl(lang, section, field);
          if (control) {
            control.setValue(content[field]?.text ?? '');
          }
        }
      }
    });
  }

  onSave() {
    if (this.telegramResponsesContentForm.invalid) {
      this.telegramResponsesContentForm.markAllAsTouched();
      return;
    }
    const updatedContent = structuredClone(this.telegramResponsesContent);

    this.languages.forEach((lang) => {
      const langKey = lang.toLowerCase() as 'en' | 'uk';
      for (const section in updatedContent[langKey]) {
        const content = updatedContent[langKey][section];
        for (const field in content) {
          const control = this.getFormControl(lang, section, field);
          if (control) {
            if (updatedContent[langKey][section][field]) {
              updatedContent[langKey][section][field].text = control.value;
            }
          }
        }
      }
    });

    const matDialogRef = this.dialog.open(ConfirmationDialogComponent, this.confirmSaveData);

    matDialogRef
      .afterClosed()
      .pipe(take(1), filter(Boolean))
      .subscribe(() => {
        this.publishChanges(updatedContent);
      });
  }

  publishChanges(newContent: TTransformedBotData) {
    this.isLoading = true;
    const updateCalls: Observable<void>[] = [];

    this.languages.forEach((lang) => {
      const langKey = lang.toLowerCase() as 'en' | 'uk';
      for (const section in newContent[langKey]) {
        for (const field in newContent[langKey][section]) {
          const originalData = this.telegramResponsesContent?.[langKey]?.[section]?.[field];
          const newData = newContent?.[langKey]?.[section]?.[field];

          if (originalData && newData && originalData.text !== newData.text) {
            updateCalls.push(this.adminTelegramBotResponseService.updateTelegramBotResponses(newData.id, newData.text));
          }
        }
      }
    });

    if (updateCalls.length === 0) {
      this.isLoading = false;
      return;
    }

    forkJoin(updateCalls)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getTelegramContent();
        },
        error: (err) => {
          console.error('Error during updates:', err);
        }
      });
  }
  collapseView() {
    this.isCollapsed = !this.isCollapsed;
  }
}
