import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@ubs/ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';
import { filter, forkJoin, Observable, take } from 'rxjs';
import { AdminTelegramBotResponseService } from '@ubs/ubs-admin/services/admin-edit-telegram-bot/admin-edit-telegram-bot.service';
import { TTelegramBotMessage, TTransformedBotData } from '@ubs/ubs-admin/models/telegram-bot-responses.interface';
import { UbsAdminEditComponent } from '@ubs/ubs-admin/components/ubs-admin-edit/ubs-admin-edit';

@Component({
  selector: 'app-ubs-admin-edit-telegram-bot',
  templateUrl: './ubs-admin-edit-telegram-bot.component.html',
  styleUrls: ['./ubs-admin-edit-telegram-bot.component.scss']
})
export class UbsAdminEditTelegramBotComponent extends UbsAdminEditComponent implements OnInit {
  telegramResponsesContent: TTransformedBotData;
  telegramResponsesContentForm: FormGroup = new FormGroup({});

  constructor(
    protected dialog: MatDialog,
    private adminTelegramBotResponseService: AdminTelegramBotResponseService
  ) {
    super(dialog);
  }

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

    if (!this.telegramResponsesContent) {
      return;
    }

    this.iterateContent(this.telegramResponsesContent, (lang, section, field, value) => {
      const inputName = lang + section + field;
      const textValue = value?.text ?? '';
      this.telegramResponsesContentForm.addControl(
        inputName,
        new FormControl<string>(textValue, [Validators.required, Validators.maxLength(512)])
      );
    });
  }

  getTelegramContent() {
    this.isLoading = true;
    this.adminTelegramBotResponseService.getTelegramBotResponses().subscribe((res) => {
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

  setFormValueWithCurrentContent(): void {
    if (!this.telegramResponsesContent) {
      return;
    }

    this.iterateContent(this.telegramResponsesContent, (lang, section, field, value) => {
      const control = this.getFormControl(lang, section, field);
      if (control) {
        control.setValue(value?.text ?? '');
      }
    });
  }

  onSave() {
    if (this.telegramResponsesContentForm.invalid) {
      this.telegramResponsesContentForm.markAllAsTouched();
      return;
    }

    const updatedContent = structuredClone(this.telegramResponsesContent);

    this.iterateContent(updatedContent, (lang, section, field, value) => {
      const control = this.getFormControl(lang, section, field);
      if (control && value) {
        value.text = control.value;
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

    this.iterateContent(newContent, (lang, section, field, newData) => {
      const langKey = lang.toLowerCase() as 'en' | 'uk';
      const originalData = this.telegramResponsesContent?.[langKey]?.[section]?.[field];

      if (originalData && newData && originalData.text !== newData.text) {
        updateCalls.push(this.adminTelegramBotResponseService.updateTelegramBotResponses(newData.id, newData.text));
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
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error during updates:', err);
          this.isLoading = false;
        }
      });
  }
}
