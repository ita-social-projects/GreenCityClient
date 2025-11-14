import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LANGUAGES, TTransformedBotData } from '@ubs/ubs-admin/models/telegram-bot-responses.interface';
import { THomepageContent } from '@ubs/ubs-admin/models/homepage-settings.interface';

@Component({
  template: ''
})
export abstract class UbsAdminEditComponent {
  protected confirmSaveData = {
    data: {
      title: 'ubs-user-agreement.confirm-save',
      text: 'ubs-user-agreement.save-changes',
      confirm: 'ubs-user-agreement.btn.save',
      cancel: 'ubs-user-agreement.btn.back'
    },
    hasBackdrop: true
  };
  isLoading = false;
  isCollapsed = true;
  readonly languages = Object.values(LANGUAGES);

  protected constructor(protected dialog: MatDialog) {}

  abstract initForm(): void;

  abstract onSave(): void;

  abstract publishChanges(content: THomepageContent | TTransformedBotData): void;

  collapseView() {
    this.isCollapsed = !this.isCollapsed;
  }

  protected iterateContent(content: any, callback: (lang: string, section: string, field: string, value: any) => void): void {
    this.languages.forEach((lang) => {
      const langKey = lang.toLowerCase();
      Object.keys(content[langKey]).forEach((section) => {
        const con = content[langKey][section];
        Object.keys(con).forEach((field) => {
          callback(lang, section, field, con[field]);
        });
      });
    });
  }
}
