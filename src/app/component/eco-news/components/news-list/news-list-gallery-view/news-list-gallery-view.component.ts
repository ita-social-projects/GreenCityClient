import { Component, OnInit, Input } from '@angular/core';
import { EcoNewsModel } from 'src/app/component/eco-news/models/eco-news-model';
import { ecoNewsIcons } from 'src/assets/img/icon/econews/profile-icons';

@Component({
  selector: 'app-news-list-gallery-view',
  templateUrl: './news-list-gallery-view.component.html',
  styleUrls: ['./news-list-gallery-view.component.scss'],
  changeDetection: 0
})
export class NewsListGalleryViewComponent implements OnInit {
  @Input() ecoNewsModel: EcoNewsModel;

  private profileIcons = ecoNewsIcons;
  private newsText: string;
  private newsImage: string;
  private authorName: string;

  constructor() { }

  ngOnInit() {
    this.textValidationOfMinCharacters();
    this.authorNameValidationOfMinCharacters();
  }

  private textValidationOfMinCharacters(): string {
    return this.newsText = (this.ecoNewsModel.text.length >= 198) ?
      ((this.ecoNewsModel.text).slice(0, 197) + '...') : (this.ecoNewsModel.text);
  }

  private authorNameValidationOfMinCharacters(): string {
    return this.authorName = (this.ecoNewsModel.author.name.length >= 10) ?
      ((this.ecoNewsModel.author.name).slice(0, 10) + '...') : (this.ecoNewsModel.author.name);
  }

  private checkNewsImage(): string {
    return this.newsImage = (this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' ') ?
      this.ecoNewsModel.imagePath : this.profileIcons.newsDefaultPictureList;
  }
}
