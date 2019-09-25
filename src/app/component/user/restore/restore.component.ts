import {Component, OnInit} from '@angular/core';
import {RestorePasswordService} from "../../../service/restore-password.service";


@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css']
})
export class RestoreComponent implements OnInit {
  private email: string;

  constructor(private restorePasswordService: RestorePasswordService) {
  }

  sentEmail() {
    this.restorePasswordService.sendEmailForRestore(this.email);
  }

  ngOnInit() {
  }


}
