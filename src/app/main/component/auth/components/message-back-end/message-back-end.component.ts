import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-message-back-end',
  templateUrl: './message-back-end.component.html',
  styleUrls: ['./message-back-end.component.scss']
})
export class MessageBackEndComponent implements OnChanges {
  @Input() public controlMessage: string;
  public errorMessage = '';

  ngOnChanges() {
    this.getType();
  }

  getMessage() {
    if (this.controlMessage === 'already-sent') {
      return 'user.auth.forgot-password.already-sent';
    } else if (this.controlMessage === 'email-not-exist') {
      return 'user.auth.forgot-password.email-not-exist';
    } else {
      return 'attention.error.default';
    }
  }

  getType() {
    this.errorMessage = this.getMessage();
    return this.errorMessage;
  }
}
