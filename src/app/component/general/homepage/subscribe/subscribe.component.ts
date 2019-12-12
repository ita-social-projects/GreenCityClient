import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  readonly qrCode = 'assets/img/qr-code.png';

  constructor() { }

  ngOnInit() { }
}
