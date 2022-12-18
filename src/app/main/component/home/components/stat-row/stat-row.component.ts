import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckTokenService } from '@global-service/auth/check-token/check-token.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

@Component({
  selector: 'app-stat-row',
  templateUrl: './stat-row.component.html',
  styleUrls: ['./stat-row.component.scss']
})
export class StatRowComponent implements OnInit {
  /* TODO Replace with entity*/
  @Input() stat: { action; caption; count; question; iconPath; locationText };
  @Input() index: number;

  userId: number;

  readonly locationImage = 'assets/img/icon/location-icon.png';

  constructor(private router: Router, private checkTokenservice: CheckTokenService, private localService: LocalStorageService) {}

  ngOnInit() {
    this.localService.userIdBehaviourSubject.subscribe((userId) => (this.userId = userId));
  }

  startHabit(): void {
    this.userId ? this.router.navigate(['/profile', this.userId]) : this.checkTokenservice.openAuthModalWindow();
  }
}
