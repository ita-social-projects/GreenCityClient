import { Component, Input, ViewEncapsulation } from '@angular/core';
import { UserMessagesService } from '../../services/user-messages.service';

@Component({
  selector: 'app-notification-body',
  templateUrl: './notification-body.component.html',
  styleUrls: ['./notification-body.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class NotificationBodyComponent {
  @Input() body: string;

  constructor(public userMessagesService: UserMessagesService) {}

}
