import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/service/localstorage/local-storage.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  readonly path6 = 'assets/img/path-6_2.png';
  readonly logo = 'assets/img/logo.png';
  readonly iconTw = 'assets/img/icon/icon-tw.png';
  readonly iconFb = 'assets/img/icon/icon-fb.png';
  readonly iconLi = 'assets/img/icon/icon-li.png';
  readonly googlePlay = 'assets/img/icon/g-play.png';
  readonly appStore = 'assets/img/icon/app-store.png';

  constructor(private localStorageService: LocalStorageService) { }
  private userId: number;

  ngOnInit() {
    this.localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
  }

  getUserId(): number | string {
    if (this.userId !== null && !isNaN(this.userId)) {
      return this.userId;
    }
    return 'not_signed_in';
  }
}
