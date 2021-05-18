import { singleNewsImages } from './../../../../image-pathes/single-news-images';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subscription } from 'rxjs';
import { ACTION_TOKEN } from '../create-edit-news/action.constants';
import { ActionInterface } from '../../models/action.interface';

@Component({
  selector: 'app-news-preview-page',
  templateUrl: './news-preview-page.component.html',
  styleUrls: ['./news-preview-page.component.scss'],
})
export class NewsPreviewPageComponent implements OnInit, OnDestroy {
  public images = singleNewsImages;
  public previewItem: FormGroup;
  public actualDate = new Date();
  public userName: string;
  public isPosting = false;
  private userNameSub: Subscription;
  public attributes: ActionInterface;
  public newsId: string;
  public onSubmit;

  constructor(
    private createEcoNewsService: CreateEcoNewsService,
    private localStorageService: LocalStorageService,
    private router: Router,
    @Inject(ACTION_TOKEN) private config: { [name: string]: ActionInterface }
  ) {}

  ngOnInit() {
    this.getPreviewData();
    this.bindUserName();
    if (this.createEcoNewsService.getNewsId()) {
      this.newsId = this.createEcoNewsService.getNewsId();
      this.attributes = this.config.edit;
      this.onSubmit = this.editNews;
    } else {
      this.attributes = this.config.create;
      this.onSubmit = this.postNewsItem;
    }
  }

  public isBackToEdit(): void {
    this.createEcoNewsService.isBackToEditing = true;
    setTimeout(() => {
      this.createEcoNewsService.isBackToEditing = false;
    }, 1000);
  }

  private bindUserName(): void {
    this.userNameSub = this.localStorageService.firstNameBehaviourSubject.subscribe((name) => {
      this.userName = name;
    });
  }

  private getPreviewData(): void {
    this.previewItem = this.createEcoNewsService.getFormData();
  }

  public postNewsItem(): void {
    this.isPosting = true;
    this.createEcoNewsService.sendFormData(this.previewItem).subscribe(() => {
      this.isPosting = false;
      this.router.navigate(['/news']);
    });
  }

  public editNews(): void {
    const dataToEdit = {
      ...this.previewItem.value,
      id: this.newsId,
    };

    this.createEcoNewsService.editNews(dataToEdit).subscribe(() => {
      this.isPosting = false;
      this.router.navigate(['/news']);
    });
  }

  public getImagePath(): string {
    if (this.previewItem.value.image) {
      return this.previewItem.value.image;
    }
    return this.images.largeImage;
  }

  ngOnDestroy() {
    this.userNameSub.unsubscribe();
  }
}
