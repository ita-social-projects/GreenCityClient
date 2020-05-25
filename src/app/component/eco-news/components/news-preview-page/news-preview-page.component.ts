import { Component, OnInit } from '@angular/core';
import { singleNewsImages } from '../../../../../assets/img/icon/econews/single-news-images';
import { CreateEcoNewsService } from '../../services/create-eco-news.service';
import { NewsResponseDTO } from '../../models/create-news-interface';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import {LocalStorageService} from "../../../../service/localstorage/local-storage.service";

@Component({
  selector: 'app-news-preview-page',
  templateUrl: './news-preview-page.component.html',
  styleUrls: ['./news-preview-page.component.css']
})
export class NewsPreviewPageComponent implements OnInit {
  private images = singleNewsImages;
  private previewItem: FormGroup;
  private actualDate = new Date();
  private userName: string;

  constructor(private createEcoNewsService: CreateEcoNewsService,
              private localStorageService: LocalStorageService,
              private router: Router
  ) { }

  ngOnInit() {
    this.getPreviewData();
    this.setUserName();
  }

  private setUserName(): void {
    this.localStorageService.firstNameBehaviourSubject
      .subscribe(name => {
        this.userName = name;
    });
  }

  private getPreviewData(): void {
    this.previewItem = this.createEcoNewsService.getFormData();
  }

  private postNewsItem(): void {
    this.createEcoNewsService
      .sendFormData(this.previewItem)
      .subscribe((successRes: NewsResponseDTO) => {
        this.router.navigate(['/news']);
      });
  }

  private getImagePath(): string {
    if (this.previewItem.value.image) {
      return this.previewItem.value.image;
    }
    return this.images.largeImage;
  }
}
