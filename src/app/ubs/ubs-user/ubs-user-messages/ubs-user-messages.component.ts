import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserMessagesService } from '../services/user-messages.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { NotificationBody } from '../../ubs-admin/models/ubs-user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShowImgsPopUpComponent } from '../../../shared/show-imgs-pop-up/show-imgs-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-ubs-user-messages',
  templateUrl: './ubs-user-messages.component.html',
  styleUrls: ['./ubs-user-messages.component.scss', '../styles/ubs-user-common.scss']
})
export class UbsUserMessagesComponent implements OnInit, OnDestroy {
  isAnyMessages = true;
  notifications: NotificationBody[];
  panelOpenState = false;
  page = 1;
  count = 0;
  pageSize = 10;
  isLoadSpinner: boolean;
  isLoadSmallSpinner: boolean;
  isLoadBar: boolean;
  images = [];
  public countOfMessages: number;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  destroy: Subject<boolean> = new Subject<boolean>();
  localization = {
    title: 'ubs-user-notification.title',
    id: 'ubs-user-notification.title-table.number',
    themeMessages: 'ubs-user-notification.title-table.theme-messages',
    time: 'ubs-user-notification.title-table.time'
  };

  mockData: NotificationBody[] = [
    {
      id: 1,
      orderId: 101,
      notificationTime: '2024-05-06T08:00:00',
      read: false,
      title: 'New Order Received',
      body: 'A new order has been received. Please process it promptly.'
    },
    {
      id: 2,
      orderId: 102,
      notificationTime: '2024-05-05T15:30:00',
      read: true,
      title: 'Order Shipped',
      body: 'Your order has been shipped and is on its way to you.'
    },
    {
      id: 3,
      orderId: 103,
      notificationTime: '2024-05-04T10:45:00',
      read: false,
      title: 'Payment Received',
      body: 'Payment for your order has been successfully received.'
    },
    {
      id: 4,
      orderId: 104,
      notificationTime: '2024-05-03T12:20:00',
      read: false,
      title: 'Order Delivered',
      body: 'Your order has been delivered to the specified address.'
    },
    {
      id: 5,
      orderId: 105,
      notificationTime: '2024-05-02T09:10:00',
      read: true,
      title: 'Order Cancelled',
      body: 'Unfortunately, your order has been cancelled.'
    },
    {
      id: 6,
      orderId: 106,
      notificationTime: '2024-05-01T17:55:00',
      read: true,
      title: 'Order Updated',
      body: 'There has been an update regarding your order.'
    },
    {
      id: 7,
      orderId: 107,
      notificationTime: '2024-04-30T14:15:00',
      read: false,
      title: 'New Message Received',
      body: 'You have received a new message. Please check your inbox.'
    },
    {
      id: 8,
      orderId: 108,
      notificationTime: '2024-04-29T11:25:00',
      read: true,
      title: 'Order Refunded',
      body: 'Your order has been refunded successfully.'
    }
  ];

  constructor(
    private userMessagesService: UserMessagesService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private bpObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.route.params.subscribe((val) => {
      this.page = +this.route.snapshot.paramMap.get('pageId');
      this.subscribeToLangChange();
    });
  }

  mobileTableHeader(th: string) {
    const isMobile = this.bpObserver.isMatched('(max-width: 700px)');
    return isMobile ? th.split(' ')[0] : th;
  }

  private subscribeToLangChange() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe(() => this.fetchNotification());
  }

  fetchNotification(): void {
    this.isLoadBar = true;
    this.userMessagesService
      .getNotification(this.page - 1, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (response) => {
          this.notifications = response.page;
          //REMOVE MOCK!!!
          this.notifications = this.mockData;
          //END MOCK DATA
          this.count = response.totalElements;
          this.isAnyMessages = this.notifications.length > 0;
          this.isLoadSpinner = this.isLoadBar = false;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  setRead(notificationId: number, isRead: boolean) {
    let isGetNotificationBody = true;
    let notificationItem: NotificationBody;
    notificationItem = this.notifications.find((item) => item.id === notificationId);
    if (notificationItem.body) {
      isGetNotificationBody = false;
    }
    if (!notificationItem.read) {
      this.userMessagesService.countOfNoReadeMessages--;
    }
    if (isGetNotificationBody) {
      this.notifications.forEach((item) => {
        if (item.id === notificationId) {
          item.read = true;
        }
      });
      // this.isLoadSmallSpinner = true;
      // this.userMessagesService
      //   .setReadNotification(notificationId)
      //   .pipe(takeUntil(this.destroy))
      //   .subscribe((response) => {
      //     const findNotification = this.notifications.find((item) => item.id === notificationId);
      //     findNotification.body = response.body;
      //     findNotification.images = response.images;
      //     findNotification.isOpen = true;
      //     this.isLoadSmallSpinner = false;
      //     if (findNotification.images) {
      //       const images = response.images.map((url) => ({ src: url, label: null, name: null }));
      //       this.images.splice(0, response.images.length, ...images);
      //     }
      //   });
    }
  }

  onTableDataChange(event) {
    this.router.navigate(['/ubs-user/messages/' + event]);
  }

  openImg(index: number): void {
    this.dialog.open(ShowImgsPopUpComponent, {
      hasBackdrop: true,
      panelClass: 'custom-img-pop-up',
      data: {
        imgIndex: index,
        images: this.images
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
