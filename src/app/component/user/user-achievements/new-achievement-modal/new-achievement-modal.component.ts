import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-achievement-modal',
  templateUrl: './new-achievement-modal.component.html',
  styleUrls: ['./new-achievement-modal.component.css']
})
export class NewAchievementModalComponent implements OnInit {

  readonly achieve = 'assets/img/achieve.png';
  constructor() { }
  ngOnInit() {
  }

}
