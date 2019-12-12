import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  readonly guyImage = 'assets/img/guy.png';
  readonly path4 = 'assets/img/path-4.png';

  constructor() { }

  ngOnInit() {
  }

}
