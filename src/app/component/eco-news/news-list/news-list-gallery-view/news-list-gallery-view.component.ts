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

  private profileIcons = ecoNewsIcons;
  private newsText: string;

  constructor() { }

  ngOnInit() {
    this.textValidationOfMinCharacters();
  }

  private textValidationOfMinCharacters(): string {
    return this.newsText = (this.ecoNewsModel.text.length > 20) ?
      ((this.ecoNewsModel.text).slice(0, 197) + '...') : (this.ecoNewsModel.text);
  }
}
