import { AfterViewInit, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { UserMessagesService } from '../../services/user-messages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-body',
  templateUrl: './notification-body.component.html',
  styleUrls: ['./notification-body.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificationBodyComponent implements AfterViewInit {
  @Input() body: string;
  @Input() orderId: number;
  buttonRedirect: any;

  constructor(public userMessagesService: UserMessagesService, public router: Router, private elementRef: ElementRef) {}

  redirectToPayment() {
    this.router.navigate(['ubs/notification/confirm/' + this.orderId]);
  }

  ngAfterViewInit(): void {
    if (this.elementRef.nativeElement.querySelector('.button-pay')) {
      this.elementRef.nativeElement.querySelector('.button-pay').addEventListener('click', this.redirectToPayment.bind(this));
    }
  }
}
