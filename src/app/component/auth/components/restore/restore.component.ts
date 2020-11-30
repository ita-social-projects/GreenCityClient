import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { RestorePasswordService } from '../../../../service/auth/restore-password.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html'
})
export class RestoreComponent implements OnInit {
  public email: string;
  public currentLanguage: string;

  constructor(private restorePasswordService: RestorePasswordService,
              private localStorageService: LocalStorageService) {}

  ngOnInit() {}

  public sentEmail(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.restorePasswordService.sendEmailForRestore(this.email, this.currentLanguage);
  }
}
