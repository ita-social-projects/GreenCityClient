import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-news-list-list-view',
  templateUrl: './news-list-list-view.component.html',
  styleUrls: ['./news-list-list-view.component.css']
})
export class NewsListListViewComponent implements OnInit {
  @Input() id: string;
  @Input() imagePath: string;
  @Input() title: string;
  @Input() text: string;
  @Input() name: string;
  @Input() tag: string;
  @Input() creationDate: number;
  constructor() { }

  readonly profileIcon = 'assets/img/icon/econews/profile-icon.png';
  readonly calendarIcon = 'assets/img/icon/econews/calendar-icon.png';
  readonly shareIcon = 'assets/img/icon/econews/share-icon.png';

  ngOnInit() { }
}
