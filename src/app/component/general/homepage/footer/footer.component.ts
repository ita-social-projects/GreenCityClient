import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() { }
}
