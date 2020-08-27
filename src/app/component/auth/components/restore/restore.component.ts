import { Component, OnInit } from '@angular/core';
import { RestorePasswordService } from '../../../../service/auth/restore-password.service';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html'
})
export class RestoreComponent implements OnInit {
  email: string;

  constructor(private restorePasswordService: RestorePasswordService) {}

  sentEmail() {
    this.restorePasswordService.sendEmailForRestore(this.email);
  }

  ngOnInit() {}
}
