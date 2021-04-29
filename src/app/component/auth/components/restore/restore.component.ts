import { Component } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { RestorePasswordService } from '../../../../service/auth/restore-password.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styles: ['.btn { width: 200px; }', '.btn-wrp { margin-top: 40px; text-align: center }'],
})
export class RestoreComponent {
  public email: string;
  public currentLanguage: string;

  constructor(private restorePasswordService: RestorePasswordService, private localStorageService: LocalStorageService) {}

  public sentEmail(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.restorePasswordService.sendEmailForRestore(this.email, this.currentLanguage);
  }
}
