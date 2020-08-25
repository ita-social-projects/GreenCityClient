import { Component, OnDestroy, OnInit } from '@angular/core';
import { singleNewsImages } from 'src/app/image-pathes/single-news-images';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news-preview-page',
  templateUrl: './news-preview-page.component.html',
  styleUrls: ['./news-preview-page.component.scss']
})
export class NewsPreviewPageComponent implements OnInit, OnDestroy {
  public images = singleNewsImages;
  public previewItem: FormGroup;
  public actualDate = new Date();
  public userName: string;
  public isPosting = false;
  private userNameSub: Subscription;

  constructor(private createEcoNewsService: CreateEcoNewsService,
              private localStorageService: LocalStorageService,
              private router: Router
  ) {}

  ngOnInit() {
    this.getPreviewData();
    this.bindUserName();
  }

  public isBackToEdit(): void {
    this.createEcoNewsService.isBackToEditing = true;
    setTimeout(() => {
      this.createEcoNewsService.isBackToEditing = false;
    }, 1000);
  }

  private bindUserName(): void {
    this.userNameSub = this.localStorageService.firstNameBehaviourSubject
      .subscribe(name => {
        this.userName = name;
    });
  }

  private getPreviewData(): void {
    this.previewItem = this.createEcoNewsService.getFormData();
  }

  public postNewsItem(): void {
    this.isPosting = true;
    this.createEcoNewsService
      .sendFormData(this.previewItem)
      .subscribe(() => {
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
