import { Component } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { RestorePasswordService } from '@auth-service/restore-password/restore-password.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styles: ['.btn { width: 200px; }', '.btn-wrp { margin-top: 40px; text-align: center }']
})
export class RestoreComponent {
  email: string;
  currentLanguage: string;

  constructor(
    private restorePasswordService: RestorePasswordService,
    private localStorageService: LocalStorageService
  ) {}

  sentEmail(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.restorePasswordService.sendEmailForRestore(this.email, this.currentLanguage);
  }
}
