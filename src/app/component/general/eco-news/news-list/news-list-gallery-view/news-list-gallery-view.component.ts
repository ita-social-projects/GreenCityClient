import { Component, OnInit, Input } from '@angular/core';
import { EcoNewsModel } from 'src/app/model/eco-news/eco-news-model';
import { ecoNewsIcons } from 'src/assets/img/icon/econews/profile-icons';


@Component({
  selector: 'app-news-list-gallery-view',
  templateUrl: './news-list-gallery-view.component.html',
  styleUrls: ['./news-list-gallery-view.component.css']
})
export class NewsListGalleryViewComponent implements OnInit {
  @Input() ecoNewsModel: EcoNewsModel;

  profileIcons = ecoNewsIcons;


  constructor() { }

  // readonly profileIcon = 'assets/img/icon/econews/profile-icon.png';
  // readonly calendarIcon = 'assets/img/icon/econews/calendar-icon.png';
  // readonly shareIcon = 'assets/img/icon/econews/share-icon.png';


  ngOnInit() { }
}
