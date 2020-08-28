import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-habits-list-view',
  templateUrl: './habits-list-view.component.html',
  styleUrls: ['./habits-list-view.component.scss']
})
export class HabitsListViewComponent implements OnInit {
  @Input() habit;

  constructor() { }

  ngOnInit() {
  }

}
