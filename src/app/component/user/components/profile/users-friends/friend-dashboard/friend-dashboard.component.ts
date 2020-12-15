import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-friend-dashboard',
  templateUrl: './friend-dashboard.component.html',
  styleUrls: ['./friend-dashboard.component.scss']
})
export class FriendDashboardComponent implements OnInit {
  public userId: number;
  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.initUser();
  }

  public initUser(): void {
    this.localStorageService.userIdBehaviourSubject
      .subscribe((userId: number) => this.userId = userId);
  }

}
