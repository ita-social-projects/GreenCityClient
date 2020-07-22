import { Component, Input } from '@angular/core';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { ecoNewsIcons } from '@eco-news-images/profile-icons';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-news-list-gallery-view',
  templateUrl: './news-list-gallery-view.component.html',
  styleUrls: ['./news-list-gallery-view.component.scss'],
  changeDetection: 0
})
export class NewsListGalleryViewComponent implements OnInit {
  @Input() ecoNewsModel: EcoNewsModel;

  public profileIcons = ecoNewsIcons;
  public newsImage: string;
  public authorName: string;
  public titleHeightOfElement: number;
  public textHeightOfElement: number;

  constructor() {}

  ngOnInit() {
    this.authorNameValidationOfMinCharacters();
  }

  private authorNameValidationOfMinCharacters(): string {
    return this.authorName = (this.ecoNewsModel.author.name.length >= 10) ?
      ((this.ecoNewsModel.author.name).slice(0, 10) + '...') : (this.ecoNewsModel.author.name);
  }

  public checkNewsImage(): string {
    return this.newsImage = (this.ecoNewsModel.imagePath && this.ecoNewsModel.imagePath !== ' ') ?
      this.ecoNewsModel.imagePath : this.profileIcons.newsDefaultPictureList;
  }
}
