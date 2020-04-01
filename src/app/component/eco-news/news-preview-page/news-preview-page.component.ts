import { Component, OnInit } from '@angular/core';
import { singleNewsImages } from '../../../../assets/img/icon/econews/single-news-images';
import { CreateEcoNewsService } from '../../../service/eco-news/create-eco-news.service';
import { NewsDTO } from '../create-news/create-news-interface';

@Component({
  selector: 'app-news-preview-page',
  templateUrl: './news-preview-page.component.html',
  styleUrls: ['./news-preview-page.component.css']
})
export class NewsPreviewPageComponent implements OnInit {
  private images = singleNewsImages;
  private previewItem: NewsDTO;
  private actualDate = new Date();

  constructor(private createEcoNewsService: CreateEcoNewsService) { }

  ngOnInit() {
    this.setPreviewItem();
  }

  private setPreviewItem(): void {
    this.previewItem = this.createEcoNewsService.getFormData();
  }

}
