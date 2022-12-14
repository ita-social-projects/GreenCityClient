import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FriendModel } from '@global-user/models/friend.model';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-request-item',
  templateUrl: './request-item.component.html',
  styleUrls: ['./request-item.component.scss']
})
export class RequestItemComponent {
  @Input() request: FriendModel;
  @Input() btnName: string;
  @Output() acceptEvent = new EventEmitter<number>();
  @Output() declineEvent = new EventEmitter<number>();
  public userId: number;

  constructor(private router: Router, private localeStorageService: LocalStorageService) {}

  public accept(id: number) {
    this.acceptEvent.emit(id);
  }

  public decline(id: number) {
    this.declineEvent.emit(id);
  }

  public clickHandler(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'button') {
      return;
    } else {
      this.redirectToFriendPage();
    }
  }

  public redirectToFriendPage(): void {
    this.userId = this.localeStorageService.getUserId();
    this.router.navigate(['profile', this.userId, 'friends', this.request.name, this.request.id], {
      queryParams: { tab: 'All firends', index: 3 }
    });
  }
}
