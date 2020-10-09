import { EcoNewsService } from './../../services/eco-news.service';
import { Observable } from 'rxjs';
import { CreateEcoNewsService } from '@eco-news-service/create-eco-news.service';
import { CreateEditNewsFormBuilder } from './create-edit-news-form-builder';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FilterModel } from '@eco-news-models/create-news-interface';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';

@Component({
  selector: 'app-create-edit-news',
  templateUrl: './create-edit-news.component.html',
  styleUrls: ['./create-edit-news.component.scss']
})
export class CreateEditNewsComponent implements OnInit {
  public isPosting = false;
  public newsData;
  public form: FormGroup;
  public textAreasHeight = {
    minTextAreaScrollHeight: 50,
    maxTextAreaScrollHeight: 128,
    minTextAreaHeight: '48px',
    maxTextAreaHeight: '128px',
  };
  public isLinkOrEmpty = true;
  public newsItemSubscription;
  public filters: Array<FilterModel> = [
    { name: 'News', isActive: false },
    { name: 'Events', isActive: false },
    { name: 'Education', isActive: false },
    { name: 'Initiatives', isActive: false },
    { name: 'Ads', isActive: false }
  ];
  public newsId;

  constructor(private createEditNewsFormBuilder: CreateEditNewsFormBuilder,
              private createEcoNewsService: CreateEcoNewsService,
              private ecoNewsService: EcoNewsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (queryParams) => {
        this.newsId = queryParams.id;
      }
    );


    this.form = this.createEditNewsFormBuilder.getSetupForm();
    if (this.newsId) {
      this.fetchNewsItem();
    }
    this.onSourceChange();
  }

  public autoResize(event): void {
    const checkTextAreaHeight = event.target.scrollHeight > this.textAreasHeight.minTextAreaScrollHeight
      && event.target.scrollHeight < this.textAreasHeight.maxTextAreaScrollHeight;
    const maxHeight = checkTextAreaHeight ? this.textAreasHeight.maxTextAreaHeight
      : event.target.scrollHeight < this.textAreasHeight.minTextAreaScrollHeight;
    const minHeight = checkTextAreaHeight ? this.textAreasHeight.minTextAreaHeight : `${event.target.scrollHeight}px`;
    event.target.style.height = checkTextAreaHeight ? maxHeight : minHeight;
  }

  public onSourceChange(): void {
    this.form.get('source').valueChanges.subscribe(source => {
      this.isLinkOrEmpty = /^$|^https?:\/\//.test(source);
    });
  }

  public onSubmit(): void {
    console.log(this.form.value);
  }

  private fetchNewsItem(): void {
    this.newsItemSubscription = this.ecoNewsService
      .getEcoNewsById(this.newsId)
      .subscribe((item: EcoNewsModel) => {
        console.log(item);
        this.form = this.createEditNewsFormBuilder.getEditForm(item);
      });
  }
}
