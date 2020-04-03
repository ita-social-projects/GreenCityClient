import { Component, OnInit } from '@angular/core';
import { singleNewsImages } from '../../../../assets/img/icon/econews/single-news-images';
import { CreateEcoNewsService } from '../../../service/eco-news/create-eco-news.service';
import { NewsResponseDTO } from '../create-news/create-news-interface';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-news-preview-page',
  templateUrl: './news-preview-page.component.html',
  styleUrls: ['./news-preview-page.component.css']
})
export class NewsPreviewPageComponent implements OnInit {
  private images = singleNewsImages;
  private previewItem: FormGroup;
  private actualDate = new Date();

  constructor(private createEcoNewsService: CreateEcoNewsService,
              private router: Router
  ) { }

  ngOnInit() {
    this.setPreviewItem();
  }

  private setPreviewItem(): void {
    this.previewItem = this.createEcoNewsService.getFormData();
  }

  private postNewsItem(): void {
    const language = this.createEcoNewsService.getLang();
    this.createEcoNewsService
      .sendFormData(this.previewItem, language)
      .subscribe((successRes: NewsResponseDTO) => {
        this.router.navigate(['/news']);
      });
  }

}
